import Puppeteer from "puppeteer";

export namespace Scraper {
    export interface IWebScraper {
        Run(): Promise<void>;
    }

    export interface IBrowserHelper {
        GetBrowser(): Promise<Puppeteer.Browser>;
    }

    export interface IScraperMock {
        GetMemoryExpressMock(): IScrapedWebsiteConfiguration;
        GetNewEggMock(): IScrapedWebsiteConfiguration;
    }
    export interface IScrapedWebsiteConfiguration {
        Url: string,
        ItemBaseSelector: string,
        ItemBaseSubSelector: string,
        ItemSubSelectors: ItemSubSelector []
    }

    export interface ItemSubSelector{
        Name: string,
        Selector: string,
        Regex?: string,
        InnerText?: boolean
    }
}