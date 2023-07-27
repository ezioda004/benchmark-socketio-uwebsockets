import WebSocket, { RawData } from 'ws';
import { nanoid } from 'nanoid'
import { delay, randomize } from '../util.js';

import { Logger } from "../logger.js";
const logger = Logger.getLogger("uskt.client");

let messageId = 0;
class WebSocketClient {
    socket: WebSocket;
    url: string;
    id: string;
    count?: number;
    pingInterval: number;
    constructor(url: string, count?: number) {
        logger.log("WebSocketClient constructor", count);
        this.url = url;
        this.count = count;
        this.id = count + ''; //+ "::" + nanoid();
        this.socket = new WebSocket(this.url);
        this.pingInterval = Date.now();
        this.addListeners();
    }

    public async sendToChannel() {
        if (this.socket.readyState == WebSocket.OPEN) {
            for (let i = 0; ; i++) {
                messageId++;
                this.socket.send(this.getHelloMessageBuffer());
                logger.log('sendToChannel clientid, messageId:', this.id, messageId);
                await delay(9e3, 10e3);
            }
            // let interval = setInterval(() => {
            //     this.socket.send(this.getHelloMessageBuffer());
            //     messageId++;
            //     logger.log('sendToChannel clientid, messageId:', this.id, messageId);
            //     if (messageId > 5) {
            //         logger.log('calling clearInterval');
            //         clearInterval(interval);
            //     }
            // }, randomize(5e3, 10e3));
        }

        // this.socket.send(message);
    }

    private getHelloMessageBuffer(): Buffer {
        return Buffer.from(`clientid:${this.id}::messageId:${messageId}`);
    }

    private addListeners() {
        this.socket.on("close", (skt: WebSocket, code: number, reason: Buffer) => {
            logger.log(`close event: ${this.id}, code: ${code}, reason: ${reason?.toString()}`, skt);
        });

        this.socket.on("error", (skt: WebSocket, err: Error) => {
            logger.error(`socket error: ${this.id}, err:`, err);
        });
        
        this.socket.on("message", (...args) => {
            logger.log(`Received server message on: ${this.id}::`, args[0].toString(), args[1]);
        });

        this.socket.on("ping", (skt: WebSocket, data: Buffer) => {
            this.pingInterval = (Date.now() - this.pingInterval) % 1e3;
            logger.log(`ping event ${this.id}, data: ${skt?.toString()}, ping interval: ${this.pingInterval}`);
        });

        // this.socket.on("pong", (skt: WebSocket) => {
        //     this.pingInterval = (Date.now() - this.pingInterval) % 1e3;
        //     logger.log(`pong event ${this.id}, data: ${skt?.toString()}, ping interval: ${this.pingInterval}`);
        // });

        this.socket.on("upgrade", (skt: WebSocket) => {
            logger.log(`socket upgrade: ${this.id}`)
        });

        this.socket.on('open', () => {
            logger.log("client connection open: ", this.id);
            this.sendToChannel();
        });
    }
}

export { WebSocketClient };