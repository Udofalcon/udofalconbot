import React, { useEffect, useState, useId } from 'react';
import SocketIO from '../../modules/Socket';

import './TwitchTimer.css';

export function TwitchTimerController() {
    const name = useId();
    const leaderboard = useId();

    function startTimer() {
        console.log('Start Timer');
        timerEvent({ 'event': 'start', 'time': Date.now() });
    }

    function stopTimer() {
        console.log('Stop Timer');
        timerEvent({ 'event': 'stop', 'time': Date.now() });
    }

    function resetTimer() {
        console.log('Reset Timer');
        timerEvent({ 'event': 'reset' });
    }

    function timerEvent(data: any) {        
        fetch(`${process.env.REACT_APP_URL}:${process.env.REACT_APP_BFF_PORT}/timer`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
    }

    function handleSubmit(e: any) {
        e.preventDefault();

        const form = e.target;
        const formData = new FormData(form);
        const formJson = Object.fromEntries(formData.entries());

        fetch(`${process.env.REACT_APP_URL}:${process.env.REACT_APP_BFF_PORT}/leaderboard`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formJson)
        });
    }

    return (<div id="controls">
        <button onClick={startTimer}>Start Timer</button>
        <button onClick={stopTimer}>Stop Timer</button>
        <button onClick={resetTimer}>Reset Timer</button>
        <form method="post" onSubmit={handleSubmit}>
            <label>
                Title: <input name="title" defaultValue="RHR Week # by #" />
            </label>
            <label>
                Leaderboard:
                <textarea
                    name="leaderboard"
                    defaultValue=""
                />
            </label>
            <label>
                Image: <input name="image" />
            </label>
            <button type="submit">Send data</button>
        </form>
    </div>);
}

export function TwitchTimer() {
    var timerString = '0';
    var previousTime = 0;
    var currentTime = 0;
    var state = 'paused';
    var className = 'timer paused';
    var title = '';
    var image = '';
    var leaderboard: any[] = [];
    var leaderboardDisplay: any[] = [];
    var leaderboardSum = 0;

    const socket = SocketIO.getSocket();
    const SECOND = 1000;
    const MINUTE = SECOND * 60;
    const HOUR = MINUTE * 60;
    const [ getTimerString, setTimerString ] = useState(timerString);
    const [ getClassName, setClassName ] = useState(className);
    const [ getTitle, setTitle ] = useState(title);
    const [ getImage, setImage ] = useState(image);
    const [ getLeaderboardDisplay, setLeaderboardDisplay ] = useState(leaderboardDisplay);

    useEffect(() => {
        socket.on('timerEvent', timerEvent);
        socket.on('leaderboardEvent', leaderboardEvent);

        const timer = setInterval(() => {
            if (previousTime === 0 && currentTime === 0) {
                setTimerString('0');
                return;
            }

            if (state === 'paused') {
                return;
            }

            let milliseconds = previousTime + (Date.now() - currentTime);

            setTimerString(secondsToTimestamp(milliseconds));
        });

        return () => {
            socket.off('timerEvent', timerEvent);
            socket.off('leaderboardEvent', leaderboardEvent);
            clearInterval(timer);
        }
    }, []);

    function timerEvent(value: any) {
        console.log('Timer Event', JSON.parse(value));

        let data = JSON.parse(value);

        if (data.current === 0 && data.previous === 0) {
            state = 'paused';
            previousTime = 0;
            currentTime = 0;
        } else {
            state = data.current > 0 ? 'running' : 'paused'
            previousTime = data.previous;
            currentTime = data.current;
        }

        setClassName(`timer ${state}`);
    }

    function leaderboardEvent(value: any) {
        console.log('Leaderboard Event', JSON.parse(value));

        let data = JSON.parse(value);

        setTitle(data.title);
        setImage(data.image);

        console.log(data.leaderboard);

        if (data.leaderboard) {
            leaderboard = data.leaderboard.split('\n').map((x: any) => {
                let [ blank, user, number ] = x.split('\t');

                return { user, timestamp: number, milliseconds: timestampToSeconds(number) };
            });

            leaderboardSum = leaderboard.reduce((a, c) => a + c.milliseconds, 0);

            console.log(leaderboard, leaderboardSum);
        }
    }

    function timestampToSeconds(timestamp: String) {
        let digits = timestamp.split(':');
        let t = 0;
        let s = digits.pop();

        if (s) {
            t += parseInt(s) * SECOND;
        }

        let m = digits.pop();

        if (m) {
            t += parseInt(m) * MINUTE;
        }

        let h = digits.pop();

        if (h) {
            t += parseInt(h) * HOUR;
        }

        return t;
    }

    function secondsToTimestamp(time: number) {
        let hours = Math.floor(time / HOUR);
        time -= hours * HOUR;
        let minutes = Math.floor(time / MINUTE);
        time -= minutes * MINUTE;
        let seconds = Math.floor(time / SECOND);
        time -= seconds * SECOND;

        if (hours > 0) {
            return `${hours.toString()}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        } else if (minutes > 0) {
            return `${minutes.toString()}:${seconds.toString().padStart(2, '0')}`;
        } else {
            return `${seconds.toString()}`;
        }
    }

    return (
        <div className='TwitchTimer'>
            <h1>{getTitle}</h1>
            <img src={getImage}></img>
            {/* <table>
                <tbody>
                    {getLeaderboardDisplay.map((i: any) => <tr>
                        <td>
                            <h1 className={i.className ?? ''}>{i.user} {i.position ? `(${i.position})` : ''}</h1>
                        </td>
                        <td>
                            <h1 className={i.className ?? ''}>{i.timestamp}</h1>
                        </td>
                    </tr>)}
                </tbody>
            </table> */}
            <h1 className={getClassName}>{getTimerString}</h1>
        </div>
    );
}