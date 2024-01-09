import express from 'express';
import { createServer, request } from 'http';
import { config } from 'dotenv';
import tmi from 'tmi.js';
import https from 'https';
import Users from './modules/users';
import Moderation from './modules/moderation';

config();
main();

async function main() {
    const PORT = process.env.TWITCH_PORT;
    const app = express();
    const server = createServer(app);
    const client = new tmi.Client({
        identity: {
            username: 'udofalconbot',
            password: `oauth:${process.env.TWITCH_CHAT_TOKEN}`
        },
        channels: [ 'udofalcon' ]
    });

    app.get('/', (req, res) => {
        res.send('<h1>Twitch API Wrapper</h1>');
    });

    client.connect();

    client.on('message', (channel, tags, message, self) => {
        console.log(`twitch > ${tags['display-name']}: ${message}`);
        const post_data: any = JSON.stringify({
            tags,
            message
        });

        const req = request({
            hostname: `${process.env.REACT_APP_URL}`.replace('http://', ''),
            path: '/chat',
            method: 'POST',
            port: process.env.REACT_APP_BFF_PORT,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }, res => {
            var data = '';

            res.on('data', d => {
                data += d;
            });
        });

        req.on('error', e => {
            console.error('twitch > bff error', e);
        });

        req.write(post_data);
        req.end();

        if (message === 'Ping') {
            console.log(message, channel);
            client.say(channel, 'Pong');
        }
    });

    client.on('join', (channel, username, self) => {
        console.log(`twitch > join > ${username}`);
    });

    client.on('part', (channel, username, self) => {
        console.log(`twitch > part > ${username}`);
    });

    server.listen(PORT, () => {
        console.log(`twitch > listening on *:${PORT}`);
    });
}
