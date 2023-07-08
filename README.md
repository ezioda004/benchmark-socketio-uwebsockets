This repo contains a benchmark module for socketio and uwebsockets.

## Requirements
- Node 20.3
- pm2

## Installation

### Server
```
cd benchmark-socketio-uwebsockets
npm i -g pm2
npm ci
npm run build
npm run start:server
```

### Client
```
cd benchmark-socketio-uwebsockets
npm i -g pm2
npm ci
npm run build
npm run start:client
```

### Benchmarking
Server - 4 core, 8GB RAM (c5a.xlarge)
Clients(n) - 4 core, 8GB RAM (c5a.xlarge)
Test runtime - 15mins

We're running socketio/uwebsockets server as a single nodejs process using pm2.
Clients are running on separate machines and connecting to the server.
Clients are connected to the server using secure websocket connection.
ALB handles SSL/TLS certificate during the connection.
Server emits a 1kb message to all connected clients every second.

#### SocketIO
Client: SocketIO Client
Server: SocketIO Server

We start out by connection 20k socketio client to the socketio server, we can see overall CPU usage is around 30% and node CPU process is about 90%. We then connect 10k more clients which pushes the CPU to ~35% and node CPU process to 100%. At this point any new connection would mean the CPU will throttle the nodejs process. 
We see that socketio is able to send 30k messages of 1kb to 30k clients every second at full node CPU process capacity. To push even further we add 10k more clients and we can see from the slope of connection compared to 20-30k client connection that the CPU is throttling the nodejs process.

**CPU**:

<img width="705" alt="Screenshot 2023-07-08 at 1 18 51 PM" src="https://github.com/ezioda004/benchmark-socketio-uwebsockets/assets/20020273/10ce5a1c-45be-40d8-82d8-3a12037fd574">


**TCP Connections**:

<img width="705" alt="Screenshot 2023-07-08 at 1 19 01 PM" src="https://github.com/ezioda004/benchmark-socketio-uwebsockets/assets/20020273/33addd17-e62f-4611-a613-9657e82eebb1">


#### uWebSockets
Client: ws Client
Server: uWebSockets Server

We start out by connection 120k ws client to the uWebSockets server, we can see overall CPU usage is around 30% and node CPU process is about 70%. And this stable at 120k connections.
During initial connection we see a small spike which is expected as the server is handling the initial connection. We see that uWebSockets is able to send 120k messages of 1kb to 120k clients every second at about 70% node CPU Capacity.
This can further be pushed to ~150k clients at 100% node CPU capacity. 

**CPU**: 

<img width="711" alt="Screenshot 2023-07-08 at 12 51 15 PM" src="https://github.com/ezioda004/benchmark-socketio-uwebsockets/assets/20020273/5ae90773-a029-41c9-9950-33fc9cc6b5ff">


**TCP Connections**:

<img width="706" alt="Screenshot 2023-07-08 at 12 51 06 PM" src="https://github.com/ezioda004/benchmark-socketio-uwebsockets/assets/20020273/b205b6dc-56d4-40d1-a6a4-3f1f84d5aa06">


### Conclusion
uWebSockets is able to handle 5x more connections than socketio at 100% node CPU capacity with smaller memory footprint and sending 5x more messages per second.
We havent talked about node process RAM usage, for uWebSockets it's not a problem, the heap usage always remain <200 MB which is expected since all socket connections are handled in the C++ layer. For socketio, the heap usage is around 1.5GB which is directly proportional to the number of connections. This is because socketio is handling all the connections in the nodejs process.


