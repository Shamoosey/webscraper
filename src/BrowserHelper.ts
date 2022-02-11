import {inject, injectable} from "inversify";
import Puppeteer from "puppeteer";
import { Scraper } from "./interfaces";

@injectable()
export class BrowserHelper implements Scraper.IBrowserHelper{
    private _browserInstance : Puppeteer.Browser;

    public async GetBrowser(): Promise<Puppeteer.Browser> {
        if(!this._browserInstance){
            this._browserInstance = await Puppeteer.launch({devtools: true, headless:true});
        }
        return this._browserInstance
    }

    public async GetNewPage(): Promise<Puppeteer.Page> {
        if(!this._browserInstance) await this.GetBrowser();
        return await this._browserInstance.newPage();
    }
}