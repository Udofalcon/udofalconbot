import express, { NextFunction, Request, Response } from "express";
import { chat } from "./Services/chat";

export const router = express.Router();

router.get('/', (req: Request, res: Response, next: NextFunction): void => {
    res.status(200).send('Hello Twitch!');
});

router.get('/users', (req: Request, res: Response, next: NextFunction): void => {
    res.status(200).send(chat.getUsers());
});
