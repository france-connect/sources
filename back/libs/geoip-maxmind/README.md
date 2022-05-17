# Geoip Maxmind

## Documentation

- https://www.maxmind.com/en/home
- All databases available: https://www.maxmind.com/en/accounts/702494/geoip/downloads ( need to have an account to access this page )

## Objective

The library implements the mechanics to retrieve the user location through the local IP database called Maxmind.

## Description

To retrieve the user's address we used the database `GeoLite2 City`. All informations returned by the local database is not recovered. 

2 methods have been developed to meet the needs of the model 

### getCityName

Allows you to retrieve the name of the city using the ip provided as a parameter _(Ex: Paris)_.

### getCountryIsoCode

Allows you to retrieve the country iso code using the ip provided as a parameter _(Ex: 75)_.