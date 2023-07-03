import { Server } from "socket.io";


class SocketIO {
  io: Server;
  clients: Map<string, any> = new Map();

  constructor(server: number | import("http").Server<typeof import("http").IncomingMessage, typeof import("http").ServerResponse> | import("https").Server<typeof import("http").IncomingMessage, typeof import("http").ServerResponse> | import("http2").Http2SecureServer | undefined) {
    this.io = new Server(server, {
        pingTimeout: 2000, // socket connection timeout from FE/BE, RTP connection will start retrying after 20 secs, see iceRestart
        pingInterval: 3000,
        transports: ["websocket"],
        cors: {
            origin: "*",
        },
        allowEIO3: true, // client is v2.x
    });
    this.io.on("connection", (socket) => {
      console.log("a user connected");
      this.clients.set(socket.id, socket);
      socket.join("room");

      socket.on("disconnect", () => {
        console.log("user disconnected");
      });
    });

    setInterval(() => {
      console.log("clients connected so far", this.clients.size);
    }, 10000);
  }

  public emit(message: string) {
    this.io.emit("message", message);
  }
}

export { SocketIO };