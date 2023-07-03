import Client from "socket.io-client";

class SocketClient {
    socket;
    constructor() {
        this.socket = Client(`http://localhost:${process.env.PORT}`, {
            transports: ["websocket"],
            timeout: 30000,
            reconnectionAttempts: 100,
        });
        this.socket.on("connect", () => {
            console.log("connected");
        });

        this.socket.on("disconnect", () => {
            console.log("disconnected");
        });

        this.socket.on("pong", () => {
            console.log("pong");
        });


    }

    public emit(message: string) {
        this.socket.emit("message", message);
    }
    
}

export { SocketClient };