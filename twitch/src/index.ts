import { config } from 'dotenv';
import express from 'express';
import { createServer, request } from 'http';
import tmi from 'tmi.js';

import BotHandler from './modules/bots_handler';
import Moderation from './modules/moderation';
import Users from './modules/users';

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
            handleBot(broadcaster, tags['display-name']);

            return;
        }

        chatter('chat', tags['display-name']!.toLowerCase());
        chat(message, tags);

        if (message === 'Ping') {
            console.log(message, channel);
            client.say(channel, 'Pong');
        }
    });

    client.on('join', async (channel, username, self) => {
        console.log(`twitch > join > ${username}`);

        // if (self) {
        //     client.say('udofalcon', 'I live, again.');
        // }

        if (await BotHandler.isBot(username)) {
            handleBot(broadcaster, username);

            return;
        }

        chatter('join', username);
    });

    client.on('part', (channel, username, self) => {
        console.log(`twitch > part > ${username}`);

        chatter('part', username);
    });

    server.listen(PORT, () => {
        console.log(`twitch > listening on *:${PORT}`);
    });

    async function handleBot(broadcaster: any, username: any) {
        const user_id = (await Users.getUsers(undefined, username)).data[0].id;

        Moderation.banUser(broadcaster.id, broadcaster.id, user_id, undefined, 'Known bot');

        chatter('bot', username );
    }

    function chatter(event: String, username: String) {
        console.log(event, username);

        const post_data = JSON.stringify({ event, username });
        const req = request({
            hostname: `${process.env.REACT_APP_URL}`.replace('http://', ''),
            path: '/chatter',
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
    }

    function chat(message: String, tags: any) {
        console.log(message, tags);

        const post_data = JSON.stringify({ message, tags });
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
    }
}
