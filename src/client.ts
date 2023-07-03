import { WebSocketClient } from "./uwebsockets/websocketClient.js";
import { SocketClient } from "./socketio/socketioClient.js"


function main() {
    console.log("main");
    console.log("process.env.PORT", process.env.PORT);
    // const socketClient = new SocketClient();


    for (let i = 0; i < 100; i++) {
        const type = process.env.TYPE;
        if (type === "SOCKETIO") {
            const socketClient = new SocketClient();
        }
        else if (type === "UWEBSOCKETS") {
            const websocketClient = new WebSocketClient();
        }    
    }
}

main();