# FC Core FCP / FCA

Core & backoffice applications

- [Documentation](_doc/README.md)

## Librairies

- [@fc/apache-ignite](libs/apache-ignite/README.md)
- [@fc/eidas-client](libs/eidas-client/README.md)
- [@fc/eidas-country](libs/eidas-country/README.md)
- [@fc/eidas-light-protocol](libs/eidas-light-protocol/README.md)
- [@fc/eidas-oidc-mapper](libs/eidas-oidc-mapper/README.md)
- [@fc/eidas-provider](libs/eidas-provider/README.md)
- [@fc/exceptions](libs/exceptions/README.md)
- [@fc/http-proxy](libs/http-proxy/README.md)
- [@fc/oidc-client](libs/oidc-client/README.md)
- [@fc/oidc-provider](libs/oidc-provider/README.md)
- [@fc/session](libs/session/README.md)
- [@fc/tracking](libs/tracking/README.md)

## Applications

- [@fc/core-fcp](apps/core-fcp/README.md)

## Installation

## Sécurité

### Dépendances

[Informations relatives à la sécurité sur les dépendances](_doc/sécurité-dépendances.md).
Le document compile les remontées de checkmarx (outil actuel) ainsi que les contre-mesures mises en place.

## Mise en place des données

## Etc/hosts

## Variables d'env

## Erreur

- [@fc/error](libs/error/README.md)

## Run the Cypress E2E tests

Run the tests from a terminal
```
yarn test:e2e:core-fca-low
yarn test:e2e:core-fcp-low
yarn test:e2e:core-fcp-high
yarn test:e2e:eidas-bridge
```

Open Cypress UI
```
yarn test:e2e:core-fca-low:open
yarn test:e2e:core-fcp-low:open
yarn test:e2e:core-fcp-high:open
yarn test:e2e:eidas-bridge:open
```
