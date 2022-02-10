import {inject, injectable} from "inversify";
import { Scraper } from "./interfaces";
import axios from "axios"
import Puppeteer, { Browser } from "puppeteer";

@injectable()
export class WebScraper implements Scraper.IWebScraper {
    constructor () {
        
    }
    
    private url = "https://www.memoryexpress.com/Category/VideoCards?PageSize=120"

    public async Run(): Promise<void>{
        let browser = await this.initPuppeteerBrowser();

        let page = await browser.newPage()
        await page.goto(this.url, {waitUntil: `load`});
        let data = await page.$eval('.c-shca-container', el => el.innerHTML)
        console.log(data);
    }


    private async initPuppeteerBrowser(): Promise<Puppeteer.Browser> {
        return await Puppeteer.launch({devtools: true});
    }
}