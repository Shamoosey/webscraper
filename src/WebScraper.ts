import {inject, injectable} from "inversify";
import { Scraper } from "./interfaces";
import cheerio from "cheerio"
import { parse } from 'node-html-parser';

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
        // this.PreformScrape(this._scraperMock.GetMemoryExpressMock())
        // this.PreformScrape(this._scraperMock.GetNewEggMock())
    }

    private async PreformScrape(config: Scraper.IScrapedWebsiteConfiguration):Promise<void>{
        let browser = await this._browserHelper.GetBrowser();
        let page = await browser.newPage()
        await page.goto(config.Url, {waitUntil: `load`});
        let data = await page.$eval(config.ItemBaseSelector, el => el.innerHTML)
        
        let parsedHtml = parse(data)
        let selectedItems = parsedHtml.querySelectorAll(config.ItemBaseSubSelector);

        for(let item of selectedItems){
            for(let subSelector of config.ItemSubSelectors){
                let el = item.querySelector(subSelector.Selector)
                if(el){
                    if(subSelector.InnerText){
                        console.log(el.innerText.trim());
                    }
                }
            }
            console.log("****")
        }
    }
}