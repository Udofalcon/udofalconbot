import React, { useEffect, useState } from 'react';
import SocketIO from '../../modules/Socket';

export function TwitchChatEvents() {
    const [ getList, setList ] = useState([]);
    const socket = SocketIO.getSocket();

    useEffect(() => {
        getChatHistory();

        socket.on('chat', onChatEvent);

        return () => {
            socket.off('chat', onChatEvent);
        }
    }, []);

    function getChatHistory() {
        // fetch(`${process.env.REACT_APP_URL}:${process.env.REACT_APP_BFF_PORT}/chat`)
        //     .then(response => {
        //         return response.json();
        //     })
        //     .then(data => {
        //         onChatEvent(data);
        //     });
    }

    function onChatEvent(value: any) {
        console.log('Twitch Chat', JSON.parse(value));
        setList((previous): any => {
            while (previous.length >= 20) {
                previous.shift();
            }

            return [ ...previous, JSON.parse(value) ];
        });
    }

    return (
        <div className='TwitchChatEvents'>
            <h2>Twitch Chat</h2>
            <pre>
                {
                    getList.map((json: any) => {
                        return `${json.tags['display-name']}: ${json.message}\n`;
                    })
                }
            </pre>
        </div>
    );
}
