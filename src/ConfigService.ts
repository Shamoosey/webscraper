import fse from "fs-extra";
import path from "path";
import { inject, injectable } from "inversify";
import { Scraper } from "./interfaces";
import { Logger } from "winston";

@injectable()
export class ConfigService implements Scraper.IConfigService{
  private _logger: Logger;

  private settings: Scraper.AppSettings;
  private configs: Scraper.Configuration.ScrapeConfiguration[] = [];
  private configsLoaded = false

  constructor(
    @inject(Logger) logger: Logger
  ) {
    this._logger = logger;

    const filePath = path.resolve(__dirname, "../appSettings.json");
    const rawData = fse.readFileSync(filePath, "utf-8");
    this.settings = JSON.parse(rawData);
  }

  get appSettings(): Scraper.AppSettings {
    return this.settings;
  }

  public async GetScrapeConfigurations(): Promise<Scraper.Configuration.ScrapeConfiguration[]> {
    if(!this.configsLoaded){
      if(this.stringValid(this.settings.configPath)){
        const validPath = await fse.pathExists(this.settings.configPath);
        try {
          if(validPath){
            const data = await fse.readJson(this.settings.configPath) as Scraper.Configuration.JsonScrapeConfiguration;
            if(data != undefined) {
              this.configsLoaded = true;
              this.configs = data?.configurations ?? [];
            } else {
              this._logger.warn("configPath JSON data is undefined", this.settings.configPath)
            }
          } else {
            this._logger.info("appSetting configPath value is not valid", this.settings.configPath)
          }
        }
        catch (e){
          this._logger.error("Error while loading configurations", e)
        }
      } else {
        this._logger.info("appSetting configPath value is not valid", this.settings.configPath)
      }
    }

    return this.configs; 
  }

  private stringValid = (str: string) => (str != null && str != undefined && str != "");
}
