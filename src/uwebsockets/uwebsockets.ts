import { App } from "uwebsockets.js";
import { mongoClient } from "../modules/mongo.js";


class UWebSockets {
    private app;
    private clients = new Array<number>();
    private decoder = new TextDecoder();

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
        }).post("/api/collect", (res, req) => {
            console.log("got request");
            let body = "";
            res.onData((chunk, isLast) => {
                body += this.handleBuffer(chunk);
                if (isLast) {
                    console.log("body", body, isLast);
                    const objToSave: Array<{ mId: string, cIds: Array<string>, sessionId: string }> = JSON.parse(body);
                    console.log("objToSave", objToSave);
                    for (let i = 0; i < objToSave.length; i++) {
                        const { mId, cIds, sessionId } = objToSave[i];
                        mongoClient.findAndUpsert({ mId }, { "$push": { cIds: { "$each": cIds } }, "$set": { mId, sessionId }, "$setOnInsert": { serverTime: new Date() } });
                    }
                    res.writeStatus("200 OK").end("Ok");
                }
            });
            res.onAborted(() => {
                res.writeStatus("200 OK").end();
            });
        })
            .any("/*", (res, req) => {
                res.end("Nothing to see here!");
            });

        this.app.listen(3000, (listenSocket) => {
            console.log("Listening to port 3000", listenSocket);
        });

        setInterval(() => {
            console.log("clients connected so far", this.clients.length);
        }, 5000);
    }

    handleBuffer(buffer: ArrayBuffer) {
        return this.decoder.decode(buffer);
    }

    public emit(message: string) {
        this.app.publish("room", message);
    }
};

export { UWebSockets };