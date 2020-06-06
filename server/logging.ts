import * as winston from "winston";

const errorStackFormat = winston.format((info) => {
    if (info instanceof Error) {
        return {
            ...info,
            message: info.stack,
        };
    }

    return info;
});

export const logger = winston.createLogger({
    level: "info",
    format: winston.format.combine(errorStackFormat(), winston.format.simple()),
    transports: [new winston.transports.Console()],
});
