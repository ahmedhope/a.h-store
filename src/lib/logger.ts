type LogLevel = "INFO" | "WARN" | "ERROR" | "DEBUG";

function log(level: LogLevel, message: string, data?: unknown) {
  const entry = { lvl: level, msg: message, ts: new Date().toISOString(), ...(data ? { data } : {}) };
  const output = JSON.stringify(entry);
  switch (level) {
    case "ERROR": console.error(output); break;
    case "WARN":  console.warn(output); break;
    case "DEBUG": if (process.env.NODE_ENV === "development") console.debug(output); break;
    default:      console.log(output);
  }
}

export const logger = {
  info:  (msg: string, data?: unknown) => log("INFO", msg, data),
  warn:  (msg: string, data?: unknown) => log("WARN", msg, data),
  error: (msg: string, data?: unknown) => log("ERROR", msg, data),
  debug: (msg: string, data?: unknown) => log("DEBUG", msg, data),
};
