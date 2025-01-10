import React, { useEffect, useState } from 'react';

import './TwitchCountdown.css';

export function TwitchCountdown() {
    var time = 5 * 60;
    var timerString = '5:00';
    var className = '';

    var [ getTimerString, setTimerString ] = useState(timerString);
    var [ getClassName, setClassName ] = useState(className);

    const timer = setInterval(() => {
        let prettyTime = time;
        let minutes = Math.floor(prettyTime / 60);

        prettyTime -= minutes * 60;

        let seconds = Math.ceil(prettyTime);

        setTimerString(`${minutes.toString()}:${seconds.toString().padStart(2, '0')}`);

        if (time > 4 * 60 || time < 1 * 60) {
            setClassName('');
        } else if (time <= 4 * 60 && time >= 1 * 60) {
            setClassName('middle')
        } else if (time < 0) {
            setClassName('over');
        }

        time--;
    }, 1000);

    return (<div className='TwitchCountdown'>
        <h1 className={getClassName}>{getTimerString}</h1>
    </div>);
}
