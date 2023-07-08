This repo contains benchmark module for socketio and uwebsockets.

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

#### SocketIO
Client: SocketIO Client
Server: SocketIO Server

CPU:

TCP Connections:


#### uWebSockets
Client: ws Client
Server: uWebSockets Server


**CPU**: 

<img width="711" alt="Screenshot 2023-07-08 at 12 51 15 PM" src="https://github.com/ezioda004/benchmark-socketio-uwebsockets/assets/20020273/5ae90773-a029-41c9-9950-33fc9cc6b5ff">


**TCP Connections**:

<img width="706" alt="Screenshot 2023-07-08 at 12 51 06 PM" src="https://github.com/ezioda004/benchmark-socketio-uwebsockets/assets/20020273/b205b6dc-56d4-40d1-a6a4-3f1f84d5aa06">



