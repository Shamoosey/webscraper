import Puppeteer from "puppeteer";

export namespace Scraper {
    export interface IWebScraper {
        Run(): Promise<void>;
    }

    export interface IBrowserHelper {
        GetBrowser(): Promise<Puppeteer.Browser>;
        GetNewPage(url?: string): Promise<Puppeteer.Page>;
    }

    export interface IScraperMock {
        GetMemoryExpressMock(): IScrapedWebsiteConfiguration;
        GetNewEggMock(): IScrapedWebsiteConfiguration;
        GetKijijiTestMock(): IScrapedWebsiteConfiguration;
    }

    export interface IScrapedContext {
        Configuration: IScrapedWebsiteConfiguration,
        StoredScrapedData: StoredScrapedData
    }

    export interface ScrapedData {
        ScrappedName: string,
        MetaData: Map<string, string> 
    }

    export interface StoredScrapedData {
        ConfigName: string,
        ScrapedData: Map<string ,Map<string, string>>
    }

    export interface IScrapedWebsiteConfiguration {
        Name: string,
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
        IsKey?: boolean
    }
}