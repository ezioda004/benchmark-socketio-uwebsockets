import { SocketIO } from "./socketio/socketio.js";
import { createServer } from "http";
import { UWebSockets } from "./uwebsockets/uwebsockets.js";



async function startSocketIO() {
    const server = createServer();
    const socketio = new SocketIO(server);
    server.listen(3000, () => {
        console.log("listening on *:3000");
    });
}


async function startUWebSockets() {
    const uwebsockets = new UWebSockets();

}

async function main() {
    console.log("main");
    const type = process.env.TYPE;
    if (type === "SOCKETIO") {
        await startSocketIO();
    }
    else if (type === "UWEBSOCKETS") {
        await startUWebSockets();
    }
}

main();