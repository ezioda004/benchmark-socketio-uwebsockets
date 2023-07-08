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


CPU: 

TCP Connections: 


