import WebSocket from 'ws';

class WebSocketClient {
    socket: WebSocket;
    url: string;

    constructor(url: string) {
        console.log("WebSocketClient constructor", url);
        this.url = url;
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