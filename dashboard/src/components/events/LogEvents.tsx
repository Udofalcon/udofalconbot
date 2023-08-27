import React, { useEffect, useState } from 'react';
import SocketIO from '../../modules/Socket';

export function LogEvents() {
    const [ getList, setList ] = useState([]);
    const socket = SocketIO.getSocket();

    useEffect(() => {
        getLogs();

        socket.on('log', onLogEvent);

        return () => {
            socket.off('log', onLogEvent);
        }
    }, []);

    function getLogs() {
        fetch(`${process.env.REACT_APP_URL}:${process.env.REACT_APP_BFF_PORT}/logs`)
            .then(response => {
                return response.json();
            })
            .then(data => {
                onLogEvent(data);
            });
    }

    function onLogEvent(value: any) {
        setList((): any => {
            while (value.length >= 20) {
                value.shift();
            }

            return value;
        });
    }

    return (
        <div className='LogEvents'>
            <h2>Logs</h2>
            <pre>
                {
                    getList.map((log: any) => {
                        return `${log}\n`;
                    })
                }
            </pre>
        </div>
    );
}
