import { WebSocketClient } from "./uwebsockets/websocketClient.js";
import { SocketClient } from "./socketio/socketioClient.js"


function main() {
    console.log("main");
    console.log("process.env.PORT", process.env.PORT);

    const url = `wss://benchmarking.physicswallahlive.net`

    for (let i = 0; i < 1000; i++) {
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



        setInterval(() => {
            client.send("Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla quis eros id nisi pellentesque sagittis. Nam eu velit faucibus, tempor neque at, volutpat mauris. Vestibulum tristique tortor vel ex tincidunt dignissim. Integer ultrices malesuada dolor, ut feugiat elit tristique in. Fusce mattis feugiat condimentum. Sed vel augue sit amet neque suscipit dictum. Duis semper, justo a malesuada feugiat, sem tortor cursus sem, sed tempus ligula enim et lacus. Quisque cursus vestibulum enim nec sollicitudin. Integer ac tellus ullamcorper, finibus risus in, vulputate neque. In euismod sem id gravida efficitur. Curabitur vel scelerisque neque. Vestibulum euismod rutrum tellus, vitae volutpat massa scelerisque ac. Donec egestas lectus sit amet est laoreet, eu scelerisque risus rutrum. Cras bibendum mi sed nisl ultrices auctor. Morbi vitae facilisis dolor, sit amet faucibus elit.");
        }, getRandomTime());
    }
}

function getRandomTime() {
    // Generate a random number between 1 and 20 (inclusive of 1, but not 20)
    const randomTimeInSeconds = Math.floor(Math.random() * 20) + 1;
    return randomTimeInSeconds * 1000; // Convert to milliseconds
}

main();