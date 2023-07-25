import { redis } from "./redis.js"
import { logger } from "./logger.js"

class ClientManager {
    private CLIENT_COUNT_KEY = "CLIENT_COUNT";
    connect() {
        redis.incr(this.CLIENT_COUNT_KEY, count => {
            logger.info(`client connected, count:`, count);
        });
    }
    disconnect() {
        redis.decr(this.CLIENT_COUNT_KEY, count => {
            logger.info(`client disconnected, count:`, count);
        });
    }
    subscribe(stream: string) {

    }
    unsubscribe(stream: string) {

    }
    async getOnlineClientsCount() {
        let count = await redis.get(this.CLIENT_COUNT_KEY);
        return count;
    }

}

export const clientManager = new ClientManager();
