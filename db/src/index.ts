import { config } from 'dotenv';
import express from 'express';
import { createServer } from 'http';
import sqlite3 from 'sqlite3';
import Games from './modules/games';
import Users from './modules/users';
import Votes from './modules/votes';

config();
main();

async function main() {
    const PORT = process.env.DB_API_PORT;
    const app = express();
    const server = createServer(app);

    sqlite3.verbose();

    const game_rec = new sqlite3.Database('game_recommendations.db', (err: Error | null): void => {
        if (err) throw err;
    });
    const games = new Games(game_rec);
    const users = new Users(game_rec);
    const votes = new Votes(game_rec);

    // https://static-cdn.jtvnw.net/ttv-static/$image.jpg
    // games.addGame(0, 'New Game', 'New', '1/1/2025', '1/6/2025', '404_boxart');
    // games.addGame(2, 'New Game', 'New', '1/1/2025', '1/6/2025', '404_boxart');
    // games.addGame(7, 'New Game', 'New', '1/1/2025', '1/6/2025', '404_boxart');
    // games.addGame(532, 'New Game', 'New', '1/1/2025', '1/6/2025', '404_boxart');
    // games.addGame(3, 'New Game', 'New', '1/1/2025', '1/6/2025', '404_boxart');
    // games.getGame(0);

    // games.updateGame(2, { last_played: '1/9/2025', name: 'Foobar',});

    // console.log(game_rec.all('SELECT * FROM games', (err: Error | null, row: any): void => {
    //     console.log('err', err);
    //     console.log('row', row);
    // }));

    // console.log(games.getGame(2));
    // console.log(game_rec.get(`
    //     SELECT * FROM games
    //     WHERE name = 'Foobar'
    // `, (err: Error | null, row: any): void => {
    //     console.log('err', err);
    //     console.log('row', row);
    // }));

    app.post('/game', (req, res) => {
        var body = '';

        req.on('data', data => {
            body += Buffer.from(data, 'utf16le').toString();
        });

        req.on('end', async () => {
            let { id, name, state, started, last_played, image } = JSON.parse(body);
            let game = await games.getGame(id);

            // Get Game
            if (true) { // If game exists
                // Update game
            } else { // If game does not exist
                // Add game
            }

            // Add votes

            // Get User
            if (false) { // If user does not exists
                // Add user
            }

            // games.addGame(id, name, state, started, last_played, image);

            res.json(await games.getGame(id));
            res.end();
        });
    });

    app.get('/games', async (req, res) => {
        let results = await games.getGames();

        res.json(results);
        res.end();
    });

    server.listen(PORT, () => {
        console.log(`db > listening on *:${PORT}`);
    });
}
