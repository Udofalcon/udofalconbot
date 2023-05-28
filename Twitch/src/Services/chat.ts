import { Twitch_User } from "../Models/Twitch_User";

const tmi = require('tmi.js');

export const chat = {
    client: tmi.Client,
    users: new Array<Twitch_User>(),

    connect: (username: string, password: string, broadcaster: string): void => {
        chat.client = new tmi.Client({
            identity: {
                username,
                password
            },
            channels: [ broadcaster ]
        });

        chat.client.connect().then(() => {
            console.log(`${username} connected to ${broadcaster}'s Twitch chat.`);
        });

        const handled: Array<string> = new Array<string>('001', '002', '003', '004', '353', '366', '372', '375', '376', 'CAP', 'GLOBALUSERSTATE', 'JOIN', 'PING', 'PONG', 'ROOMSTATE', 'USERSTATE');
        chat.client.on('raw_message', (json: any, message: any) => { !handled.includes(json.command) && console.log('raw_message', json, message) });

        // JOIN
        chat.client.on('join', (channel: any, nick: any, justinfan: any) => { chat.users.push(new Twitch_User(nick)); console.log(`${nick} joined Twitch chat.`); });
    },
    getUsers: (): Array<string> => {
        return chat.users.map(user => user.getUsername());
    }
};
