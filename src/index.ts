require('dotenv').config();
import container from "./dependencyInjection";
import { Scraper } from "./interfaces"

let scraper = container.get<Scraper.IWebScraper>("WebScraper")

scraper.Run();