import { io } from 'socket.io-client';

export default class SocketIO {
    private static socket: any = null;

    constructor() {}

    public static getSocket() {
      if (SocketIO.socket === null) {
        SocketIO.socket = io(`${process.env.REACT_APP_URL}:${process.env.REACT_APP_BFF_PORT}`);
      }

      return this.socket;
    }
}
