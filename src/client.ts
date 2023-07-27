import { delay } from "./util.js";
import { WebSocketClient } from "./uwebsockets/websocketClient.js";
const url = `ws://13.233.122.149:3000`
// const url = `ws://localhost:3000`


async function main() {
    for (let i = 0; i < 2000; i++) {
        let client = new WebSocketClient(url, i);
        await delay(200, 500);
    }
}

main();