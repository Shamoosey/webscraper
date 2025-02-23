import {inject, injectable} from "inversify";
import { Scraper } from "./interfaces";
import { parse } from 'node-html-parser';
import { Logger } from "winston";
import { BrowserHelper } from "./BrowserHelper";
import { ConfigService } from "./ConfigService";
import { Page } from "puppeteer";
import * as XLSX from "xlsx";
import * as fsExtra from "fs-extra";
import * as path from "path";

@injectable()
export class WebScraper implements Scraper.IWebScraper {
  private _browserHelper: Scraper.IBrowserHelper;
  private _logger: Logger;
  private _configService: Scraper.IConfigService

  constructor (
    @inject(BrowserHelper) browserHelper: Scraper.IBrowserHelper,
    @inject(Logger) logger: Logger,
    @inject (ConfigService) configService: Scraper.IConfigService
) {
    this._browserHelper = browserHelper;
    this._logger = logger;
    this._configService = configService;
  }

  public async Run(): Promise<void>{
    this._logger.info("**App Started**")
    try {
      const configs = await this._configService.GetScrapeConfigurations();
      for(let config of configs){
        await this.PreformScrape(config);
      }
    } catch (e) {
      this._logger.error("Error occured while preforming scrape", e);
    }
  }

  private async PreformScrape(config: Scraper.Configuration.ScrapeConfiguration):Promise<void>{
    this._logger.info(`Preforming scrape for config`, config)
    
    let page = await this._browserHelper.GetNewPage(config.Url);
    //preform prescrape steps
    for(let step of config.PreScrapeSteps){
      if(step.Action == "Click"){
        page.evaluate((selector) => {
          (document.querySelector(selector) as any).click();
        }, step.ItemSelector);
      } else if (step.Action == "Input") {
        await page.$eval(step.ItemSelector, (el: any, value) => el.value = value, step.ActionData)
      }
      else if (step.Action == "Select"){
        await page.select(step.ItemSelector, step.ActionData);
      }
    }
    await page.waitForNavigation();
    await page.goto(config.DataScrapeConfiguration.Url);
    
    const scrapedData = new Map<string ,Map<string, string>>()
    let nextPage = true;
    do {

      const pageScrape = await this.ScrapeMetaData(config, page);
      for(const [key, value] of pageScrape){
        scrapedData.set(key, value)
      }
      nextPage = await page.$(config.DataScrapeConfiguration.NextPageSelector) !== null
      if(nextPage){
        page.evaluate((selector) => {
          (document.querySelector(selector) as any).click();
        }, config.DataScrapeConfiguration.NextPageSelector);
        await page.waitForNavigation();
      }
    } while (nextPage)

    page.close();
    this._logger.info(`Scrape Complete for config: ${config.Name}`)
    await this.exportToExcel(config, scrapedData);
  }

  private async ScrapeMetaData(config: Scraper.Configuration.ScrapeConfiguration, page: Page): Promise<Map<string ,Map<string, string>>>{
    let parsedHtml = parse(await page.$eval(config.DataScrapeConfiguration.ItemBaseSelector, el => el.innerHTML))
    let selectedItems = parsedHtml.querySelectorAll(config.DataScrapeConfiguration.ItemBaseSubSelector);
    const scrapedData = new Map<string ,Map<string, string>>()
    for(let item of selectedItems){
      let metaData = new Map<string, string>();
      let key = "";
      for(let subSelector of config.DataScrapeConfiguration.ItemSubSelectors){
        let el = item.querySelector(subSelector.Selector)
        if(el){
          if(subSelector.InnerText){
            const text = el.innerText.trim();
            this._logger.debug(`Successfully Scraped InnerText for SubSelector ${subSelector.Name} : ${text}`)
            if(subSelector.IsKey){
              key = text
            } else {
              metaData.set(subSelector.Name, text.replace("&nbsp;", ""))
            }
          }
        }
      }
      scrapedData.set(key, metaData);
    }

    return scrapedData;
  }

  private async exportToExcel(config: Scraper.Configuration.ScrapeConfiguration, data: Map<string, Map<string, string>>){
    // Convert Map to an array of objects
    const dataArray = Array.from(data, ([key, value]) => {
      const obj: Record<string, string> = { ID: key };
      value.forEach((v, k) => (obj[k] = v));
      return obj;
    });

    const worksheet = XLSX.utils.json_to_sheet(dataArray);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, config.DataScrapeConfiguration.ScrapeName);
    const filePath = path.join(this._configService.appSettings.outputPath, `${config.Name}.xlsx`);

    await fsExtra.ensureDir(this._configService.appSettings.outputPath);
    XLSX.writeFile(workbook, filePath);

    this._logger.info(`Excel file saved to ${filePath}`);
  }
}