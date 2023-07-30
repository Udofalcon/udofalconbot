import { RequestOptions } from "https";
import { Twitch_User } from "../Models/Twitch_User";
import { bots } from "../Vendors/bots";
import { IncomingMessage } from "http";
import https from "https";

const tmi = require('tmi.js');

export const chat = {
    client: tmi.Client,
    users: new Array<Twitch_User>(),

    ban: (broadcaster: string, moderator: string, nick: string, client_id: string, twitch_access_token: string): Promise<any> => {
        var users = new Set<Twitch_User>();

        users.add(chat.users.find(user => user.getUsername() === broadcaster) || new Twitch_User(broadcaster));
        users.add(chat.users.find(user => user.getUsername() === moderator) || new Twitch_User(moderator));
        users.add(chat.users.find(user => user.getUsername() === nick) || new Twitch_User(nick));

        // @TODO: Cache user id in Twitch_User and reuse later.
        return new Promise((resolve, reject) => {
            const options: RequestOptions = {
                hostname: 'api.twitch.tv',
                path: `/helix/users?${[...users].map(user => `login=${user.getUsername()}`).join('&')}`,
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${twitch_access_token}`,
                    'Client-Id': client_id
                }
            };
            const callback = (res: IncomingMessage) => {
                var data = '';

                res.on('data', d => {
                    data += d;
                });

                res.on('end', () => {
                    resolve(JSON.parse(data));
                });
            };

            const req = https.request(options, callback);

            req.on('error', e => {
                reject(e);
            });
            req.end();
        }).then((response: any) => {
            response.data.forEach((data: any) => {
                var user_in_list = chat.users.find(user => user.getUsername() === data.login);

                if (!user_in_list) {
                    user_in_list = new Twitch_User(data.login);
                    chat.users.push(user_in_list);
                }

                user_in_list.setId(data.id);
            });
        }).then(() => {
            const broadcaster_id = chat.users.find(user => user.getUsername() === broadcaster)!.getId();
            const moderator_id = chat.users.find(user => user.getUsername() === moderator)!.getId();
            const user_id = chat.users.find(user => user.getUsername() === nick)!.getId();

            return new Promise((resolve, reject) => {
                const options: RequestOptions = {
                    hostname: 'api.twitch.tv',
                    path: `/helix/moderation/bans?broadcaster_id=${broadcaster_id}&moderator_id=${moderator_id}`,
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${twitch_access_token}`,
                        'Client-Id': client_id,
                        'Content-Type': 'application/json'
                    }
                };
                const postBody = {
                    data: {
                        user_id
                    }
                };
                const callback = (res: IncomingMessage) => {
                    var data = '';

                    res.on('data', d => {
                        data += d;
                    });

                    res.on('end', () => {
                        resolve(JSON.parse(data));
                    });
                };

                const req = https.request(options, callback);

                req.write(JSON.stringify(postBody));
                req.on('error', e => {
                    reject(e);
                });
                req.end();
            });
        });
    },
    connect: (twitch_access_token: string): Promise<any> => {
        const username = process.env.BOT_USERNAME as string;
        const password = process.env.BOT_PASSWORD as string;
        const broadcaster = process.env.BROADCASTER as string;
        const client_id = process.env.TWITCH_CLIENT_ID as string;

        return new Promise((resolve, reject) => {
            chat.client = new tmi.Client({
                identity: {
                    username,
                    password
                },
                channels: [ broadcaster ]
            });
    
            chat.client.connect().then(() => {
                console.log(`${username} connected to ${broadcaster}'s Twitch chat.`);
                resolve(`${username} connected to ${broadcaster}'s Twitch chat.`);
            });
    
            const ignored: Array<string> = new Array<string>('001', '002', '003', '004', '353', '366', '372', '375', '376', 'CAP', 'GLOBALUSERSTATE', 'JOIN', 'PING', 'PONG', 'ROOMSTATE', 'USERSTATE');
            chat.client.on('raw_message', (json: any, message: any) => { !ignored.includes(json.command) && console.log('raw_message', json, message) });
    
            // JOIN
            chat.client.on('join', (channel: any, nick: any, justinfan: any) => {
                chat.users.push(new Twitch_User(nick));
                console.log(`${nick} joined Twitch chat.`);
    
                bots.getBots().then((bot_list: Array<string>) => {
                    if (bot_list.includes(nick)) {
                        console.log(`${nick} is a known bot.`);
                        chat.ban(broadcaster, username, nick, client_id, twitch_access_token).then(data => { console.log('Ban response', data); });
                    }
                });
            });
        });
    },
    getUsers: (): Array<string> => {
        return chat.users.map(user => user.getUsername());
    },
    message: (broadcaster: string, text: string): void => {
        chat.client.say(broadcaster, text);
    }
};
