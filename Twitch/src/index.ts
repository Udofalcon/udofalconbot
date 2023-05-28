import * as dotenv from "dotenv";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import { router } from "./router";
import { oauth } from "./Services/oauth";

dotenv.config();

if (!process.env.TWITCH_PORT) {
    process.exit(1);
}

const TWITCH_CLIENT_ID: string = process.env.TWITCH_CLIENT_ID as string;
const TWITCH_CLIENT_SECRET: string = process.env.TWITCH_CLIENT_SECRET as string;
const TWITCH_PORT: number = parseInt(process.env.TWITCH_PORT as string, 10);
const TWITCH_ACCESS_TOKEN = oauth.getAccessToken(TWITCH_CLIENT_ID, TWITCH_CLIENT_SECRET).then(
    (value: unknown) => { console.log(value); },
    (reason: any) => { console.error('oauth.getAccessToken', reason); }
);

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use('/api/twitch', router);

app.listen(TWITCH_PORT, () => {
    console.log(`Listening on port ${TWITCH_PORT}.`);
});
