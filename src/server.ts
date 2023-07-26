import { UWebSockets } from "./uwebsockets/uwebsockets.js";
import { redis } from "./redis.js"

async function startUWebSockets() {
    const uwebsockets = new UWebSockets();
    return uwebsockets;
}

async function cleanupRedis() {
    await redis.flushall();
}

async function main() {
    cleanupRedis()
    await startUWebSockets(); 
}

main();