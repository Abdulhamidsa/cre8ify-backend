import fs from "fs";

const colors = {
  reset: "\x1b[0m",
  red: "\x1b[31m",
  yellow: "\x1b[33m",
  cyan: "\x1b[36m",
  green: "\x1b[32m",
};

class Logger {
  private static logToFile(level: string, message: string): void {
    const logMessage = `[${new Date().toISOString()}] [${level.toUpperCase()}]: ${message}\n`;
    fs.appendFileSync("app.log", logMessage); // Appends logs to `app.log` in the root directory
  }

  private static getColor(level: string): string {
    switch (level) {
      case "info":
        return colors.green;
      case "error":
        return colors.red;
      case "warn":
        return colors.yellow;
      case "debug":
        return colors.cyan;
      default:
        return colors.reset;
    }
  }

  static log(level: string, ...messages: any[]): void {
    const color = this.getColor(level);
    const message = messages.join(" ");
    console.log(`${color}[${level.toUpperCase()}]: ${message}${colors.reset}`);
    this.logToFile(level, message); // Logs to file
  }

  static info(...messages: any[]): void {
    this.log("info", ...messages);
  }

  static error(...messages: any[]): void {
    this.log("error", ...messages);
  }

  static warn(...messages: any[]): void {
    this.log("warn", ...messages);
  }

  static debug(...messages: any[]): void {
    this.log("debug", ...messages);
  }
}

export default Logger;
