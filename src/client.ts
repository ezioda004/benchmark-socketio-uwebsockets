import { WebSocketClient } from "./uwebsockets/websocketClient.js";
import { SocketClient } from "./socketio/socketioClient.js"


function main() {
    console.log("main");
    console.log("process.env.PORT", process.env.PORT);

    const url = `wss://benchmarking.physicswallahlive.net`

    for (let i = 0; i < 2000; i++) {
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
            console.log("got message from server", message.toString().length);
        });

        // setTimeout(() => {
        //     // console.log("")
        //     client.send("hello");
        // }, 5000);
    }
}

main();