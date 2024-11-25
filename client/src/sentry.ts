import * as Sentry from "@sentry/react";

const env = import.meta.env.VITE_ENV;
if (env !== "local") {
  Sentry.init({
    dsn: "https://aee32b5dd78bc0b8226aa719668d9c84@o100162.ingest.us.sentry.io/4508300936544256",
    integrations: [
      Sentry.browserTracingIntegration(),
      Sentry.replayIntegration(),
    ],
    // Tracing
    tracesSampleRate: 1.0, //  Capture 100% of the transactions
    // Set 'tracePropagationTargets' to control for which URLs distributed tracing should be enabled
    tracePropagationTargets: [
      "localhost",
      "dev.incomemapper.com",
      "dev-api.incomemapper.com",
      "app.incomemapper.com",
      "api.incomemapper.com",
      /^https:\/\/yourserver\.io\/api/,
    ],
    // Session Replay
    replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
    replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
    environment: import.meta.env.VITE_ENV,
  });
}
