export namespace Scraper {
    export interface IWebScraper {
        Run(): Promise<void>;
    }
}