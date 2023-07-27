import { UWebSockets } from "./uwebsockets/uwebsockets.js";
import { redis } from "./redis.js"

// import cluster from 'node:cluster';
// import { availableParallelism } from 'node:os';
// import process from 'node:process';

// const numCPUs = availableParallelism();

// if (cluster.isPrimary) {
//   console.log(`Primary ${process.pid} is running`);

//   cleanupRedis();
//   // Fork workers.
//   for (let i = 0; i < numCPUs / 2; i++) {
//     cluster.fork();
//   }

//   cluster.on('exit', (worker, code, signal) => {
//     console.log(`worker ${worker.process.pid} died`);
//   });
// } else {
//   // Workers can share any TCP connection
//   // In this case it is an HTTP server
//   main();

//   console.log(`Worker ${process.pid} started`);
// }

async function startUWebSockets() {
  const uwebsockets = new UWebSockets();
  return uwebsockets;
}

async function cleanupRedis() {
  await redis.flushall();
}

async function main() {
  await cleanupRedis();
  await startUWebSockets();
}

main();
