import "reflect-metadata";
import { Container } from "inversify";
import { WebScraper } from "./WebScraper"
import { Scraper } from "./interfaces"
import Puppeteer from "puppeteer";


let container = new Container();

container.bind<Scraper.IWebScraper>("WebScraper").to(WebScraper).inSingletonScope();

export default container;