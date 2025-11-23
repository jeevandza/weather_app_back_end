import pino from "pino";
import fs from "fs";
import path from "path";



/**
 * Log directory
 */
const logDir = path.join(process.cwd(), "logs");
if (!fs.existsSync(logDir)) fs.mkdirSync(logDir);

function getLogFile(level) {
  const date = new Date().toISOString().split("T")[0];
  return path.join(logDir, `app-${level}-${date}.log`);
}


/**
 * Rotate old logs (same as your function) 
 */
function rotateLogs(level) {
  const logFile = path.join(logDir, `app.log`);
  const rotatedFile = getLogFile(level);

  if (fs.existsSync(rotatedFile)) return;

  if (fs.existsSync(logFile) && fs.statSync(logFile).size > 0) {
    fs.renameSync(logFile, rotatedFile);
  }

  fs.writeFileSync(logFile, "");
}



/**
 * 
 *Delete old logs
 */
function deleteOldLogs(maxDays = 30) {
  const files = fs.readdirSync(logDir);
  const cutoff = Date.now() - maxDays * 24 * 60 * 60 * 1000;

  files.forEach((file) => {
    if (file.startsWith("app-") && file.endsWith(".log")) {
      const filePath = path.join(logDir, file);
      const stats = fs.statSync(filePath);
      if (stats.mtimeMs < cutoff) fs.unlinkSync(filePath);
    }
  });
}



/**
 * Rotate and cleanup logs on startup
 */
["info", "error"].forEach((level) => rotateLogs(level));
deleteOldLogs();



/**
 * Create separate destinations for info and error
 */
const infoStream = pino.destination(getLogFile("info"));
const errorStream = pino.destination(getLogFile("error"));



/**
 * Logger instance
 */
const logger = pino(
  {
    level: "info",
    timestamp: pino.stdTimeFunctions.isoTime,
    formatters: {
      level(label) {
        return { level: label };
      },
    },
  },
  pino.multistream([
    { level: "info", stream: infoStream },
    { level: "error", stream: errorStream },
  ])
);

export default logger;
