import { WebSocketClient } from "./uwebsockets/websocketClient.js";
import { SocketClient } from "./socketio/socketioClient.js"

import cluster from 'node:cluster';
import { availableParallelism } from 'node:os';
import process from 'node:process';

const numCPUs = availableParallelism();

if (cluster.isPrimary) {
  console.log(`Primary ${process.pid} is running`);

  // Fork workers.
  for (let i = 0; i < numCPUs - 1; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died`);
  });
} else {
  // Workers can share any TCP connection
  // In this case it is an HTTP server
  main();

  console.log(`Worker ${process.pid} started`);
}

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
            // console.log("got message from server", message.toString().length);
        });

    }
}

// main();