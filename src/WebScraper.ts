import {inject, injectable} from "inversify";
import { Scraper } from "./interfaces";
import { CronJob } from 'cron';
import { parse } from 'node-html-parser';

@injectable()
export class WebScraper implements Scraper.IWebScraper {
    private _browserHelper: Scraper.IBrowserHelper;
    private _scraperMock: Scraper.IScraperMock;

    private _cachedData: Scraper.IScrapedContext[]; 

    constructor (
        @inject("BrowserHelper") browserHelper: Scraper.IBrowserHelper,
        @inject("ScraperMock") scraperMock: Scraper.IScraperMock
    ) {
        this._browserHelper = browserHelper;
        this._scraperMock = scraperMock;

        this._cachedData = []
    }

    public async Run(): Promise<void>{
        new CronJob('*/1 * * * *', async () => {
            try {
                await this.PreformScrape(this._scraperMock.GetMemoryExpressMock());
                await this.PreformScrape(this._scraperMock.GetNewEggMock());
            } catch (e) {
                console.log(e);
            }
        }, undefined, true, "America/Winnipeg", undefined, true);
        
    }

    private async PreformScrape(config: Scraper.IScrapedWebsiteConfiguration):Promise<void>{
        let data: Scraper.StoredScrapedData = {ConfigName: config.Name, ScrapedData: new Map<string, Map<string, string>>() }
        let newData: Scraper.StoredScrapedData = {ConfigName: config.Name, ScrapedData: new Map<string, Map<string, string>>() }
        
        let page = await this._browserHelper.GetNewPage();
        await page.goto(config.Url, {waitUntil: `load`});
        let parsedHtml = parse(await page.$eval(config.ItemBaseSelector, el => el.innerHTML))
        let selectedItems = parsedHtml.querySelectorAll(config.ItemBaseSubSelector);

        for(let item of selectedItems){
            let metaData = new Map<string, string>();
            let scrapedData: Scraper.ScrapedData = {
                MetaData: metaData,
                ScrappedName: ""
            }
            for(let subSelector of config.ItemSubSelectors){
                let el = item.querySelector(subSelector.Selector)
                if(el){
                    if(subSelector.InnerText){
                        if(subSelector.IsKey){
                            scrapedData.ScrappedName = el.innerText.trim();
                        } else {
                            metaData.set(subSelector.Name, el.innerText.trim().replace("&nbsp;", ""))
                        }
                    }
                }
            }
            if(!this.CompareData(scrapedData, config.Name)){
                //TO-DO: add function to notify with new data
                newData.ScrapedData.set(scrapedData.ScrappedName, metaData);
            }
            data.ScrapedData.set(scrapedData.ScrappedName, metaData);
        }

        let scrapedContext: Scraper.IScrapedContext = {
            Configuration: config, 
            StoredScrapedData: data,
        }

        if(this._cachedData.length > 0){
            this._cachedData = this._cachedData.filter((x) => x.StoredScrapedData.ConfigName != config.Name); 
        }
        this._cachedData.push(scrapedContext)
    }

    private CompareData(scrapedData: Scraper.ScrapedData, configName:string): boolean {
        let match = false;
        if(this._cachedData.length > 0){
            let cachedScrapedData = this._cachedData.find((x) => x.StoredScrapedData.ConfigName == configName)
            if(cachedScrapedData){
                if(cachedScrapedData.StoredScrapedData.ScrapedData.has(scrapedData.ScrappedName)){
                    match = true;
                }
            }
        }
        return match;
    }
}