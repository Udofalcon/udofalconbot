import express from 'express';
import { createServer } from 'http';
import { config } from 'dotenv';
import cors from 'cors';
import SocketIO from './modules/socket_io';
import Logs from './modules/logs';
import bodyParser from 'body-parser';
import Twitch_Chat from './modules/twitch_chat';

config();

const PORT = process.env.BFF_PORT;
const app = express();
const server = createServer(app);

const io = SocketIO.getIO(server);
SocketIO.initListeners();

const logger = new Logs(io);
const twitch_chat = new Twitch_Chat(io);

app.use(cors());
app.use(bodyParser.text());

app.get('/', (req, res) => {
    res.send('<h1>BFF</h1>');
});

app.get('/logs', (req, res) => {
    logger.get_logs((logs: string[]) => {
        res.send(logs);
    });
});

app.post('/chat', (req, res) => {
    var body = '';
    req.on('data', data => {
        body += Buffer.from(data, 'utf16le').toString();
    });

    req.on('end', () => {
        twitch_chat.handleMessage(body);
        res.sendStatus(200);
    });
});

server.listen(PORT, () => {
    console.log(`bff > listening on *:${PORT}`);
});
