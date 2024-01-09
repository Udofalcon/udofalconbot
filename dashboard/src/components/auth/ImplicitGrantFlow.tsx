import React from 'react';

export function ImplicitGrantFlow() {
    function getParameters(type: string) {
        const scope = [];
        // https://dev.twitch.tv/docs/authentication/scopes
        switch (type) {
            case 'chat':
                scope.push('chat:read');
                scope.push('chat:edit');
                break;
            case 'api':
                scope.push('moderation:read');
                scope.push('moderator:manage:banned_users');
                break;
        }

        return 'response_type=token' +
            `&client_id=${process.env.REACT_APP_TWITCH_CLIENT_ID}` +
            '&redirect_uri=http://localhost:3000/auth' +
            `&scope=${scope.join('+')}` +
            '&force_verify=true';
    }

    return (<div>
        <a href={"https://id.twitch.tv/oauth2/authorize?" + getParameters('chat')}>Connect with Twitch (Chat)</a>
        <br/>
        <a href={"https://id.twitch.tv/oauth2/authorize?" + getParameters('api')}>Connect with Twitch (API)</a>
    </div>);
}
