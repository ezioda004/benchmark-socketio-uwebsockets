import { WebSocketClient } from "./uwebsockets/websocketClient.js";
import { SocketClient } from "./socketio/socketioClient.js"

let ackBuffer: { [key: string]: { mIds: Array<string>, cId: string, scheduleId: string } } = {};

const scheduleId = "65e975bc85a20d2cfdc1c84f";

function main() {
    console.log("main");
    console.log("process.env.PORT", process.env.PORT);
    // const socketClient = new SocketClient();

    const clients = new Map<string, WebSocketClient>();
    const clientIdsArr: Array<string> = [];


    for (let i = 0; i < 2500; i++) {
        const userId = Math.floor(Math.random() * 1000000000);
        // const host = `ws://localhost:3001/central-socket/ws?context=poll&scheduleId=${scheduleId}&userId=123`;
        const host = "wss://lt-1-central-socket.penpencil.co/central-socket/ws"
        const url = `${host}?context=poll&scheduleId=${scheduleId}&${userId}`
        let client: WebSocketClient;
        const type = process.env.TYPE;
        // if (type === "SOCKETIO") {
        //     client = new SocketClient(url);
        // }
        if (type === "UWEBSOCKETS") {
            client = new WebSocketClient(url);
        }
        else {
            throw new Error("Unknown type");
        }

        let clientId = "";

        client.socket.on("message", (_message: Buffer) => {
            console.log("got message from server", _message);
            const [context, ...messageObj] = _message.toString().split(' ');
            const message = JSON.parse(messageObj.join(' '))
            if (context === "connected") {
                clients.set(message.id, client);
                clientId = message.id;
                clientIdsArr.push(clientId);
            }
            else {
                if (ackBuffer[clientId]) {
                    ackBuffer[clientId].mIds.push(message.mId);
                }
                else {
                    // ackBuffer[message.mId] = { mId: message.mId, cIds: [clientId], sessionId: message.sessionId };
                    ackBuffer[clientId] = { mIds: [message.mId], cId: clientId, scheduleId };
                }

            }

            console.log("got message from server", message);

        });
    }

    let index = 0; // 0 - clients till 2500/12

    function selectClientsAndGetWhiteboardData() {
        console.log("selectClientsAndGetWhiteboardData");
        // const clientsArr = keys.slice(index * 12, (index + 1) * 12);
        // clientsArr.forEach((clientId) => {
        //     const client = clients.get(clientId);
        //     if (!client) return;
        //     fetchWhiteboardData(client, 0, 0, false);
        // });
        
        for (let i = index * 208; i < (index + 1) * 208; i++) {
            const clientId = clientIdsArr[i];
            const client = clients.get(clientId);
            if (!client) continue;
            fetchWhiteboardData(client, 1709812059796, 1709812119796, getRandomFromSlideChange());
        }
    }

    setInterval(() => {
        if (index === 12) {
            index = 0;
        }
        // get clients 
        selectClientsAndGetWhiteboardData();
        index++;
    }, 1000);

    setInterval(() => {
        console.log("ackBuffer", ackBuffer);
        // flushAckBuffer();
    }, 5000);
}

function fetchWhiteboardData(socket: WebSocketClient, startTime: number, endTime: number, fromSlideChange: boolean) {
    const data = {
        "type": "FE",
        "timestamp": {
            "startTime": startTime,
            "endTime": endTime,
            "fromSlideChange": fromSlideChange
        },
        "scheduleId": scheduleId,
        "mId": Math.random().toString(36).substring(2, 9)
    };
    socket.send(`whiteboard ${JSON.stringify(data)}`);
}


function flushAckBuffer() {
    const keys = Object.keys(ackBuffer);
    const arr: any = [];
    keys.forEach((key) => {
        const { mIds, cId, scheduleId } = ackBuffer[key];
        arr.push({ mIds, cId, scheduleId });
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

function getRandomFromSlideChange() {
    return Math.random() >= 0.9;
}

main();