import { Scraper } from "../interfaces";
import {inject, injectable} from "inversify";

@injectable()
export class ScraperMock implements Scraper.IScraperMock{
    public GetMock(): Scraper.IScrapedWebsite {
        return {
            Url: "https://www.memoryexpress.com/Category/VideoCards?PageSize=120",
            ItemBaseSelector: ".c-shca-container",
            ItemSubSelector: ".c-shca-icon-item .c-shca-icon-item__summary-list span"
        }
    }
}