import React, { useEffect } from 'react';

export function ImplicitGrantFlow() {
    var parameters: string;

    useEffect(() => {
        parameters = getParameters();

        return () => {};
    }, []);

    function getParameters() {
        console.log(process.env);
        return 'response_type=token' +
            `&client_id=${process.env.REACT_APP_TWITCH_CLIENT_ID}` +
            '&redirect_uri=http://localhost:3000/auth' +
            '&scope=chat%3Aread+chat%3Aedit';
    }

    return (<a href={"https://id.twitch.tv/oauth2/authorize?" + getParameters()}>Connect with Twitch</a>);
}
