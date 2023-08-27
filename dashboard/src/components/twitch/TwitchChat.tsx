import React, { useEffect, useState } from 'react';
import SocketIO from '../../modules/Socket';

export function TwitchChat() {
    const [ getList, setList ] = useState([]);
    const socket = SocketIO.getSocket();

    useEffect(() => {
        getChatHistory();

        socket.on('chat', onChatEvent);

        const chatCleanup = setInterval(() => {
            setList((previous: any[]): any => {
                return previous.filter(message => {
                    // Animation takes 60 seconds. Should be off screen when this kicks off.
                    return Date.now() - parseInt(message.tags['tmi-sent-ts']) <= 61 * 1000;
                });
            });
        });

        return () => {
            socket.off('chat', onChatEvent);
            clearInterval(chatCleanup);
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
            return [ ...previous, JSON.parse(value) ];
        });
    }

    return (
        <div className='TwitchChat'>
            {
                getList.map((json: any) => {
                    return <span
                        className='message-wrapper'
                        style={{ backgroundColor: json.tags.color, borderRadius: '0.25em', marginTop: '1em' }}
                    >
                        <div
                            className='display-name'
                            style={{ borderColor: json.tags.color, borderStyle: 'solid', borderRadius: '0.25em', borderWidth: '0.25em' }}
                        >
                            {json.tags['display-name']}
                        </div>
                        <div
                            className='message'
                            style={{ borderColor: json.tags.color, borderStyle: 'solid', borderRadius: '0.25em', borderWidth: '0.25em' }}
                        >
                            {json.message}
                        </div>
                    </span>;
                })
            }
        </div>
    );
}
