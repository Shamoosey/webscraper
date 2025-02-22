### A simple webscraper built with typescript to get information from specific pages
##### Currently a work in progress

NPM Commands
`npm run serve` - Runs the app
`npm run build` - Builds the app



Example of a empty config used to pull data from a site, see /src/Mocks/ScraperMock.ts for examples

```
{
    Url: "",
    ItemBaseSelector: "",
    ItemBaseSubSelector: "",
    ItemSubSelectors: [
        {
            Name:"",
            Selector: "",
            Regex: ""
            InnerHTML: true
        }
    ]
}