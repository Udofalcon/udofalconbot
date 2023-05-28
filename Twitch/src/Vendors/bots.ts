import { IncomingMessage } from "http";
import https, { RequestOptions } from "https";

export const bots = {
    list: new Array<string>(),

    getBots: (): Promise<Array<string>> => {
        if (bots.list.length) {
            return Promise.resolve(bots.list);
        }

        return new Promise((resolve, reject) => {
            const options: RequestOptions = {    
                hostname: 'api.twitchinsights.net',
                path: `/v1/bots/all`,
                method: 'GET'
            };
            const callback = (res: IncomingMessage) => {
                var data = '';
    
                res.on('data', d => {
                    data += d;
                });
    
                res.on('end', () => {
                    var bot_data: Array<any> = JSON.parse(data).bots;

                    bots.list = bot_data.map(bot => bot[0]);

                    resolve(bots.list);
                });
            };

            const req = https.request(options, callback);
            
            req.on('error', e => {
                reject(e);
            });
            req.end();
        });
    }
};