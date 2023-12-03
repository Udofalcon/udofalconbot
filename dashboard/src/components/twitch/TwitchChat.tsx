import React, { useEffect, useState } from 'react';
import SocketIO from '../../modules/Socket';

import './TwitchChat.css';

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

        var emotes: any[] = [];

        Object.keys(json.tags.emotes || {}).forEach((emote: string) => {
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

        setList((previous): any => {
            return [ ...previous, json ];
        });
    }

    function lerp(start_value: number, end_value: number, pct: number) {
        return start_value + (end_value - start_value) * pct;
    }

    function animate(json: any) {
        const time_ratio = (Date.now() - json.timeout) / 1000 / 60;
        const fade_ratio = 1 / 60;

        // Fade in
        if (time_ratio < fade_ratio) {
            return lerp(0, 1, time_ratio / fade_ratio);
        }
        // Full opacity
        else if (time_ratio < 1 - fade_ratio) {
            return 1;
        }
        // Fade out
        else if (time_ratio < 1) {
            return lerp(1, 0, (time_ratio - (1 - fade_ratio)) / fade_ratio)
        // No opacity; Wait to be removed
        } else {
            return 0;
        }
    }

    function setColor(json: any) {
        const color = json.tags.color || '#FFFFFF';
        const _t = Math.round(json.timeout / 1000) % 360;
        const r = _t / 360 * 2 * Math.PI;
        const g = (_t + 120) / 360 * 2 * Math.PI;
        const b = (_t + 240) / 360 * 2 * Math.PI;
        const _c = [color.substring(1, 3), color.substring(3, 5), color.substring(5, 7)]
            .map(h => parseInt(h, 16));
        const [_r, _g, _b] = [255 * Math.cos(r), 255 * Math.cos(g), 255 * Math.cos(b)]
            .map((n, i) => Math.round((Math.abs(n) + _c[i]) / 2).toString(16).padStart(2, '0'));

        return `#${_r}${_g}${_b}`;
    }

    return (
        <div className='TwitchChat'>
            {
                getList.map((json: any, index: number, array: never[]): JSX.Element => {
                    return <div
                        className='messageWrapper'
                        style={{ backgroundColor: setColor(json), borderColor: setColor(json), opacity: animate(json), maxHeight: `${animate(json) * 100}%` }}
                    >
                        <span
                            className='displayName'
                            style={{ backgroundColor: setColor(json), borderColor: setColor(json) }}
                        >
                            {json.tags['display-name']}
                        </span>
                        <div className='message'>
                            {
                                json.message.map((message: any) => {
                                    if (message.type === 'text') {
                                        return <p>{message.value}</p>;
                                    } else if (message.type === 'emote') {
                                        if (json.message.length === 1) {
                                            // Big without text
                                            return <img
                                                className='largeImg'
                                                src={`${message.value}/3.0`}
                                            ></img>;
                                        } else {
                                            // Small with text
                                            return <img
                                                className='smallImg'
                                                src={`${message.value}/1.0`}
                                            ></img>;
                                        }
                                    } else if (message.type === 'whitespace') {
                                        return <span>&nbsp;</span>;
                                    }
                                })
                            }
                        </div>
                    </div>;
                })
            }
        </div>
    );
}
