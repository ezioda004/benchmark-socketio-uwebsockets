import { Redis, Cluster } from "ioredis";
// import { config } from "../config";
// import { logged, console } from "../utils/console";
// import { v4 as uuidv4 } from "uuid";
// import { IRedisPubMessage, IRedisSubMessage } from "../interfaces/redisInterface";
// import { smallUuid } from "../utils/utils";

const host = "uwebsockets-test-001.h18fuh.0001.aps1.cache.amazonaws.com";

type RedisMode = "CLUSTER" | "FORK";

class RedisClient {

    public pubClient: Redis | Cluster;
    public subClient: Redis | Cluster;

    public static MODE: RedisMode = "FORK";

    private masterChannelId = "master";

    constructor() {
        this.pubClient = new Redis({ port: 6379, host: host, enableAutoPipelining: true });
        this.subClient = this.pubClient.duplicate();
        RedisClient.addEventListeners(this.pubClient, "pub");
        RedisClient.addEventListeners(this.subClient, "sub");

    }

    private static addEventListeners(redisClient: Cluster | Redis, clientName: string) {
        redisClient.on("connect", () => console.log(`${clientName} connect event:`));
        redisClient.on("ready", () => console.log(`${clientName} ready event:`));
        redisClient.on("error", (err) => console.error(`${clientName} error event:`, err));
        redisClient.on("close", (data: any) => console.log(`${clientName} close event:`, data));
        redisClient.on("reconnecting", (ms: any) => console.log(`${clientName} reconnecting event:`, ms));
        redisClient.on("end", (data: any) => console.log(`${clientName} end event:`, data));
        redisClient.on("+node", () => console.log(`${clientName} +node event`));
        redisClient.on("-node", () => console.log(`${clientName} -node event`));

    }

    public addSubscribeEventListener(cb: any) {
        this.subClient.on("message", (channel: string, _message) => {
            const message = JSON.parse(_message);
            cb(channel, message);
            
        });
    }

    public subscribeToChannel(channelId: string): void {
        this.subClient.subscribe(channelId, (err, count) => {
            if (err) {
                // Just like other commands, subscribe() can fail for some reasons,
                // ex network issues.
                console.error("Failed to subscribe: %s", err.message);
            } else {
                // `count` represents the number of channels this client are currently subscribed to.
                console.log(
                    `Subscribed successfully to ${channelId}! This client is currently subscribed to ${count} channels.`
                );
            }
        });
    }

    // public async publishToChannelAndAwait(channelId: string, message: any): Promise<IRedisSubMessage> {
    //     const requestId = this.publishToChannel(channelId, message);
    //     const awaitSubResponse = (): Promise<IRedisSubMessage> => new Promise((resolve, reject) => {
    //         const timeout = setTimeout(() => {
    //             reject(`timeout for requestId ${requestId} for message ${JSON.stringify(message)}`);
    //         }, 10000);
    //         this.subClient.once(requestId, (message: IRedisSubMessage) => {
    //             console.log("message recieved inside the subclient for requestId", requestId, message);
    //             clearTimeout(timeout);
    //             resolve(message);
    //         });
    //     });
    //     try {
    //         const response = await awaitSubResponse();
    //         return response;
    //     }
    //     catch (err) {
    //         console.error("publishToChannelAndAwait::error", err);
    //         return { ...message, message: { ack: false } };
    //     }
    // }

    public publishToChannel(channelId: string, message: any) {
        this.pubClient.publish(channelId, JSON.stringify(message), (err, count) => {
            if (err) {
                console.error("Failed to publish: %s", err.message);
            } 
            else {
            }
        });
    }

    public async close() {
        this.pubClient.disconnect();
        this.subClient.disconnect();
    }
}

const redisClient = new RedisClient();

export { redisClient, RedisClient };