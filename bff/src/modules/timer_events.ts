export default class Timer_Events {
    private socket: any;
    private timestamps: Array<number>;

    constructor(socket: any) {
        this.socket = socket;
        this.timestamps = [];
    }

    public handleTimerEvent(body: string): void {
        const { event, time } = JSON.parse(body);
        console.log(event, time);

        if (event === 'reset') {
            this.timestamps = [];
            this.socket.emit('timerEvent', JSON.stringify({
                previous: 0,
                current: 0
            }));
        } else if (event === 'start' && this.timestamps.length % 2 === 0 || event === 'stop' && this.timestamps.length % 2 === 1) {
            this.timestamps.push(time);

            this.socket.emit('timerEvent', JSON.stringify({
                previous: this.calcHistoric(),
                current: this.timestamps.length % 2 === 0 ? 0 : this.timestamps[this.timestamps.length - 1]
            }));
        }
    }

    public handleLeaderboard(body: string): void {
        const { image, leaderboard, title } = JSON.parse(body);
        console.log(image, leaderboard, title);

        this.socket.emit('leaderboardEvent', body);
    }

    private calcHistoric() {
        let ms: number = 0;
        let index: number = 0;

        while (this.timestamps[index] && this.timestamps[index + 1]) {
            ms += this.timestamps[index + 1] - this.timestamps[index];
            index += 2;
        }

        return ms;
    }
}
