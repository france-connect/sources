# Library eIDAS OIDC mapper

## Objective

Map an eidas request with an oidc request and vice versa.
Map an eidas response with an oidc response and vice versa.

## Level of assurance mapping

Two distinct maps handle the eidas-to-oidc direction, since a requested level of assurance and an obtained one do not follow the same rules:

- `RequestedLevelOfAssurancesToAcrValueMap`: used when translating a level of assurance requested in an incoming eidas request into the `acr_values` to ask FC+. Since FC+ does not support `eidas1` acr, `LOW` is raised to `EIDAS2`.
- `ObtainedLevelOfAssurancesToAcrValueMap`: used when translating the level of assurance actually obtained from a foreign eidas identity provider into the `acr` returned to the service provider. This map is a faithful mapping (`LOW` → `EIDAS1`, `SUBSTANTIAL` → `EIDAS2`, `HIGH` → `EIDAS3`), matching `AcrValuesToLevelOfAssurancesMap` in `oidc-to-eidas.mapper.ts`.

## Description

[Documentation in the FranceConnect wiki](https://gitlab.dev-franceconnect.fr/france-connect/documentation/-/wikis/Produits/eIDAS)
[Documentation on ec.europa.eu](https://ec.europa.eu/cefdigital/wiki/download/attachments/82773108/eIDAS%20SAML%20Attribute%20Profile%20v1.1_2.pdf?version=3&modificationDate=1528362598014&api=v2)
