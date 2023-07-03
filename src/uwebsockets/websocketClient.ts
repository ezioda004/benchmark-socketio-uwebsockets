import WebSocket from 'ws';

class WebSocketClient {
    private ws: WebSocket;
    url: string;

    constructor() {
        console.log("WebSocketClient constructor");
        this.url = `ws://localhost:${process.env.PORT}`;
        this.ws = new WebSocket(this.url);
        this.ws.on('message', (message: string) => {
            console.log("WebSocketClient message", message);
        });
        this.ws.on('open', () => {
            console.log("WebSocketClient open");
        });
        this.ws.on('close', () => {
            console.log("WebSocketClient close");
        });
    }

    public send(message: string) {
        this.ws.send(message);
    }
}

export { WebSocketClient };