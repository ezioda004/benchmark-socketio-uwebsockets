import { WebSocketClient } from "./uwebsockets/websocketClient.js";
const url = `ws://localhost:3000`

function main() {
    for (let i = 0; i < 3; i++) {
        let client = new WebSocketClient(url, i);
    }
}

main();