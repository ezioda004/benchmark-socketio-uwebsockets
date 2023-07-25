import { App, SHARED_COMPRESSOR } from "uwebsockets.js";
import { clientManager } from "../ClientManager.js";
import { logger } from "../logger.js"

class UWebSockets {
    private app;
    constructor() {
        console.log("UWebSockets constructor");
        this.app = App().ws("/*", {
            /* Options */
            compression: SHARED_COMPRESSOR,
            maxPayloadLength: 16 * 1024,
            idleTimeout: 60, // 1 min
            closeOnBackpressureLimit: 1, // true
            /* Handlers */
            open: (ws) => {
                logger.info('userdata:', ws.getUserData());
                clientManager.connect();
                ws.subscribe("room");
            },
            message: (ws, message, isBinary) => {
                /* Ok is false if backpressure was built up, wait for drain */
                let ok = ws.send(message, isBinary);
            },
            close: (ws, code, message) => {
                clientManager.disconnect();
                console.log("WebSocket closed")
            }
        }).any("/*", (res, req) => {
            res.end("Nothing to see here!");
        });

        this.app.listen(3000, (listenSocket) => {
            console.log("Listening to port 3000", JSON.stringify(listenSocket));
        });
    }

    public emit(message: string) {
        this.app.publish("room", message);
    }
}

export { UWebSockets };