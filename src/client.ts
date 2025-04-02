import { WebSocketClient } from "./uwebsockets/websocketClient.js";
import { SocketClient } from "./socketio/socketioClient.js"
import fs from "fs/promises";

console.log(process.env.pm_id, "pm2");


let ackBuffer: { [key: string]: { mId: string, cIds: Set<string>, sessionId: string }} = {};


async function main() {
    console.log("main");
    console.log("process.env.PORT", process.env.PORT);
    // const socketClient = new SocketClient();

    const usersData = await fs.readFile("./data.csv", "utf-8").then((data) => {
        const lines = data.split("\n");
        const usersData = lines.map((line) => {
            const [phoneNumber, token] = line.split(",");
            return { phoneNumber, token: token?.replace("\r", "") };
        });
        // console.log(usersData);
        return usersData;
    });



    const clients = new Map<string, SocketClient | WebSocketClient>();

    //sleep between 0 to 30 seconds
    await sleep(Math.floor(Math.random() * 30000));
    
    const multipler = 350 * Number(process.env.pm_id);
    for (let i = multipler; i < (multipler + multipler); i++) {
        const userId = Math.floor(Math.random() * 1000000000);
        const randomFullName = Math.random().toString(36).substring(2, 15);
        // const host = "ws://localhost:8080/central-socket/ws"; 
        // const host = "ws://localhost:8080/pw-live-class/ws";
        const host = "wss://live-class-ws-stage.penpencil.co/pw-live-class/ws";
        const url = `${host}?context=premium_cohort&scheduleId=67ed0511ba691752f78d3237&parentScheduleId=67ed0511ba691752f78d3237&sessionRole=STUDENT&micEnabled=false&cameraEnabled=false&isMultiSchedule=false&token=${usersData[i].token}&fullName=${randomFullName}&useQueryFullName=true`
        let client: SocketClient | WebSocketClient;
        const type = process.env.TYPE ?? "UWEBSOCKETS";
        if (type === "SOCKETIO") {
            client = new SocketClient(url);
        }
        else if (type === "UWEBSOCKETS") {
            client = new WebSocketClient(url);
        }
        else {
            throw new Error("Unknown type");
        }

        let clientId = "";

        client.socket.on("message", (_message: Buffer) => {
            // console.log("got message from server", _message);
            const [context, ...messageObj] = _message.toString().split(' ');
            const message = JSON.parse(messageObj.join(' '))
            if (context === "connected") {
                clients.set(message.id, client);
                clientId = message.id;
            }
            else {
                if (ackBuffer[message.mId]) {
                    ackBuffer[message.mId].cIds.add(clientId);
                }
                else {
                    const cIds = new Set<string>();
                    cIds.add(clientId)
                    ackBuffer[message.mId] = { mId: message.mId, cIds: cIds, sessionId: message.sessionId };
                }
            }
            // console.log("got message from server", message);

        });
    }


    // setInterval(() => {
    //     console.log("ackBuffer", ackBuffer);
    //     flushAckBuffer();
    // }, 5000);
}

function sleep(ms: number) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}


function flushAckBuffer() {
    const keys = Object.keys(ackBuffer);
    const arr: any = [];
    keys.forEach((key) => {
        const { mId, cIds, sessionId } = ackBuffer[key];
        arr.push({ mId, cIds: cIds.size, sessionId });
    });
    if (arr.length === 0) return;
    ackBuffer = {};
    // const url = "http://localhost:3000/api/collect";
    const url = "https://benchmarking.physicswallahlive.net/api/collect";
    fetch(url, {
        method: "POST",
        body: JSON.stringify(arr),
    })
}

main();