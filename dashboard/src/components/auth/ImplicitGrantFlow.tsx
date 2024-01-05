import React, { useEffect } from 'react';

export function ImplicitGrantFlow() {
    var parameters: string;

    useEffect(() => {
        parameters = getParameters();

        return () => {};
    }, []);

    function getParameters() {
        const scope = ['chat:read', 'chat:edit', 'channel:moderate', 'moderation:read', 'moderator:manage:banned_users'];

        return 'response_type=token' +
            `&client_id=${process.env.REACT_APP_TWITCH_CLIENT_ID}` +
            '&redirect_uri=http://localhost:3000/auth' +
            `&scope=${scope.join('+')}`;
    }

    return (<a href={"https://id.twitch.tv/oauth2/authorize?" + getParameters()}>Connect with Twitch</a>);
}
