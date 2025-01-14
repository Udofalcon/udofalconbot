import sqlite3 from 'sqlite3';

export default class Games {
    private db: sqlite3.Database;

    constructor(db: sqlite3.Database) {
        this.db = db;
    }

    public setup(): void {
        this.db.run(`
            CREATE TABLE IF NOT EXISTS games (
                id INTEGER PRIMARY KEY NOT NULL,
                name TEXT NOT NULL,
                state TEXT NOT NULL,
                started TEXT,
                last_played TEXT NOT NULL,
                image TEXT
        )`, (err: Error) => {
            if (err) throw err;
        });
    }

    public async getGames(): Promise<JSON> {
        return new Promise((resolve, reject): void => {
            this.db.all(`
                SELECT * FROM games
            `, (err: Error | null, row: any) => {
                if (err) reject(err);
                else resolve(row);
            });
        });
    }

    public async getGame(id: number): Promise<JSON> {
        return new Promise((resolve, reject): void => {
            this.db.get(`
                SELECT * FROM games
                WHERE id = $id
            `, id, (err: Error | null, row: any) => {
                if (err) reject(err);
                else resolve(row);
            });
        });
    }

    public addGame(
        id: number,
        name: string,
        state: string = 'New',
        started: string = this.calculateDay(Date.now()),
        last_played: string = this.calculateDay(Date.now()),
        image: string
    ): Error | void {
        if (id === undefined) return new Error('ID required');
        if (name === undefined) return new Error('Name required');

        this.db.run(`
            INSERT INTO games (id, name, state, started, last_played, image)
            VALUES ($id, $name, $state, $started, $last_played, $image)
        `, id, name, state, started, last_played, image);
    }

    public async updateGame(id: number, update: any) {
        if (!id) return new Error('Name required');

        let current = this.getGame(id);
        let { name, state, started, last_played, image }: any = {
            ...current,
            ...update
        };

        this.db.run(`
            UPDATE games
            SET name = $name,
                state = $state,
                started = $started,
                last_played = $last_played,
                image = $image
            WHERE id = $id
        `, name, state, started, last_played, image, id, (err: Error) => {
            if (err) throw err;
        });
    }

    private calculateDay(timestamp: number): string {
        let date = new Date(timestamp);
        
        return `${date.getMonth()+1}/${date.getDate()}/${date.getFullYear()}`;
    }
}
