import express from "express";
import * as Sentry from "@sentry/node";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import { routes } from "./routes";
import { errorHandler } from "./middlewares/error.middleware";
import { sendTestEmail } from "./modules/notification/notification.controller";

export const app = express();

app.use(helmet());
app.use(cors());
app.use(compression());
app.use(express.json());

app.use(routes);
app.post("/test-email", sendTestEmail);


Sentry.setupExpressErrorHandler(app);

app.use(errorHandler);


//TODO: Implementar Caddy ao invés de Greenlock