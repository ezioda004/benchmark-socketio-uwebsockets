import { App, WebSocket } from "uwebsockets.js";
import { redisClient } from "../redis/redisClient.js";

function smallUuid(): string {
    return Math.random().toString(36).substring(2);
}

const textDecoderInstance = new TextDecoder()

class UWebSockets {
    private app;
    private clients = new Array<number>();
    private serverId = smallUuid();

    constructor() {

        console.log("UWebSockets constructor");
        this.app = App().ws("/*", {
            /* Options */
            compression: 0,
            maxPayloadLength: 16 * 1024 * 1024,
            idleTimeout: 10,
            closeOnBackpressureLimit: 1, // drop connection when backpressure is achieved
            /* Handlers */
            open: (ws) => {
                this.clients.push(1);
                console.log("A WebSocket connected!");
                ws.subscribe("room");
            },
            message: (ws, message, isBinary) => {
                console.log("Got a message!", message, isBinary);
                /* Ok is false if backpressure was built up, wait for drain */
                // let ok = ws.send(message, isBinary);
                const text = textDecoderInstance.decode(message);
                this.emit(text);
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
        });

        redisClient.subscribeToChannel("room");
        
        redisClient.addSubscribeEventListener((channel: string, message: any) => {
            console.log("addSubscribeEventListener::message::channel", channel, message.length);
            if (message.serverId === this.serverId) {
                return;
            }
            this.app?.publish("room", message.message);
        });

        // setInterval(() => {
        //     console.log("clients connected so far", this.clients.length);
        // }, 1000);
    }

    public emit<T>(message: string) {
        this.app.publish("room", message);
        redisClient.publishToChannel("room", { message, serverId: this.serverId });
    }
}

export { UWebSockets };