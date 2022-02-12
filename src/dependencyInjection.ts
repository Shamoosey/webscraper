import "reflect-metadata";
import { Container } from "inversify";
import { WebScraper } from "./WebScraper"
import { BrowserHelper } from "./BrowserHelper";
import { ScraperMock } from "./Mocks/ScraperMock";
import { Scraper } from "./interfaces"
import logger  from "./logger";
import { Logger } from "winston";

let container = new Container();

container.bind<Scraper.IWebScraper>("WebScraper").to(WebScraper).inSingletonScope();
container.bind<Scraper.IBrowserHelper>("BrowserHelper").to(BrowserHelper).inSingletonScope();
container.bind<Scraper.IScraperMock>("ScraperMock").to(ScraperMock).inSingletonScope();
container.bind<Logger>("Logger").toConstantValue(logger)

export default container;