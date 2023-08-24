import express from 'express';
import { createServer } from 'http';
import { config } from 'dotenv';
import cors from 'cors';
import SocketIO from './modules/socketio';
import Logs from './modules/logs';

config();

const PORT = process.env.BFF_PORT;
const app = express();
const server = createServer(app);

const io = SocketIO.getIO(server);
SocketIO.initListeners();

const logger = new Logs(io);

app.use(cors());

app.get('/', (req, res) => {
    res.send('<h1>BFF</h1>');
});

app.get('/logs', (req, res) => {
    logger.get_logs((logs: string[]) => {
        res.send(logs);
    });
});

server.listen(PORT, () => {
    console.log(`bff > listening on *:${PORT}`);
});
