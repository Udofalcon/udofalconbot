import express from 'express';
import { createServer, request } from 'http';
import { config } from 'dotenv';
import tmi from 'tmi.js';
import Users from './modules/users';
import Moderation from './modules/moderation';
import BotHandler from './modules/bots_handler';

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
    const broadcaster = (await Users.getUsers(undefined, 'udofalcon')).data[0];

    app.get('/', (req, res) => {
        res.send('<h1>Twitch API Wrapper</h1>');
    });

    client.connect();

    client.on('message', async (channel, tags, message, self) => {
        console.log(`twitch > ${tags['display-name']}: ${message}`);

        if (await BotHandler.isBot(tags['display-name']!)) {
            const user_id = (await Users.getUsers(undefined, tags['display-name']!)).data[0].id;

            return Moderation.banUser(broadcaster.id, broadcaster.id, user_id, undefined, 'Known bot');
        }

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

    client.on('join', async (channel, username, self) => {
        console.log(`twitch > join > ${username}`);

        if (await BotHandler.isBot(username)) {
            const user_id = (await Users.getUsers(undefined, username)).data[0].id;

            return Moderation.banUser(broadcaster.id, broadcaster.id, user_id, undefined, 'Known bot');
        }
    });

    client.on('part', (channel, username, self) => {
        console.log(`twitch > part > ${username}`);
    });

    server.listen(PORT, () => {
        console.log(`twitch > listening on *:${PORT}`);
    });
}
