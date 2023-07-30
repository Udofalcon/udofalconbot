export class Twitch_User {
    private username: string = '';
    private id: string = '';

    constructor(username: string) {
        this.username = username;
    }

    public getUsername(): string {
        return this.username;
    }

    public getId(): string {
        return this.id;
    }
    public setId(id: string) {
        this.id = id;
    }
}
