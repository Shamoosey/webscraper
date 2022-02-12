import "reflect-metadata";
import { Container } from "inversify";
import { WebScraper } from "./WebScraper"
import { BrowserHelper } from "./BrowserHelper";
import { ScraperMock } from "./Mocks/ScraperMock";
import { Scraper } from "./interfaces"
import { Logger } from "winston";
import { LogFactory } from "./LogFactory";

let container = new Container();

container.bind<Scraper.IWebScraper>("WebScraper").to(WebScraper).inSingletonScope();
container.bind<Scraper.IBrowserHelper>("BrowserHelper").to(BrowserHelper).inSingletonScope();
container.bind<Scraper.IScraperMock>("ScraperMock").to(ScraperMock).inSingletonScope();
container.bind<Logger>("Logger").toConstantValue(LogFactory.GetNewLogger());

export default container;