import https from 'https';

export default class BotHandler {
    private static bot_list: Array<string> = new Array<string>();
    private static last_update: Date = new Date(0);

    constructor() {}

    private static async makeBotList(): Promise<void> {
        console.log(`twitch > makeBotList`);
        const options = {
            hostname: 'api.twitchinsights.net',
            path: '/v1/bots/all',
            method: 'GET'
        };

        return new Promise((resolve, reject) => {
            var data = '';

            const req = https.request(options, res => {
                res.on('data', d => {
                    data += d;
                });

                res.on('end', () => {
                    this.last_update = new Date();
                    this.bot_list = JSON.parse(data).bots;
                    resolve();
                })
            });

            req.on('error', e => {
                console.error(e);
                reject(e);
            });
            req.end();
        });
    }

    private static async getBots(): Promise<Array<string>> {
        const today = new Date();

        return new Promise(async (resolve, reject) => {
            if (this.last_update.getDate() !== today.getDate()) {
                await this.makeBotList();
            }

            return resolve(this.bot_list);
        });
    }

    public static async isBot(user: string): Promise<boolean> {
        return new Promise(async (resolve, reject) => {
            var match = (await this.getBots()).find(x => x[0] === user);

            resolve(!!match);
        });
    }
}
