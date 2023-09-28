import { WebSocketClient } from "./uwebsockets/websocketClient.js";
import { SocketClient } from "./socketio/socketioClient.js"

let ackBuffer: { [key: string]: { mId: string, cIds: Array<string>, sessionId: string }} = {};


function main() {
    console.log("main");
    console.log("process.env.PORT", process.env.PORT);
    // const socketClient = new SocketClient();

    const clients = new Map<string, SocketClient | WebSocketClient>();
    

    for (let i = 0; i < 1; i++) {
        const userId = Math.floor(Math.random() * 1000000000);
        // const host = "ws://localhost:8080"; 
        const host = "wss://lt-1-stage-api.penpencil.co/pw-live-class/ws";
        const url = `${host}?context=poll&scheduleId=123&${userId}`
        let client: SocketClient | WebSocketClient;
        const type = process.env.TYPE;
        if (type === "SOCKETIO") {
            client = new SocketClient(url);
        }
        else if (type === "UWEBSOCKETS") {
            client = new WebSocketClient(url);
        }
        else {
            throw new Error("Unknown type");
        }

        let clientId = "";

        client.socket.on("message", (_message: Buffer) => {
            console.log("got message from server", _message);
            const [context, ...messageObj] = _message.toString().split(' ');
            const message = JSON.parse(messageObj.join(' '))
            if (context === "connected") {
                clients.set(message.id, client);
                clientId = message.id;
            }
            else {
                if (ackBuffer[message.mId]) {
                    ackBuffer[message.mId].cIds.push(clientId);
                }
                else {
                    ackBuffer[message.mId] = { mId: message.mId, cIds: [clientId], sessionId: message.sessionId };
                }
            }
            console.log("got message from server", message);

        });
    }


    setInterval(() => {
        console.log("ackBuffer", ackBuffer);
        flushAckBuffer();
    }, 5000);
}


function flushAckBuffer() {
    const keys = Object.keys(ackBuffer);
    const arr: any = [];
    keys.forEach((key) => {
        const { mId, cIds, sessionId } = ackBuffer[key];
        arr.push({ mId, cIds, sessionId });
    });
    if (arr.length === 0) return;
    ackBuffer = {};
    // const url = "http://localhost:3000/api/collect";
    const url = "https://benchmarking.physicswallahlive.net/api/collect";
    fetch(url, {
        method: "POST",
        body: JSON.stringify(arr),
    })
}

main();