import { Browser, Page } from "puppeteer";
import { ConfigService } from "./ConfigService";

export namespace Scraper {
  export interface IWebScraper {
    Run(): Promise<void>;
  }

  export interface IBrowserHelper {
    GetBrowser(): Promise<Browser>;
    GetNewPage(url?: string): Promise<Page>;
  }

  export interface IConfigService {
    appSettings: AppSettings
    GetScrapeConfigurations(): Promise<Configuration.ScrapeConfiguration[]>
  }

  export interface AppSettings {
    env: string
    configPath: string,
    outputPath: string
  }
  
  export interface StoredScrapedData {
    ConfigKey: string,
    ScrapedData: Map<string ,Map<string, string>>
  }

  export namespace Configuration {
    export interface JsonScrapeConfiguration {
      configurations: ScrapeConfiguration[]
    }

    export interface ScrapeConfiguration {
      Name: string,
      Url: string,
      PreScrapeSteps: PreScrapeStep[], //pre-scrape steps IE: bypass age verification / login pages
      DataScrapeConfiguration: ScrapeDataConfiguration
    }

    export interface PreScrapeStep {
      ItemSelector: string,
      Action: ActionType //Action to preform
      ActionData?: string //Url to Navigate, Text to input
    }

    export type ActionType = "Click" | "Input" | "Select";

    export interface ScrapeDataConfiguration {
      ScrapeName: string
      Url: string,
      ItemBaseSelector: string,
      ItemBaseSubSelector: string,
      NextPageSelector: string
      ItemSubSelectors: ItemSubSelector [],
    }
  
    export interface ItemSubSelector{
      Name: string,
      Selector: string,
      Regex?: string,
      InnerText?: boolean
      IsKey?: boolean
    }
  }
}