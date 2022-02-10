import Puppeteer from "puppeteer";

export namespace Scraper {
    export interface IWebScraper {
        Run(): Promise<void>;
    }

    export interface IBrowserHelper {
        GetBrowser(): Promise<Puppeteer.Browser>;
    }

    export interface IScraperMock {
        GetMock(): IScrapedWebsite;
    }

    export interface IScrapedWebsite {
        Url: string,
        ItemBaseSelector: string,
        ItemSubSelector: string
    }
}