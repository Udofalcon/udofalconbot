import sqlite3 from 'sqlite3';

export default class Users {
    private static db: sqlite3.Database;

    constructor(db: sqlite3.Database) {
        Users.db = db;
        Users.db.run(`
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY,
                name TEXT NOT NULL,
                pity INTEGER NOT NULL
        )`, (err: Error) => {
            if (err) throw err;
        });
    }
}
