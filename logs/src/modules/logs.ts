import { readdir, readFile, watch } from 'fs';

export default class Logs {
    private log_dir = `${__dirname}/../../../logs`;

    constructor() {
        // watch(this.log_dir, (eventType: string, filename: string | null) => {
        //     this.get_logs(this.log);
        // });
    }

    public get_logs(cb: Function) {
        // readdir(this.log_dir, {}, (err: NodeJS.ErrnoException | null, files: string[] | Buffer[]): void => {
        //     if (err) {
        //         throw err;
        //     }

        //     this.read_next_log(files, [], cb);
        // });
    }

    private read_next_log(arr: string[] | Buffer[], logs: string[][], cb: Function): void {
        // if (arr.length === 0) {
        //     return cb(this.filter_latest_logs(logs));
        // }

        // const next_file = arr.shift();

        // readFile(`${this.log_dir}/${next_file}`, (err: NodeJS.ErrnoException | null, data: Buffer): void => {
        //     if (err) {
        //         throw err;
        //     }

        //     logs.push(data.toString().split('\n').filter(log => log));
        //     this.read_next_log(arr, logs, cb);
        // });
    }

    private filter_latest_logs(logs: string[][], count: number = 100): string[] {
        return [];
        // var latest = [];
        // var file_remove_index = -1;
        // var line_remove_index = -1;

        // while (logs.length) {
        //     var earliest = new Date();

        //     logs.forEach((file, file_index) => {
        //         file.forEach((line, line_index) => {
        //             var [ match, date, msg ] = line.match(/^(\d+-\d+-\d+T\d+:\d+:\d+):(.+)$/)!;

        //             if (new Date(date).getTime() < earliest.getTime()) {
        //                 earliest = new Date(date);
        //                 file_remove_index = file_index;
        //                 line_remove_index = line_index;
        //             }
        //         });
        //     });

        //     var file = logs[file_remove_index];
        //     var msg = file[line_remove_index];

        //     logs[file_remove_index].splice(line_remove_index, 1);

        //     if (logs[file_remove_index].length === 0) {
        //         logs.splice(file_remove_index, 1);
        //     }

        //     latest.push(msg);

        //     if (latest.length > count) {
        //         latest.unshift();
        //     }
        // }

        // return latest;
    }
}
