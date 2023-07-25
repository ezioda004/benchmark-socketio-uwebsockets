import { WebSocketClient } from "./uwebsockets/websocketClient.js";
import { SocketClient } from "./socketio/socketioClient.js"


function main() {
    console.log("main");
    console.log("process.env.PORT", process.env.PORT);
    // const socketClient = new SocketClient();

    const url = `wss://localhost:3000`

    for (let i = 0; i < 1; i++) {
        let client: SocketClient | WebSocketClient;
        const type = process.env.TYPE ?? "1";
        if (type === "0") {
            client = new SocketClient(url);
        }
        else if (type === "1") {
            client = new WebSocketClient(url);
        }
        else {
            throw new Error("Unknown type");
        }

        client.socket.on("message", (message) => {
            console.log("got message from server", message.toString());
        });
    }
}

main();

/**
 * TODO
 * Run app on multiple processes:
 * 1. add redis to store connected clients
 * 2. Redis streams for pub-sub
 * 3. 
 */