import sqlite3 from 'sqlite3';

export default class Votes {
    private static db: sqlite3.Database;

    constructor(db: sqlite3.Database) {
        Votes.db = db;
        Votes.db.run(`
            CREATE TABLE IF NOT EXISTS votes (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user TEXT NOT NULL,
                game TEXT NOT NULL
            )
        `, (err: Error) => {
            if (err) throw err;
        });
    }
}
