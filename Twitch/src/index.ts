import * as dotenv from "dotenv";
import crypto from "crypto";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import { router } from "./router";
import { oauth } from "./Services/oauth";
import { chat } from "./Services/chat";

dotenv.config();

if (!process.env.TWITCH_PORT) {
    process.exit(1);
}
const ENV = {
    BROADCASTER: process.env.BROADCASTER as string,
    TWITCH_ACCESS_TOKEN: '',
    TWITCH_CLIENT_ID: process.env.TWITCH_CLIENT_ID as string,
    TWITCH_CLIENT_SECRET: process.env.TWITCH_CLIENT_SECRET as string,
    TWITCH_PORT: parseInt(process.env.TWITCH_PORT as string, 10),
    TWITCH_SIGNING_SECRET: process.env.TWITCH_SIGNING_SECRET as string
};

var access_token = oauth.getAccessToken(ENV.TWITCH_CLIENT_ID, ENV.TWITCH_CLIENT_SECRET).then(
    (value: unknown) => {
        ENV.TWITCH_ACCESS_TOKEN = value as string;
    },
    (reason: any) => { console.error('oauth.getAccessToken', reason); }
);

access_token.then(async () => {
    await chat.connect(ENV.TWITCH_ACCESS_TOKEN);
    chat.message(ENV.BROADCASTER, 'MrDestructoid');

    // @TODO: Read from file.
    const randomMessages: Array<string> = [
        'MrDestructoid Want to hang out after stream? Join our Discord. https://discord.gg/UhfsntQBK6'
    ];

    setInterval(() => {
        chat.message(ENV.BROADCASTER, randomMessages[Math.floor(Math.random() * randomMessages.length)]);
    }, 1000 * 60 * 60);
});

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json({
    verify: verifyTwitchSignature
}));
app.use('/api/twitch', router);

app.listen(ENV.TWITCH_PORT, () => {
    console.log(`Listening on port ${ENV.TWITCH_PORT}.`);
});

function verifyTwitchSignature(req: any, res: any, buf: any, encoding: any) {
    const messageId = req.header("Twitch-Eventsub-Message-Id");
    const timestamp = req.header("Twitch-Eventsub-Message-Timestamp");
    const messageSignature = req.header("Twitch-Eventsub-Message-Signature");
    const time = Math.floor(new Date().getTime() / 1000);
    console.log(`Message ${messageId} Signature: `, messageSignature);

    if (Math.abs(time - timestamp) > 600) {
        // needs to be < 10 minutes
        console.log(`Verification Failed: timestamp > 10 minutes. Message Id: ${messageId}.`);
        throw new Error("Ignore this request.");
    }

    if (!ENV.TWITCH_SIGNING_SECRET) {
        console.log(`Twitch signing secret is empty.`);
        throw new Error("Twitch signing secret is empty.");
    }

    const computedSignature =
        "sha256=" +
        crypto
            .createHmac("sha256", ENV.TWITCH_SIGNING_SECRET)
            .update(messageId + timestamp + buf)
            .digest("hex");
    console.log(`Message ${messageId} Computed Signature: `, computedSignature);

    if (messageSignature !== computedSignature) {
        throw new Error("Invalid signature.");
    } else {
        console.log("Verification successful");
    }
}