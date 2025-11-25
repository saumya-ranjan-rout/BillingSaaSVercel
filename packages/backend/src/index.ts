import { createApp } from "./app";
import { Request, Response } from "express";

let cachedApp: any = null;

export default async function handler(req: Request, res: Response) {
  if (!cachedApp) {
    cachedApp = await createApp();
  }
  return cachedApp(req, res);
}
