import { App, SHARED_COMPRESSOR } from "uwebsockets.js";
import { clientManager } from "../ClientManager.js";
import { redis, streamSubscriber } from "../redis.js"
import { ab2str, isMasterProcess, str2ab } from "../util.js";
import { Logger } from "../logger.js"
const logger = Logger.getLogger("uskt.server");


// const logger = logger.getlogger("uskt.server");

// @see https://datatracker.ietf.org/doc/html/rfc6455#section-7.1.5
const ROOM = "ROOM";
const MAX_BACKPRESSURE_LENGTH = 64 * 1024; // default value
class UWebSockets {
    private app;
    constructor() {
        this.app = App().ws("/*", {
            /* Options */
            compression: SHARED_COMPRESSOR,
            maxPayloadLength: 16 * 1024,
            idleTimeout: 60, // 1 min
            closeOnBackpressureLimit: 1, // true
            sendPingsAutomatically: true,
            maxBackpressure: MAX_BACKPRESSURE_LENGTH,
            /* Handlers */
            open: (ws) => {
                logger.log('connected to pid:', process.pid)
                clientManager.connect();
                let isSubscribed = ws.subscribe(ROOM);
                logger.log('client subscribed:', isSubscribed);
            },
            message: (ws, message, isBinary) => {
                const msgStr = ab2str(message);
                logger.log('Server received message:', msgStr, isBinary, true);
                let isAck = ws.publish(ROOM, message);
                logger.log('skt publish ACK:', isAck, message);
                this.publishToRedisStream(ROOM, message);
                
                // if (ws.getBufferedAmount() < MAX_BACKPRESSURE_LENGTH) {
                //     const msgStr = ab2str(message);
                //     logger.log('Server received message:', msgStr, isBinary, true);
                //     let isAck = ws.publish(ROOM, message, true, true);
                //     // let isAck = ws.send(message, true, true);
                //     /* isAck is false if backpressure was built up, wait for drain */
                //     logger.log('skt publish ACK:', isAck, message);
                //     if (isAck) {
                //         // publish to redis only if it is published in local room?
                //         this.publishToRedisStream(ROOM, message);
                //     } else {
                //         // todo: handle backpressure
                //         ++clientManager.backPressureCount;
                //     }
                // } else {
                //     clientManager.addSktsWaitingOnBackPressure(ws);
                // }
            },
            // drain: (ws) => {
            //     clientManager.removeSktsWaitingOnBackPressure(ws);
            // },
            close: (ws, code, message) => {
                clientManager.disconnect();
                logger.log("WebSocket closed:", ws, code, ab2str(message));
            }
        }).any("/*", (res, req) => {
            res.end("Nothing to see here!");
        });

        this.app.listen(3000, (listenSocket) => {
            logger.log("Listening to port 3000", listenSocket);
            this.listenForMessage();
        });

        this.runJobs();
    }

    private runJobs() {
        // INFO: Run every 60s on master node only
        if (isMasterProcess()) {
            setInterval(() => {
                this.trimStrim();
                clientManager.printStats();
            }, 60e3);
        }
    }

    public emitToLocalRoom(room: string, message: ArrayBuffer) {
        let isAck = this.app.publish(room, message);
        logger.log('server sent message status:', message, isAck);
        if (!isAck) {
            ++clientManager.serverBackPressureCount;
        }
    }

    private trimStrim() {
        redis.xlen(ROOM, (err, len) => {
            if (err) logger.error("xlen error:", err);
            else {
                logger.log("current stream len:", len);
                clientManager.totalTransmittedMessages = len!;
                redis.xtrim(ROOM, "MAXLEN", "~", 24e3, (err, enteriesDeleted) => {
                    if (err) logger.error("xtrim error:", err);
                    else {
                        clientManager.streamEnteriesDeleted = enteriesDeleted!;
                    }
                });
            }
        });
    }

    publishToRedisStream(room: string, message: ArrayBuffer) {
        logger.log('publish check');
        redis.xadd(room, "*", process.pid, Buffer.from(message), (err, id) => {
            if (err) logger.error('xadd err:', err);
            logger.log(`xadd id: ${id}`);
        });
    }

    async listenForMessage(lastId = "$") {
        // `results` is an array, each element of which corresponds to a key.
        // Because we only listen to one key (mystream) here, `results` only contains
        // a single element. See more: https://redis.io/commands/xread#return-value
        const results = await streamSubscriber.xread("BLOCK", 0, "STREAMS", ROOM, lastId);
        if (results) {
            // `key` equals to "mystream"
            const [key, messages] = results[0];
            logger.log('redis stream message:', key, messages);
            messages
                .filter(msg => msg[1][0] != String(process.pid))
                .forEach(msg => {
                    logger.log('msg from stream:', msg);
                    this.emitToLocalRoom(ROOM, str2ab(msg[1][1]));
                });

            lastId = messages[messages.length - 1][0];
        }
        logger.log("lastId:", lastId);
        // Pass the last id of the results to the next round.
        await this.listenForMessage(lastId);
    }
}

export { UWebSockets };