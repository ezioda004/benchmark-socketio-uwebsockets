import { SocketIO } from "./socketio/socketio.js";
import { createServer } from "http";
import { UWebSockets } from "./uwebsockets/uwebsockets.js";



async function startSocketIO() {
    const server = createServer();
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
    console.log("main");
    const type = process.env.TYPE;
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

    setInterval(() => {
        console.log("broadcasting to all clients");
        server.emit("Hello from server");
    }, 10000);
}

main();