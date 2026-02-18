import { Router } from "express";
import { healthRouter } from "../modules/health/health.route";

export const routes = Router();

routes.use("/health", healthRouter);

routes.use("/error", healthRouter);
