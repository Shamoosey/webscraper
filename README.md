## Simple webscraper built with typescript to get information from specific pages
##### Currently a work in progress
##### To-Do
- Add export functionality
- Create UI for configurations
- Add configurable notifications for predefined events
- Add unit tests (haha yea right)

NPM Commands
`npm run serve` - Runs the app
`npm run build` - Builds the app

You'll need to update your `appSettings.json` file to point at the path to your configuration file. 
An example of a empty config used to pull data from a site, for more examples see `/configs`
```
{
  "configurations":[
    {
      "Name": "",
      "Url": "",
      "PreScrapeSteps": [],
      "DataScrapeConfiguration": {
        "ItemBaseSelector": "",
        "ItemBaseSubSelector": "",
        "ItemSubSelectors": [
          {
            "Name":"",
            "Selector": "",
            "InnerText": true,
            "IsKey": true
          },
        ]
      }
    }
  ]
}
````