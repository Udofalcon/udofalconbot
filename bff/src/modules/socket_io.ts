import { Server } from 'socket.io';

export default class SocketIO {
    private static io: any = null;

    constructor() {}

    public static getIO(server: any) {
        if (SocketIO.io === null) {
            SocketIO.io = new Server(server, {
                cors: {
                    origin: `${process.env.REACT_APP_URL}:${process.env.REACT_APP_PORT}`
                }
            });
        }

        return SocketIO.io;
    }

    public static initListeners() {
        SocketIO.io.on('connection', (socket: any) => {
            console.log('SocketIO connected.');
        });
    }
}
