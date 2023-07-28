import WebSocket from 'ws';

function getRandomTime() {
    // Generate a random number between 1 and 20 (inclusive of 1, but not 20)
    const randomTimeInSeconds = Math.floor(Math.random() * 20) + 1;
    return randomTimeInSeconds * 1000; // Convert to milliseconds
}

class WebSocketClient {
    socket: WebSocket;
    url: string;

    constructor(url: string) {
        console.log("WebSocketClient constructor", url);
        this.url = url;
        this.socket = new WebSocket(this.url);
        this.socket.on('open', () => {
            console.log("WebSocketClient open");
            setInterval(() => {
                // this.socket?.send("Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla quis eros id nisi pellentesque sagittis. Nam eu velit faucibus, tempor neque at, volutpat mauris. Vestibulum tristique tortor vel ex tincidunt dignissim. Integer ultrices malesuada dolor, ut feugiat elit tristique in. Fusce mattis feugiat condimentum. Sed vel augue sit amet neque suscipit dictum. Duis semper, justo a malesuada feugiat, sem tortor cursus sem, sed tempus ligula enim et lacus. Quisque cursus vestibulum enim nec sollicitudin. Integer ac tellus ullamcorper, finibus risus in, vulputate neque. In euismod sem id gravida efficitur. Curabitur vel scelerisque neque. Vestibulum euismod rutrum tellus, vitae volutpat massa scelerisque ac. Donec egestas lectus sit amet est laoreet, eu scelerisque risus rutrum. Cras bibendum mi sed nisl ultrices auctor. Morbi vitae facilisis dolor, sit amet faucibus elit.");
                this.socket.send(this.getBinaryMessage());
            }, getRandomTime());
        });
        this.socket.on('close', () => {
            console.log("WebSocketClient close");
        });
    }

    public send(message: string) {
        this.socket.send(message);
    }

    private getBinaryMessage(bufferSize: number = 1024): Buffer {
        // 1KB Buffer
        return Buffer.alloc(bufferSize, `clientid:::message`);
    }

}

export { WebSocketClient };