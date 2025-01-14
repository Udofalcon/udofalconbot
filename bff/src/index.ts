import bodyParser from 'body-parser';
import cors from 'cors';
import { config } from 'dotenv';
import express from 'express';
import { createServer } from 'http';

import SocketIO from './modules/socket_io';
import Chat_List from './modules/chat_list';
import Twitch_Chat from './modules/twitch_chat';
import Timer_Events from './modules/timer_events';

config();
main();

async function main() {
    const PORT = process.env.BFF_PORT;
    const app = express();
    const server = createServer(app);

    const io = SocketIO.getIO(server);
    SocketIO.initListeners();

    // const logger = new Logs(io);
    const chat_list = new Chat_List(io);
    const twitch_chat = new Twitch_Chat(io);
    const timer_events = new Timer_Events(io);

    app.use(cors());
    app.use(bodyParser.text());

    app.get('/', (req, res) => {
        res.send('<h1>BFF</h1>');
    });

    // app.get('/logs', (req, res) => {
    //     logger.get_logs((logs: string[]) => {
    //         res.send(logs);
    //     });
    // });

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

    app.post('/chatter', (req, res) => {
        var body = '';

        req.on('data', data => {
            body += Buffer.from(data, 'utf16le').toString();
        });

        req.on('end', () => {
            console.log(body);
            chat_list.handleChatEvent(body);
            res.sendStatus(200);
        });
    });

    app.put('/timer', (req, res) => {
        var body = '';

        req.on('data', data => {
            body += Buffer.from(data, 'utf16le').toString();
        });

        req.on('end', () => {
            timer_events.handleTimerEvent(body);
            res.sendStatus(200);
        });
    });

    app.put('/leaderboard', (req, res) => {
        var body = '';

        req.on('data', data => {
            body += Buffer.from(data, 'utf16le').toString();
        });

        req.on('end', () => {
            timer_events.handleLeaderboard(body);
            res.sendStatus(200);
        });
    });

    server.listen(PORT, () => {
        console.log(`bff > listening on *:${PORT}`);
    });
}
