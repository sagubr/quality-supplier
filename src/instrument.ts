import * as Sentry from "@sentry/node";
import { env } from "./config/env.config";

Sentry.init({
  dsn: env.SENTRY_DSN,
  tracesSampleRate: 1.0,
});

export { Sentry };
