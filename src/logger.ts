import util from "node:util";
import fs from "node:fs";
import { EOL } from "node:os";

enum LogLeveL {
    ERROR = "ERROR",
    INFO = "INFO"
}
export class Logger {
    private logger: fs.WriteStream;
    private static serviceLogger: { [service: string]: Logger };
    private constructor(service: string) {
        this.logger = fs.createWriteStream(`/var/log/loadtest/${service}.log`, {
            flags: "a+",
        }).on("open", fd => {
            console.log("logger opened for", service, fd);
        });
    }

    public static getLogger(service: string): Logger {
        if (!Logger.serviceLogger) {
            Logger.serviceLogger = {};
        }
        if (!Logger.serviceLogger[service]) {
            Logger.serviceLogger[service] = new Logger(service);
        }
        return Logger.serviceLogger[service];
    }

    log(...args: any[]) {
        let message = this.getMessage(LogLeveL.INFO, args);
        this.write(message);
    }

    error(...args: any[]) {
        let message = this.getMessage(LogLeveL.INFO, args);
        this.write(message);
    }

    private write(message: string) {
        this.logger.write(message, console.error);
        console.log(message);
    }

    private getMessage(level: string, args: string[],) {
        let message = `[${Date.now()}] [${process.pid}] [${level}]`;
        for (let arg of args) {
            if (typeof arg == 'string') {
                message = `${message} ${arg}`;
            } else {
                message = `${message} ${util.inspect(arg, {
                    breakLength: Infinity,
                    maxArrayLength: 20,
                })}`;
            }
        }
        message = `${message} ${EOL}`
        return message;
    }
}