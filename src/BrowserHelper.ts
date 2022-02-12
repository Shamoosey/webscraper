import {inject, injectable} from "inversify";
import Puppeteer from "puppeteer";
import { Logger } from "winston";
import { Scraper } from "./interfaces";

@injectable()
export class BrowserHelper implements Scraper.IBrowserHelper{
    private _logger: Logger;

    private _browserInstance : Puppeteer.Browser;

    constructor (
        @inject("Logger") logger: Logger
    ) {
        this._logger = logger;
    }

    public async GetBrowser(): Promise<Puppeteer.Browser> {
        if(!this._browserInstance){
            this._logger.info("Creating browser instance")
            this._browserInstance = await Puppeteer.launch({devtools: true, headless:true});
        }
        return this._browserInstance
    }

    public async GetNewPage(url?: string): Promise<Puppeteer.Page> {
        if(!this._browserInstance) await this.GetBrowser();
        this._logger.info("Creating new browser page")
        let page =  await this._browserInstance.newPage();
        if(url){
            this._logger.info(`Loading new page ${url}`)
            await page.goto(url, {waitUntil: `load`});
        }
        return page;
    }
}