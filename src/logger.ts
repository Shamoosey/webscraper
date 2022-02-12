import moment from "moment";
import { createLogger, format, transports } from "winston";
import DailyRotateFile from "winston-daily-rotate-file";


const tsFormat = () => moment().format('YYYY-MM-DD hh:mm:ss').trim();

const fileTransport = new DailyRotateFile ({
    filename: "webscraper-%DATE%.log",
    datePattern: "YYYY-MM-DD-HH",
    maxSize: "50m"
});

const logger = createLogger({
    level: 'info',
    transports: [
        fileTransport
    ],
    format: format.combine(
        format.timestamp({format: tsFormat}),
        format.prettyPrint(),
        format.printf(({ timestamp, level, message}) => {
            return `${timestamp} | ${level} | ${message}`;
        })
    )
})

if(process.env.WEBSCRAPER_ENV == "dev"){
    logger.add(new transports.Console())
}

export default logger;