import express from 'express';
import { createServer, request } from 'http';
import { config } from 'dotenv';
import tmi from 'tmi.js';
import https from 'https';

config();
main();

async function main() {
    const PORT = process.env.TWITCH_PORT;
    const app = express();
    const server = createServer(app);
    const client = new tmi.Client({
        identity: {
            username: 'udofalconbot',
            password: `oauth:${process.env.TWITCH_IMPLICIT_GRANT_TOKEN}`
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

    server.listen(PORT, () => {
        console.log(`twitch > listening on *:${PORT}`);
    });

    const options1 = {
        hostname: 'api.twitch.tv',
        path: '/helix/users?login=udofalcon',
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${process.env.TWITCH_IMPLICIT_GRANT_TOKEN}`,
            'Client-Id': process.env.TWITCH_CLIENT_ID
        }
    };

    const req1 = https.request(options1, res1 => {
        var data1 = '';

        res1.on('data', d => {
            data1 += d;
        });

        res1.on('end', () => {
            const broadcaster_id = JSON.parse(data1).data[0].id;
            console.log('broadcaster id', broadcaster_id);
            const options2 = {
                hostname: 'api.twitch.tv',
                path: `/helix/moderation/banned?broadcaster_id=${broadcaster_id}`,
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${process.env.TWITCH_IMPLICIT_GRANT_TOKEN}`,
                    'Client-Id': process.env.TWITCH_CLIENT_ID
                }
            };
            const req2 = https.request(options2, res2 => {
                var data2 = '';

                res2.on('data', d => {
                    data2 += d;
                });

                res2.on('end', () => {
                    console.log(JSON.parse(data2));
                });
            });

            req2.on('error', e => {
                console.error(e);
            });
            req2.end();
        });
    });

    req1.on('error', e => {
        console.error(e);
    });
    req1.end();
}
