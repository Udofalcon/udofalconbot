export default class Chat_List {
    private socket;

    constructor(socket: any) {
        this.socket = socket;
    }

    public handleChatEvent(body: string): void {
        this.socket.emit('chatEvent', body);
    }
}
