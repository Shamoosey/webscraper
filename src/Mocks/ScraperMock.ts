import { Scraper } from "../interfaces";
import {inject, injectable} from "inversify";

@injectable()
export class ScraperMock implements Scraper.IScraperMock{
    public GetMemoryExpressMock(): Scraper.IScrapedWebsiteConfiguration {
        return {
            Url: "https://www.memoryexpress.com/Category/VideoCards?FilterID=a5802dd9-4178-dc7a-049e-e8f0a4932a24&InventoryType=InStock&Sort=Price&PageSize=120",
            ItemBaseSelector: ".c-shca-container",
            ItemBaseSubSelector: ".c-shca-icon-item",
            ItemSubSelectors: [
                {
                    Name:"GpuName",
                    Selector: ".c-shca-icon-item__body-name a",
                    InnerText: true
                },
                {
                    Name:"GpuPrice",
                    Selector: ".c-shca-icon-item__summary-regular span",
                    InnerText: true
                }
            ]
        }
    }
}