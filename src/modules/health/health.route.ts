import { Router } from "express";

export const healthRouter = Router();

healthRouter.get("/", (_, res) => {
  res.json({ status: "ok" });
});

healthRouter.get("/debug-sentry", (_req, _res) => {
  throw new Error("Intentional error for testing");
});