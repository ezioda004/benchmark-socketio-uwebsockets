import { App } from "uwebsockets.js";


class UWebSockets {
    private app;
    private clients = new Map();
    
    constructor() {
        console.log("UWebSockets constructor");
        this.app = App().ws("/*", {
            /* Options */
            compression: 0,
            maxPayloadLength: 16 * 1024 * 1024,
            idleTimeout: 10,
            /* Handlers */
            open: (ws) => {
                this.clients.set(Math.random().toString().slice(2), ws);
                console.log("A WebSocket connected!");
                ws.subscribe("room");
            },
            message: (ws, message, isBinary) => {
                /* Ok is false if backpressure was built up, wait for drain */
                let ok = ws.send(message, isBinary);
            },
        }).any("/*", (res, req) => {
            res.end("Nothing to see here!");
        });

        this.app.listen(3000, (listenSocket) => {
            console.log("Listening to port 3000", listenSocket);
        });

        setInterval(() => {
            console.log("clients connected so far", this.clients.size);
        }, 10000);
    }

    public emit(message: string) {
        this.app.publish("room", message);
    }
}

export { UWebSockets };