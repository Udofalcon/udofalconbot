import { IncomingMessage } from "http";
import https from "https";
import { RequestOptions } from "https";

export const oauth = {
    getAccessToken: (client_id: string, client_secret: string) => {
        return new Promise((resolve, reject) => {
            const options: RequestOptions = {    
                hostname: 'id.twitch.tv',
                path: `/oauth2/token?client_id=${client_id}&client_secret=${client_secret}&grant_type=client_credentials`,
                method: 'POST'
            };
            const callback = (res: IncomingMessage) => {
                var data = '';
    
                res.on('data', d => {
                    data += d;
                });
    
                res.on('end', () => {
                    resolve(JSON.parse(data).access_token);
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
