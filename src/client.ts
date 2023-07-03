import { WebSocketClient } from "./uwebsockets/websocketClient.js";
import { SocketClient } from "./socketio/socketioClient.js"


function main() {
    console.log("main");
    console.log("process.env.PORT", process.env.PORT);
    // const socketClient = new SocketClient();


    for (let i = 0; i < 10000; i++) {
        let client: SocketClient | WebSocketClient;
        const type = process.env.TYPE;
        if (type === "SOCKETIO") {
            client = new SocketClient();
        }
        else if (type === "UWEBSOCKETS") {
            client = new WebSocketClient();
        }
        else {
            throw new Error("Unknown type");
        }

        client.socket.on("message", (message) => {
            console.log("got message from server", message);
        });
    }
}

main();