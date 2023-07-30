import express, { NextFunction, Request, Response } from "express";
import { chat } from "./Services/chat";

export const router = express.Router();

router.get('/', (req: Request, res: Response, next: NextFunction): void => {
    res.status(200).send('Hello Twitch!');
});

router.get('/users', (req: Request, res: Response, next: NextFunction): void => {
    res.status(200).send(chat.getUsers());
});

router.get('/webhooks/callback', async (req: Request, res: Response, next: NextFunction) => {
    const messageType = req.header('Twitch-Eventsub-Message-Type');

    if (messageType === 'webhook_callback_verification') {
        console.log('Verifying Webhook');

        return res.status(200).send(req.body.challenge);
    }

    res.status(200).end();
});

/**
    app.post('/webhooks/callback', async (req, res) => {
        const messageType = req.header('Twitch-Eventsub-Message-Type');

        if (messageType === 'webhook_callback_verification') {
            console.log('Verifying Webhook');

            return res.status(200).send(req.body.challenge);
        }

        const { type } = req.body.subscription;
        const { event } = req.body;

        console.log(`Receiving ${type} request for ${event.broadcaster_user_name}:`, event);

        const timestamp = Date.now();
        const ONE_DAY = 1000 * 60 * 60 * 24;
        const FOURTEEN_DAYS = ONE_DAY * 14;

        while (streamData.length && streamData[0].timestamp < timestamp - FOURTEEN_DAYS) {
            streamData.shift();
        }

        while (friendStreamData.length && friendStreamData[0].timestamp < timestamp - ONE_DAY) {
            friendStreamData.shift();
        }

        if (type === 'channel.follow') {
            twitchUsers.follow(client, event);
        } else if (type === 'channel.update') {
            // discord.game(event);

            if (event.broadcaster_user_name.toLowerCase() === 'udofalcon') {
                streamData.push({
                    type,
                    timestamp,
                    ...event
                });
            } else {
                friendStreamData.push({
                    type,
                    timestamp,
                    ...event
                });
            }
        } else if (type === 'stream.online') {
            // discord.online(event);

            if (event.broadcaster_user_name.toLowerCase() === 'udofalcon') {
                streamData.push({
                    type,
                    timestamp,
                    ...event
                });
                client.say('udofalcon', `We're going live! :D`);
            } else {
                friendStreamData.push({
                    type,
                    timestamp,
                    ...event
                });

                let game = '';

                for (i = friendStreamData.length - 1; !game && i >= 0; i--) {
                    let old_event = friendStreamData[i];

                    if (event.broadcaster_user_login === old_event.broadcaster_user_login && old_event.type === 'channel.update') {
                        game = old_event.category_name;
                    }
                }

                client.say('udofalcon', `My friend ${event.broadcaster_user_name} just went live. ` +
                    (game ? `They're playing ${game} today. ` : '') +
                    `Go show them some love: https://www.twitch.tv/${event.broadcaster_user_name}`);
            }
        } else if (type === 'stream.offline') {
            // discord.offline(event);

            if (event.broadcaster_user_name.toLowerCase() === 'udofalcon') {
                streamData.push({
                    type,
                    timestamp,
                    ...event
                });
                client.say('udofalcon', `Stream offline. :(`);
            } else {
                friendStreamData.push({
                    type,
                    timestamp,
                    ...event
                })
            }
        }

        writeFile('streamdata', streamData);
        writeFile('friendstreamdata', friendStreamData);

        res.status(200).end();
    });
 */