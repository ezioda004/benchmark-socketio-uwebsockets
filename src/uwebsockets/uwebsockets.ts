import { App } from "uwebsockets.js";


class UWebSockets {
    private app;
    private clients = new Array<number>();
    
    constructor() {
        console.log("UWebSockets constructor");
        this.app = App().ws("/*", {
            /* Options */
            compression: 0,
            maxPayloadLength: 16 * 1024 * 1024,
            idleTimeout: 10,
            /* Handlers */
            open: (ws) => {
                this.clients.push(1);
                console.log("A WebSocket connected!");
                ws.subscribe("room");
            },
            message: (ws, message, isBinary) => {
                /* Ok is false if backpressure was built up, wait for drain */
                let ok = ws.send(message, isBinary);
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

        setInterval(() => {
            console.log("clients connected so far", this.clients.length);
        }, 1000);
    }

    public emit(message: string) {
        this.app.publish("room", message);
    }
}

export { UWebSockets };