import { Scraper } from "../interfaces";
import {inject, injectable} from "inversify";

@injectable()
export class ScraperMock implements Scraper.IScraperMock{
    public GetMemoryExpressMock(): Scraper.IScrapedWebsiteConfiguration {
        return {
            Name: "Memory Express",
            Url: "https://www.memoryexpress.com/Category/VideoCards?FilterID=a5802dd9-4178-dc7a-049e-e8f0a4932a24&InventoryType=InStock&Sort=Price&PageSize=120&Page=1",
            ItemBaseSelector: ".c-shca-container",
            ItemBaseSubSelector: ".c-shca-icon-item",
            ItemSubSelectors: [
                {
                    Name:"GpuName",
                    Selector: ".c-shca-icon-item__body-name a",
                    InnerText: true,
                    IsKey: true
                },
                {
                    Name:"GpuPrice",
                    Selector: ".c-shca-icon-item__summary-regular span",
                    InnerText: true
                }
            ]
        }
    }
    public GetNewEggMock(): Scraper.IScrapedWebsiteConfiguration {
        return {
            Name: "New Egg",
            Url: "https://www.newegg.ca/p/pl?PageSize=96&N=100007708%20601357282",
            ItemBaseSelector: ".item-cells-wrap",
            ItemBaseSubSelector: ".item-cell",
            ItemSubSelectors: [
                {
                    Name:"GpuName",
                    Selector: ".item-title",
                    InnerText: true,
                    IsKey: true
                },
                {
                    Name:"GpuPrice",
                    Selector: ".price-current",
                    InnerText: true
                },
                {
                    Name:"GpuShippingPrice",
                    Selector: ".price-ship",
                    InnerText: true
                }
            ]
        }
    }
    public GetKijijiTestMock(): Scraper.IScrapedWebsiteConfiguration {
        return {
            Name: "Kijiji",
            Url: "https://www.kijiji.ca/b-winnipeg/l1700192",
            ItemBaseSelector: ".container-results:nth-child(2)",
            ItemBaseSubSelector: ".search-item",
            ItemSubSelectors: [
                {
                    Name:"ListingName",
                    Selector: ".info-container .title a",
                    InnerText: true,
                    IsKey: true
                },
                {
                    Name:"Price",
                    Selector: ".info-container .price",
                    InnerText: true
                },
                {
                    Name:"Description",
                    Selector: ".info-container .description",
                    InnerText: true
                }
            ]
        }
    }
}