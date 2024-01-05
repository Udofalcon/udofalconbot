export default class Twitch_Chat {
    private socket;

    constructor(socket: any) {
        this.socket = socket;
    }

    public handleMessage(body: string): void {
        this.socket.emit('chat', body);
    }
}
