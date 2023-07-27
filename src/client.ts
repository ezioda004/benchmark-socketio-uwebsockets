import { WebSocketClient } from "./uwebsockets/websocketClient.js";
import { SocketClient } from "./socketio/socketioClient.js"


function main() {
    console.log("main");
    console.log("process.env.PORT", process.env.PORT);

    const url = `ws://localhost:${process.env.PORT}`

    for (let i = 0; i < 2; i++) {
        let client: WebSocketClient;
        const type = process.env.TYPE;
        // if (type === "SOCKETIO") {
            // client = new SocketClient(url);
        // }
        // else if (type === "UWEBSOCKETS") {
            client = new WebSocketClient(url);
        // }
        // else {
        //     throw new Error("Unknown type");
        // }

        client.socket.on("message", (message) => {
            console.log("got message from server", message.toString());
        });

        setTimeout(() => {
            // console.log("")
            client.send("hello");
        }, 5000);
    }
}

main();