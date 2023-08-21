import React, { useState, useEffect } from 'react';
import { socket } from './socket';
import { Events } from './components/Events';

import './App.css';

function App() {
  const [ logEvents, setLogEvents ] = useState([]);

  useEffect(() => {
    function onConnect() {}

    function onDisconnect() {}

    function onLogEvent(value: any) {
      setLogEvents((previous: never[]): any => {
        console.log(previous, value);
        while (previous.length >= 24) {
          previous.shift();
        }

        return value;
      });
      console.log('UI reached!');
    }

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('log', onLogEvent);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('log', onLogEvent);
    };
  }, []);

  return (
    <div className="App">
      <h2>Logs</h2>
      <Events events={ logEvents } />
    </div>
  );
}

export default App;
