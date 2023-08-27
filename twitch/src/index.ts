// @TODO: https://discuss.dev.twitch.tv/t/authentication-for-a-chatbot/29705
// @TODO: https://tmijs.com/

import express from 'express';
import { createServer, request } from 'http';
import { config } from 'dotenv';
import tmi from 'tmi.js';

config();

const PORT = process.env.TWITCH_PORT;
const app = express();
const server = createServer(app);
const client = new tmi.Client({
    channels: [ 'udofalcon' ]
});

app.get('/', (req, res) => {
    res.send('<h1>Twitch API Wrapper</h1>');
});

// Anonymous connection for read only. Will need write later.
client.connect();

client.on('message', (channel, tags, message, self) => {
    console.log(`twitch > ${tags['display-name']}: ${message}`);
    const post_data = JSON.stringify({
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
});

server.listen(PORT, () => {
    console.log(`twitch > listening on *:${PORT}`);
});
