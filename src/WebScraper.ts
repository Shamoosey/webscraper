import {inject, injectable} from "inversify";
import { Scraper } from "./interfaces";
import Puppeteer, { Browser } from "puppeteer";

@injectable()
export class WebScraper implements Scraper.IWebScraper {
    constructor () {
    }
    
    private url = ""

    public async Run(): Promise<void>{
        let browser = await this.initPuppeteerBrowser();

        let page = await browser.newPage()
        await page.goto(this.url, {waitUntil: `load`});

    }


    private async initPuppeteerBrowser(): Promise<Puppeteer.Browser> {
        return await Puppeteer.launch({devtools: true});
    }
}