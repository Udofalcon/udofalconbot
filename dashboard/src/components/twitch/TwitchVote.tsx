import React, { useEffect, useState } from 'react';
import SocketIO from '../../modules/Socket';

import img from './CorruptionCards.png';
import imgPercent from './percent.png';
import imgAsterisk from './asterisk.png';
import img0 from './0.png';
import img1 from './1.png';
import img2 from './2.png';
import img3 from './3.png';
import img4 from './4.png';
import img5 from './5.png';
import img6 from './6.png';
import img7 from './7.png';
import img8 from './8.png';
import img9 from './9.png';

export function TwitchVote() {
    var timer = 60;
    var percents: any = [ [ Math.round(100 / 3) ], [ Math.round(100 / 3) ], [ Math.round(100 / 3) ] ];
    var winner = 0;
    var votes = [ 0, 0, 0];
    var voters: any = {};

    const [ getPercents, setPercents ] = useState([ percents[0], percents[1], percents[2] ]);
    const [ getTimer, setTimer ] = useState(timer);
    const [ getWinner, setWinner ] = useState(winner);
    const socket = SocketIO.getSocket();
    const images: any = {
        '0': img0,
        '1': img1,
        '2': img2,
        '3': img3,
        '4': img4,
        '5': img5,
        '6': img6,
        '7': img7,
        '8': img8,
        '9': img9,
        '%': imgPercent,
        '*': imgAsterisk
    };

    useEffect(() => {
        socket.on('chat', onChatEvent);

        const timerCountdown = setInterval(() => {
            timer = Math.max(0, timer - 1);
            setTimer(() => timer);

            if (timer === 0 && winner === 0) {
                var max = Math.max(...votes);
                var options: any[] = [];

                for (var i = 0; i < votes.length; i++) {
                    if (votes[i] === max) {
                        options.push(i + 1);
                    }
                }

                winner = options[Math.floor(Math.random() * options.length)];

                setWinner((): any => winner);
            }
        }, 1000);
        const percentAdjuster = setInterval(() => {
            for (var i = 0; i < percents.length; i++) {
                if (percents[i].length > 1) {
                    if (percents[i][0] < percents[i][1]) {
                        percents[i][0]++;
                    } else if (percents[i][0] > percents[i][1]) {
                        percents[i][0]--;
                    }

                    if (percents[i][0] === percents[i][1]) {
                        percents[i].shift();
                    }
                }

                setPercents((): any => {
                    return percents.map((percent: any) => percent[0]);
                });
            }
        }, 1000 / 35);

        return () => {
            socket.off('chat', onChatEvent);
            clearInterval(timerCountdown);
            clearInterval(percentAdjuster);
        }
    }, []);

    function onChatEvent(value: any) {
        const json = JSON.parse(value);
        const message = json.message;

        if (timer === 0) {
            return;
        }

        console.log('Twitch Chat Voting', json);

        if (message.match(/^[123]$/)) {
            console.log(`${json.tags['display-name']} voted ${message}`);

            voters[json.tags['display-name']] = parseInt(message);

            for (var i = 0; i < votes.length; i++) {
                votes[i] = 0;
            }

            Object.keys(voters).forEach((voter: any): any => {
                votes[voters[voter] - 1]++;
            });

            const totalVotes = votes.reduce((a: number, c: number) => a + c, 0);

            for (var i = 0; i < percents.length; i++) {
                percents[i][1] = Math.round(100 * votes[i] / totalVotes);
            }
        }
    }

    return (
        <div className='TwitchChatVoting' style={{ width: '100%', height: '100%', display: 'flex' }}>
            <div style={{ color: '#FFFFFF', flexGrow: '1', textAlign: 'center', width: 'calc(100% * 581 / 2560)', marginTop: "calc(100% / 4)"  }}></div>
            <div style={{ color: '#FFFFFF', flexGrow: '1', textAlign: 'center', width: 'calc(100% * 466 / 2560)', marginTop: "calc(100% / 7)" }}>
                {
                    getWinner === 1 ? <img src={ images['*'] } /> : ''
                }
                {
                    getPercents[0] === 100 ? <img src={ images['1'] } /> : ''
                }
                {
                    getPercents[0] >= 10 ? <img src={ images[Math.floor((getPercents[0] % 100) / 10).toString()] } /> : ''
                }
                {
                    <img src={ images[Math.floor(getPercents[0] % 10).toString()] } />
                }
                <img src={ images['%'] } />
            </div>
            <div style={{ color: '#FFFFFF', flexGrow: '1', textAlign: 'center', width: 'calc(100% * 466 / 2560)', marginTop: "calc(100% / 7)" }}>
                {
                    getWinner === 2 ? <img src={ images['*'] } /> : ''
                }
                {
                    getPercents[1] === 100 ? <img src={ images['1'] } /> : ''
                }
                {
                    getPercents[1] >= 10 ? <img src={ images[Math.floor((getPercents[1] % 100) / 10).toString()] } /> : ''
                }
                {
                    <img src={ images[Math.floor(getPercents[1] % 10).toString()] } />
                }
                <img src={ images['%'] } />
            </div>
            <div style={{ color: '#FFFFFF', flexGrow: '1', textAlign: 'center', width: 'calc(100% * 466 / 2560)', marginTop: "calc(100% / 7)" }}>
                {
                    getWinner === 3 ? <img src={ images['*'] } /> : ''
                }
                {
                    getPercents[2] === 100 ? <img src={ images['1'] } /> : ''
                }
                {
                    getPercents[2] >= 10 ? <img src={ images[Math.floor((getPercents[2] % 100) / 10).toString()] } /> : ''
                }
                {
                    <img src={ images[Math.floor(getPercents[2] % 10).toString()] } />
                }
                <img src={ images['%'] } />
            </div>
            <div style={{ color: '#FFFFFF', flexGrow: '1', textAlign: 'center', width: 'calc(100% * 581 / 2560)', marginTop: "calc(100% / 4)" }}>
                {
                    getTimer >= 10 ? <img src={ images[Math.floor(getTimer / 10).toString()] } /> : ''
                }
                {
                    <img src={ images[Math.floor(getTimer % 10).toString()] } />
                }
            </div>
        </div>
    );
}
