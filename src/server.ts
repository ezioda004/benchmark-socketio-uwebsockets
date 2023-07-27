import { SocketIO } from "./socketio/socketio.js";
import express from "express";
import { createServer } from "http";
import { UWebSockets } from "./uwebsockets/uwebsockets.js";



async function startSocketIO() {

    const app = express();
    app.get("/", (req, res) => {
        res.send("Hello World");
    });
    const server = createServer(app);
    const socketio = new SocketIO(server);
    server.listen(3000, () => {
        console.log("listening on *:3000");
    });
    return socketio;
}


async function startUWebSockets() {
    const uwebsockets = new UWebSockets();
    return uwebsockets;
}

async function main() {
    const type = process.env.TYPE;
    console.log("main", type);
    let server: Awaited<ReturnType<typeof startSocketIO>> | Awaited<ReturnType<typeof startUWebSockets>>;
    if (type === "SOCKETIO") {
        server = await startSocketIO();
    }
    else if (type === "UWEBSOCKETS") {
        server = await startUWebSockets();
    }
    else {
        throw new Error("Unknown type");
    }

    const message = { // sample 1kb message
        type: 'message',
        data: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla quis eros id nisi pellentesque sagittis. Nam eu velit faucibus, tempor neque at, volutpat mauris. Vestibulum tristique tortor vel ex tincidunt dignissim. Integer ultrices malesuada dolor, ut feugiat elit tristique in. Fusce mattis feugiat condimentum. Sed vel augue sit amet neque suscipit dictum. Duis semper, justo a malesuada feugiat, sem tortor cursus sem, sed tempus ligula enim et lacus. Quisque cursus vestibulum enim nec sollicitudin. Integer ac tellus ullamcorper, finibus risus in, vulputate neque. In euismod sem id gravida efficitur. Curabitur vel scelerisque neque. Vestibulum euismod rutrum tellus, vitae volutpat massa scelerisque ac. Donec egestas lectus sit amet est laoreet, eu scelerisque risus rutrum. Cras bibendum mi sed nisl ultrices auctor. Morbi vitae facilisis dolor, sit amet faucibus elit.`
    };

    setInterval(() => {
        console.log("broadcasting to all clients");
        server.emit(JSON.stringify(message));
    }, 1000);
}

main();