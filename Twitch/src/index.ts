import * as dotenv from "dotenv";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import { router } from "./router";

dotenv.config();

if (!process.env.TWITCH_PORT) {
    process.exit(1);
}

const TWITCH_PORT: number = parseInt(process.env.TWITCH_PORT as string, 10);
const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use('/api/twitch', router);

app.listen(TWITCH_PORT, () => {
    console.log(`Listening on port ${TWITCH_PORT}.`);
});
