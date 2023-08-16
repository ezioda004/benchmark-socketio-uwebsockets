import { WebSocketClient } from "./uwebsockets/websocketClient.js";
import { SocketClient } from "./socketio/socketioClient.js"


function main() {
    console.log("main");
    console.log("process.env.PORT", process.env.PORT);
    // const socketClient = new SocketClient();

    for (let i = 0; i < 2500; i++) {
        const userId = Math.floor(Math.random() * 1000000000);
        const url = `wss://live-be.physicswallahlive.net/ws?sessionId=64cb7ce172e916150dbe407f&sessionRole=STUDENT&fullName=sst&userId=${userId}`
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

        client.socket.on("message", (message) => {
            console.log("got message from server", message.toString());
        });
    }
}

main();