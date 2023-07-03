import WebSocket from 'ws';

class WebSocketClient {
    socket: WebSocket;
    url: string;

    constructor() {
        console.log("WebSocketClient constructor");
        this.url = `ws://localhost:${process.env.PORT}`;
        this.socket = new WebSocket(this.url);
        this.socket.on('open', () => {
            console.log("WebSocketClient open");
        });
        this.socket.on('close', () => {
            console.log("WebSocketClient close");
        });
    }

    public send(message: string) {
        this.socket.send(message);
    }
}

export { WebSocketClient };