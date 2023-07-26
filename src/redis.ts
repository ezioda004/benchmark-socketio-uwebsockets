import { Redis } from "ioredis";

const url = "redis://default:JuZnnmFB0pL3FYnjOJ0UN8HhmLD1l9BC@redis-19201.c212.ap-south-1-1.ec2.cloud.redislabs.com:19201"
// const url = "redis://localhost:6379";

export const redis = new Redis(url);

export const streamSubscriber = new Redis(url);
