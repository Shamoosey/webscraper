import moment from "moment";
import { createLogger, format, transports } from "winston";
import DailyRotateFile from "winston-daily-rotate-file";

const tsFormat = () => moment().format('YYYY-MM-DD hh:mm:ss').trim();

const appName = "WebScraper"

const fileTransport = new DailyRotateFile ({
    filename: "webscraper-%DATE%.log",
    datePattern: "YYYY-MM-DD-HH",
    maxSize: "50m",
    dirname: "./logs"
});

const formatMeta = (meta) => {
    const splat = meta[Symbol.for('splat')];
    if (splat && splat.length) {
        return splat.length === 1 ? JSON.stringify(splat[0]) : JSON.stringify(splat);
    }
    return '';
};

const logger = createLogger({
    level: 'info',
    transports: [
        fileTransport
    ],
    format: format.combine(
        format.timestamp({format: tsFormat}),
        format.prettyPrint(),
        format.printf(({
            timestamp,
            level,
            message,
            ...meta
        }) => `${timestamp} | ${appName} | ${level} | ${message} ${formatMeta(meta)}`)
    )
})

if(process.env.WEBSCRAPER_ENV == "dev"){
    logger.add(new transports.Console())
}

export default logger;