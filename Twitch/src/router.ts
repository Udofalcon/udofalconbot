import express, { NextFunction, Request, Response } from "express";

export const router = express.Router();

router.get('/', (req: Request, res: Response, next: NextFunction): void => {
    res.status(200).send('Hello Twitch!');
});
