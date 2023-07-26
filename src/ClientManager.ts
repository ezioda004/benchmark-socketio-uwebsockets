import { WebSocket } from "uwebsockets.js";
import { redis } from "./redis.js"
import { ab2str } from "./util.js";
import { Logger } from "./logger.js";
const logger = Logger.getLogger("uskt.serverstats");

// class ClientSocket {
//     private skt: WebSocket;
//     private bufferedMessages: ArrayBuffer[];
//     private isAllowedToSend: boolean;
//     constructor(skt: WebSocket, isAllowedToSend: boolean, bufferedMessage: ArrayBuffer) {
//         this.skt = skt;
//         this.isAllowedToSend = isAllowedToSend;
//         this.bufferedMessages = [bufferedMessage];
//     }
//     pushMessageToBuffer(msg: ArrayBuffer) {
//         this.bufferedMessages.push(msg);
//     }
//     getBufferedMessages(): ArrayBuffer[] {
//         return this.bufferedMessages;
//     }
//     setIsAllowedToSend(isAllowedToSend: boolean) {
//         this.isAllowedToSend = isAllowedToSend;
//     }
// }
class ClientManager {
    CLIENT_COUNT_KEY = "CLIENT_COUNT";
    totalConnections: number;
    totalDisConnections: number;
    online: number;
    totalTransmittedMessages: number;
    backPressureCount: number
    serverBackPressureCount: number
    streamEnteriesDeleted: number;
    sktsWaitingOnBackPressure: { [ip: string]: WebSocket<any> };
    sktsWaitingOnBackPressureCount: number;
    sktsDrained: number;
    constructor() {
        this.totalConnections = 0;
        this.totalDisConnections = 0;
        this.online = 0;
        this.totalTransmittedMessages = 0;
        this.backPressureCount = 0;
        this.serverBackPressureCount = 0;
        this.streamEnteriesDeleted = 0;
        this.sktsWaitingOnBackPressureCount = 0;
        this.sktsWaitingOnBackPressure = {};
        this.sktsDrained = 0;
    }

    addSktsWaitingOnBackPressure(skt: WebSocket<any>) {
        let ip = ab2str(skt.getRemoteAddressAsText());
        if (!this.sktsWaitingOnBackPressure[ip]) {
            this.sktsWaitingOnBackPressure[ip] = skt;
        }
        this.sktsWaitingOnBackPressureCount = Object.keys(this.sktsWaitingOnBackPressure).length;
    }

    removeSktsWaitingOnBackPressure(skt: WebSocket<any>) {
        let ip = ab2str(skt.getRemoteAddressAsText());
        delete this.sktsWaitingOnBackPressure[ip];
        this.sktsWaitingOnBackPressureCount = Object.keys(this.sktsWaitingOnBackPressure).length;
        ++this.sktsDrained;
    }

    // getSktsWaitingOnBackPressure(ip: string) {
    //     return this.sktsWaitingOnBackPressure[ip];
    // }

    connect() {
        redis.incr(this.CLIENT_COUNT_KEY, (err, count) => {
            if (err) logger.error(err);
            logger.log(`client connected, online count: ${count}`);
            ++this.online;
            ++this.totalConnections;
        }); 
    }
    disconnect() {
        redis.decr(this.CLIENT_COUNT_KEY, (err, count) => {
            if (err) logger.error(err);
            logger.log(`client disconnected, online count:`, count);
            --this.online;
            ++this.totalDisConnections;
        });
    }
    // subscribe(stream: string) {

    // }
    // unsubscribe(stream: string) {

    // }
    printStats() {
        const stats: string[] = [];
        for (const key in this) {
            if (Object.prototype.hasOwnProperty.call(this, key)) {
                stats.push(`${key}: ${this[key]}`)
            }
        }
        logger.log(stats.join(' '));
    }
}

export const clientManager = new ClientManager();
