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
                    return Date.now() - message.timeout <= 61 * 1000;
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
        const json = JSON.parse(value);
        const message = json.message;

        console.log('Twitch Chat', json);
        json.message = [];
        json.timeout = Date.now();

        // @TODO: Bug exists with messages starting or ending with an emote. Width of the message box exceeds the containers.

        if (json.tags.emotes !== null) {
            var emotes: any[] = [];

            Object.keys(json.tags.emotes).forEach((emote: string) => {
                json.tags.emotes[emote].forEach((range: any) => {
                    const [ start, end ] = range.split('-');

                    emotes.push({
                        end: parseInt(end),
                        emote,
                        start: parseInt(start)
                    });
                });
            });

            emotes = emotes.sort((a, b) => a.start - b.start);

            for (var i = 0; i < message.length; i++) {
                if (emotes.length && i >= emotes[0].start && i <= emotes[0].end) {
                    if (i === emotes[0].start) {
                        json.message.push({ type: 'emote', value: `https://static-cdn.jtvnw.net/emoticons/v2/${emotes[0].emote}/default/light` })
                    } else if (i === emotes[0].end) {
                        emotes.shift();
                    }
                } else {
                    var word = '';

                    for (; i < message.length && message[i] !== ' '; i++) {
                        word += message[i];
                    }

                    json.message.push({ type: 'text', value: word });
                }

                if (message[i] === ' ') {
                    json.message.push({ type: 'whitespace' });
                }
            }
        } else {
            json.message.push({ type: 'text', value: message });
        }

        setList((previous): any => {
            return [ ...previous, json ];
        });
    }

    function sine(pct: number) {
        return Math.sin(pct*Math.PI/2);
    }

    function lerp(start_value: number, end_value: number, pct: number) {
        return start_value + (end_value - start_value) * pct;
    }

    function animate(json: any) {
        const time_ratio = (Date.now() - json.timeout) / 1000 / 60;
        const name_ratio = 3 / 100;

        // Slide in
        if (time_ratio < name_ratio) {
            return lerp(-180, 0, sine(time_ratio / name_ratio));
        }
        // Stay open
        else if (time_ratio < 1 - name_ratio) {
            return 0;
        }
        // Slide out
        else if (time_ratio < 1) {
            return lerp(0, 180, sine((time_ratio - (1 - name_ratio)) / name_ratio));
        }
        // Done. Wait to be removed.
        else {
            return 180;
        }
    }

    return (
        <div className='TwitchChat'>
            {
                getList.map((json: any, index: number, array: never[]): JSX.Element => {
                    return <span
                        className='message-wrapper'
                        style={{ backgroundColor: json.tags.color, borderRadius: '0.25em', marginTop: '1em', transform: `rotate(${-animate(json)}deg)` }}
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
                            {
                                json.message.map((message: any) => {
                                    if (message.type === 'text') {
                                        return <span>{message.value}</span>;
                                    } else if (message.type === 'emote') {
                                        if (json.message.length === 1) {
                                            // Big without text
                                            return <img
                                                className='large-img'
                                                src={`${message.value}/3.0`}
                                            ></img>;
                                        } else {
                                            // Small with text
                                            return <img
                                                className='small-img'
                                                src={`${message.value}/1.0`}
                                            ></img>;
                                        }
                                    } else if (message.type === 'whitespace') {
                                        return <span>&nbsp;</span>;
                                    }
                                })
                            }
                        </div>
                    </span>;
                })
            }
        </div>
    );
}
