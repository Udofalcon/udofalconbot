import https from 'https';

export default class Moderation {
    constructor() {}

    /**
     * https://dev.twitch.tv/docs/api/reference/#get-banned-users
     * @param broadcaster_id 
     * @param user_id 
     * @param first 
     * @param after 
     * @param before 
     * @returns Promise<{
     *  data: [{
     *      user_id: string
     *      user_login: string
     *      user_name: string
     *      expires_at: string
     *      created_at: string
     *      reason: string
     *      moderator_id: string
     *      moderator_login: string
     *      moderator_name: string
     *  }]
     *  pagination: {
     *      cursor: string
     *  }
     * }>
     */
    public static async getBannedUsers(broadcaster_id: string, user_id?: Array<string> | string, first?: Number, after?: string, before?: string): Promise<any> {
        function parameters() {
            var arr: Array<string> = [];

            arr.push(`broadcaster_id=${broadcaster_id}`);

            if (Array.isArray(user_id)) {
                arr = [...arr, ...user_id.map(x => `user_id=${x}`)];
            } else if (user_id !== undefined) {
                arr.push(`user_id=${user_id}`);
            }

            if (first !== undefined) {
                arr.push(`first=${first}`);
            }

            if (after !== undefined) {
                arr.push(`after=${after}`);
            }

            if (before !== undefined) {
                arr.push(`before=${before}`);
            }

            return `?${arr.join('&')}`;
        }

        const options = {
            hostname: 'api.twitch.tv',
            path: `/helix/moderation/banned${parameters()}`,
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

    /**
     * https://dev.twitch.tv/docs/api/reference/#ban-user
     * @param broadcaster_id 
     * @param moderator_id 
     * @returns Promise<{
     *  data: [{
     *      broadcaster_id: string
     *      moderator_id: string
     *      user_id: string
     *      created_at: string
     *      end_time: string
     *  }]
     * }>
     */
    public static async banUser(broadcaster_id: string, moderator_id: string, user_id: string, duration?: Number, reason?: string): Promise<any> {
        console.log(`twitch > banUser > ${user_id}`);
        function parameters() {
            var arr: Array<string> = [];

            arr.push(`broadcaster_id=${broadcaster_id}`);
            arr.push(`moderator_id=${moderator_id}`);

            return `?${arr.join('&')}`;
        }

        const options = {
            hostname: 'api.twitch.tv',
            path: `/helix/moderation/bans${parameters()}`,
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.TWITCH_API_TOKEN}`,
                'Client-Id': process.env.TWITCH_CLIENT_ID,
                'Content-Type': 'application/json'
            }
        };
        const body = JSON.stringify({
            data: {
                user_id,
                duration,
                reason
            }
        });

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

            req.write(body);
            req.end();
        });
    }

    /**
     * https://dev.twitch.tv/docs/api/reference/#unban-user
     * @param broadcaster_id 
     * @param moderator_id 
     * @param user_id 
     */
    public static async unbanUser(broadcaster_id: string, moderator_id: string, user_id: string): Promise<void> {
        console.log(`twitch > unbanUser > ${user_id}`);
        function parameters() {
            var arr: Array<string> = [];

            arr.push(`broadcaster_id=${broadcaster_id}`);
            arr.push(`moderator_id=${moderator_id}`);
            arr.push(`user_id=${user_id}`);

            return `?${arr.join('&')}`;
        }

        const options = {
            hostname: 'api.twitch.tv',
            path: `/helix/moderation/bans${parameters()}`,
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${process.env.TWITCH_API_TOKEN}`,
                'Client-Id': process.env.TWITCH_CLIENT_ID
            }
        };

        return new Promise((resolve, reject) => {
            const req = https.request(options, res => {
                res.on('data', () => {});
    
                res.on('end', () => {
                    resolve();
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
