import { io } from 'socket.io-client';

const URL = 'http://192.168.86.21:3001';

export const socket = io(URL);
