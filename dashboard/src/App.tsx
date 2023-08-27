import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LogEvents } from './components/events/LogEvents';
import { TwitchChat } from './components/twitch/TwitchChat';
import { TwitchChatEvents } from './components/events/TwitchChatEvents';

import './App.css';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/twitch-chat" element={<TwitchChat />} />
          <Route path="/events" element={(
            <>
              <LogEvents />
              <TwitchChatEvents />
            </>
          )} />
          <Route path="*" element={<h2>Dashboard</h2>} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
