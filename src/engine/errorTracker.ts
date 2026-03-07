type ErrorContext = {
  source?: string;
  info?: unknown;
};

const endpoint = import.meta.env.VITE_ERROR_WEBHOOK_URL as string | undefined;
let isInitialized = false;

const buildPayload = (error: unknown, context?: ErrorContext) => {
  const err =
    error instanceof Error
      ? {
          name: error.name,
          message: error.message,
          stack: error.stack ?? null,
        }
      : {
          name: 'UnknownError',
          message: String(error),
          stack: null,
        };

  return {
    error: err,
    context: context ?? null,
    url: typeof window !== 'undefined' ? window.location.href : null,
    userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : null,
    timestamp: new Date().toISOString(),
    mode: import.meta.env.MODE,
  };
};

const send = async (payload: ReturnType<typeof buildPayload>) => {
  if (!endpoint) return;
  try {
    await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  } catch {
    // Silently ignore reporting failures
  }
};

export const initErrorTracking = () => {
  if (isInitialized || !endpoint || typeof window === 'undefined') return;
  isInitialized = true;

  window.addEventListener('error', (event) => {
    send(
      buildPayload(event.error ?? event.message, {
        source: 'window.error',
        info: {
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno,
        },
      })
    );
  });

  window.addEventListener('unhandledrejection', (event) => {
    send(
      buildPayload(event.reason, {
        source: 'window.unhandledrejection',
      })
    );
  });
};

export const captureError = (error: unknown, context?: ErrorContext) => {
  if (!endpoint) return;
  send(buildPayload(error, context));
};
