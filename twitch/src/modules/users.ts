import https from 'https';
import { resolve } from 'path';

export default class Users {
    constructor() {}

    /**
     * https://dev.twitch.tv/docs/api/reference/#get-users
     * @param id
     * @param login 
     * @returns Promise<{
     *  data: [{
     *      id: string
     *      login: string
     *      display_name: string
     *      type: string
     *      broadcaster_type: string
     *      description: string
     *      profile_image_url: string
     *      offline_image_url: string
     *      view_count: Number
     *      email: string
     *      created_at: string
     *  }]
     * }>
     */
    public static async getUsers(id?: Array<string> | string, login?: Array<string> | string): Promise<any> {
        function parameters() {
            var arr: Array<string> = [];

            if (Array.isArray(id)) {
                arr = [...id.map(x => `id=${x}`)];
            } else if (id !== undefined) {
                arr.push(`id=${id}`);
            }

            if (Array.isArray(login)) {
                arr = [...arr, ...login.map(x => `login=${x}`)];
            } else if (login !== undefined) {
                arr.push(`login=${login}`);
            }

            return `?${arr.join('&')}`;
        }

        const options = {
            hostname: 'api.twitch.tv',
            path: `/helix/users${parameters()}`,
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${process.env.TWITCH_API_TOKEN}`,
                'Client-Id': process.env.TWITCH_CLIENT_ID
            }
        };
    
        return new Promise((resolve, reject) => {
            const req = https.request(options, res => {
                var data = '';
        
                res.on('data', d => {
                    data += d;
                });
        
                res.on('end', () => {
                    resolve(JSON.parse(data));
                });
            });
        
            req.on('error', e => {
                console.error(e);
                reject(e);
            });

            req.end();
        });
    }
}
