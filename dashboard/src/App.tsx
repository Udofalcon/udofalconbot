import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { ImplicitGrantFlow } from './components/auth/ImplicitGrantFlow';
// import { LogEvents } from './components/events/LogEvents';
import { TwitchChatEvents } from './components/events/TwitchChatEvents';
import { TwitchChat, TwitchChatter } from './components/twitch/TwitchChat';
import { TwitchCountdown } from './components/twitch/TwitchCountdown';
import { TwitchTimerController, TwitchTimer } from './components/twitch/TwitchTimer';
import { TwitchVote } from './components/twitch/TwitchVote';

import './App.css';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/auth" element={<ImplicitGrantFlow />} />
          <Route path="/events" element={(
            <>
              {/* <LogEvents /> */}
              <TwitchChatEvents />
            </>
          )} />
          <Route path="/twitch-chat" element={<TwitchChat />} />
          <Route path="/twitch-chatters" element={<TwitchChatter />} />
          <Route path="/twitch-countdown" element={<TwitchCountdown />} />
          <Route path="/twitch-timer-controller" element={<TwitchTimerController />} />
          <Route path="/twitch-timer" element={<TwitchTimer />} />
          <Route path="/twitch-vote" element={<TwitchVote />} />
          <Route path="*" element={<h2>Dashboard</h2>} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
