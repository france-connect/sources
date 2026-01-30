# App


Global lib for all app

> :bulb: This lib should be split into different libraries for consumers / API / HTML apps 


## Assets management

### Configuration
Use the following env variables to configure assets:

**App_ASSETS_URL_PREFIX**: Virtual path to assets, may contain a cache busting token

**App_ASSETS_URL_DOMAIN**: External domain to fetch assets from, ommit this if you do not want to serve assets from a external domain. 

### Template function

Use the template function `$asset()` to wrap assets inclusions in ejs templates.
