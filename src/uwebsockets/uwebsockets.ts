import { App, WebSocket, SHARED_COMPRESSOR } from "uwebsockets.js";
import { redisClient } from "../redis/redisClient.js";

function smallUuid(): string {
    return Math.random().toString(36).substring(2);
}

const textDecoderInstance = new TextDecoder();
const textEncoderInstance = new TextEncoder();

let messageQueue: string[] = [];
const MAX_MESSAGE_QUEUE_SIZE = 25;
class UWebSockets {
    private app;
    private clients = new Array<number>();
    private serverId = smallUuid();
    constructor() {
        console.log("UWebSockets constructor");
        this.app = App().ws("/*", {
            /* Options */
            compression: SHARED_COMPRESSOR,
            maxPayloadLength: 16 * 1024 * 1024,
            idleTimeout: 10,
            sendPingsAutomatically: true,
            maxBackpressure: 64 * 1024, // default value,
            closeOnBackpressureLimit: 1, // drop connection when backpressure is achieved
            /* Handlers */
            open: (ws) => {
                this.clients.push(1);
                console.log("A WebSocket connected!");
                ws.subscribe("room");
            },
            message: (ws, message, isBinary) => {
                console.log("Got a message!", isBinary);
                /* Ok is false if backpressure was built up, wait for drain */
                // let ok = ws.send(message, isBinary);
                const text = textDecoderInstance.decode(message);
                this.pushToQueue(text);
            },
            drain: () => {

            },
            close: (ws, code, message) => {
                this.clients.pop();
                console.log("WebSocket closed")
            }
        }).any("/*", (res, req) => {
            res.end("Nothing to see here!");
        });

        this.app.listen(3000, (listenSocket) => {
            console.log("Listening to port 3000", listenSocket);
            setInterval(() => {
                this.emit();
            }, 1e3)
            this.listenForMessage();
        });

        // redisClient.subscribeToChannel("room");
        
        // redisClient.addSubscribeEventListener((channel: string, message: any) => {
        //     console.log("addSubscribeEventListener::message::channel", channel, message.message.length);
        //     if (message.serverId === this.serverId) {
        //         return;
        //     }
        //     this.app?.publish("room", message.message);
        // });

        // setInterval(() => {
        //     console.log("clients connected so far", this.clients.length);
        // }, 1000);
    }

    public pushToQueue(message:string) {
        if (messageQueue.length < MAX_MESSAGE_QUEUE_SIZE) {
            console.log("pushed message:", messageQueue.length);
            messageQueue.push(message);
        }
    }

    public emit<T>() {
        console.log("broadcasting messages");
        for (const message of messageQueue) {           
            this.app.publish("room", message);
            // redisClient.publishToChannel("room", { message, serverId: this.serverId });
            redisClient.addToStream("room", message);
        }
        messageQueue = [];
    }

    async listenForMessage(channelId = "room", lastId = "$") {
        const results = await redisClient.subClient.xread("BLOCK", 0, "STREAMS", channelId, lastId);
        if (results) {
            // `key` equals to "mystream"
            const [key, messages] = results[0];
            // console.log('redis stream message:', key, messages);
            messages
                .filter(msg => msg[1][0] != String(process.pid))
                .forEach(msg => {
                    // console.log('message from stream:', message);
                    // this.emitToLocalRoom(ROOM, str2ab(msg[1][1]));
                    // INFO: publish binary message to 
                    this.app?.publish("room", textEncoderInstance.encode(msg[1][1]));
                });

            lastId = messages[messages.length - 1][0];
        }
        console.log("lastId:", lastId);
        // Pass the last id of the results to the next round.
        await this.listenForMessage(lastId);
    }
}

export { UWebSockets };