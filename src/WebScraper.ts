import {inject, injectable} from "inversify";
import { Scraper } from "./interfaces";
import cheerio from "cheerio"

@injectable()
export class WebScraper implements Scraper.IWebScraper {
    private _browserHelper: Scraper.IBrowserHelper;
    private _scraperMock: Scraper.IScraperMock;

    constructor (
        @inject("BrowserHelper") browserHelper: Scraper.IBrowserHelper,
        @inject("ScraperMock") scraperMock: Scraper.IScraperMock
    ) {
        this._browserHelper = browserHelper;
        this._scraperMock = scraperMock;
    }

    public async Run(): Promise<void>{
        this.PreformScrape(this._scraperMock.GetMock())
    }

    private async PreformScrape(config: Scraper.IScrapedWebsite):Promise<void>{
        let browser = await this._browserHelper.GetBrowser();
        let page = await browser.newPage()
        await page.goto(config.Url, {waitUntil: `load`});
        let data = await page.$eval(config.ItemBaseSelector, el => el.innerHTML)

        let $ = cheerio.load(data)
        let items = $(config.ItemSubSelector)
        items.each((i, el) => {
            console.log(el)
        })
    }
}