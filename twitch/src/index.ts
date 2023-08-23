import express from 'express';
import { createServer } from 'http';
import { config } from 'dotenv';

config();

const PORT = process.env.TWITCH_PORT;
const app = express();
const server = createServer(app);

app.get('/', (req, res) => {
    res.send('<h1>Twitch API Wrapper</h1>');
});

server.listen(PORT, () => {
    console.log(`twitch > listening on *:${PORT}`);
});
