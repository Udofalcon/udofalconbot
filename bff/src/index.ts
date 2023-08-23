import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { readdir, readFile, watch } from 'fs';
import { config } from 'dotenv';
import cors from 'cors';

config();

const PORT = process.env.BFF_PORT;
const app = express();
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: `${process.env.REACT_APP_URL}:${process.env.REACT_APP_PORT}`
    }
});
const log_dir = `${__dirname}/../../logs`;

io.on('connection', socket => {
    socket.on('log', () => {
        console.log('log event');
    });
});

app.use(cors());

app.get('/', (req, res) => {
    res.send('<h1>BFF</h1>');
});

app.get('/logs', (req, res) => {
    get_logs((logs: string[]) => {
        res.send(logs);
    });
});

watch(log_dir, (eventType: string, filename: string | null) => {
    get_logs(log);
});

server.listen(PORT, () => {
    console.log(`bff > listening on *:${PORT}`);
});

function log(msgs: string[]) {
    io.emit('log', msgs);
}

function get_logs(cb: Function) {
    readdir(log_dir, {}, (err: NodeJS.ErrnoException | null, files: string[] | Buffer[]): void => {
        if (err) {
            throw err;
        }

        read_next_log(files, [], cb);
    });
}

function read_next_log(arr: string[] | Buffer[], logs: string[][], cb: Function) {
    if (arr.length === 0) {
        return cb(get_latest_logs(logs));
    }

    const next_file = arr.shift();

    readFile(`${log_dir}/${next_file}`, (err: NodeJS.ErrnoException | null, data: Buffer): void => {
        if (err) {
            throw err;
        }

        logs.push(data.toString().split('\n').filter(log => log));
        read_next_log(arr, logs, cb);
    });
}

function get_latest_logs(logs: string[][], count: number = 100): string[] {
    var latest = [];
    var file_remove_index = -1;
    var line_remove_index = -1;

    while (logs.length) {
        var earliest = new Date();

        logs.forEach((file, file_index) => {
            file.forEach((line, line_index) => {
                var [ match, date, msg ] = line.match(/^(\d+-\d+-\d+T\d+:\d+:\d+):(.+)$/)!;

                if (new Date(date).getTime() < earliest.getTime()) {
                    earliest = new Date(date);
                    file_remove_index = file_index;
                    line_remove_index = line_index;
                }
            });
        });

        var msg = logs[file_remove_index][line_remove_index];

        logs[file_remove_index].splice(line_remove_index, 1);

        if (logs[file_remove_index].length === 0) {
            logs.splice(file_remove_index, 1);
        }

        latest.push(msg);

        if (latest.length > count) {
            latest.unshift();
        }
    }

    return latest;
}
