# fca-system-testing

FCA validation with system tests implemented using a Test Framework (based on Cypress/Cucumber)

## Documentation

- [BDD Framework documentation on the Wiki](https://gitlab.dev-franceconnect.fr/france-connect/documentation/-/wikis/Produits/Tests/Framework-BDD/Introduction)

## Folder Structure

- Features folder: [/cypress/integration](./cypress/integration)
- Steps/Pages folder (exploitation): [/cypress/support/exploitation](./cypress/support/exploitation)
- Steps/Pages folder (usager): [/cypress/support/usager](./cypress/support/usager)
- Test Data folder: [/cypress/fixtures](./cypress/fixtures)

## Environment Variables

| Environment Variable | Description                       | Comment                                      |
| -------------------- | --------------------------------- | -------------------------------------------- |
| PLATFORM             | Platform under test               | `fca-low`                                    |
| TEST_ENV             | Test environment                  | `docker` or `recette`, etc.                  |
| TAGS                 | Tags expression                   | `not @ignore`                                |
| EXPLOIT_ADMIN_NAME   | Exploitation admin username       | needed only for integ01/preprod              |
| EXPLOIT_ADMIN_PASS   | Exploitation admin password       | needed only for integ01/preprod              |
| EXPLOIT_ADMIN_TOTP   | Exploitation admin totp secret    | needed only for integ01/preprod              |
| EXPLOIT_USER_NAME    | Exploitation operator username    | needed only for integ01/preprod              |
| EXPLOIT_USER_PASS    | Exploitation operator password    | needed only for integ01/preprod              |
| EXPLOIT_USER_TOTP    | Exploitation operator totp secret | needed only for integ01/preprod              |
| FC_ACCESS_USER       | FranceConnect network username    | needed on recette/integ01 outside FC network |
| FC_ACCESS_PASS       | FranceConnect network password    | needed on recette/integ01 outside FC network |

## Cross Domain Testing

On integ01 environment, the AgentConnect, FS and FI websites are using different domains.
In order to run tests with Cypress,

- we need to navigate to the different URLs via a unique page listing all the websites URLs
  - [Read more about Same superdomain per test](https://docs.cypress.io/guides/guides/web-security#Same-superdomain-per-test)
- we need to disable the chrome web security to allow redirections to different domains
  - [Read more about Disabling Web Security](https://docs.cypress.io/guides/guides/web-security#Set-chromeWebSecurity-to-false)
- we need to use Cookies with samesite=none (intercept in beforeEach hook)
  - [beforeEach hook](./cypress/support/common/steps/hooks.ts)
  - [Read more about SameSite cookie attribute](https://developer.mozilla.org/fr/docs/Web/HTTP/Headers/Set-Cookie/SameSite)

## Scripts

### Run the Cypress test in the terminal (deleting previous results)

```
# Run Cypress on fcaLow against docker environment
yarn test:low

# Run Cypress on fcaLow against integ01 environment
CYPRESS_TEST_ENV=integ01 yarn test:low
```

### Open Cypress window

```
# Run Cypress on fcaLow against docker environment
yarn start:low

# Run Cypress on fcaLow against integ01 environment
CYPRESS_TEST_ENV=integ01 yarn start:low
```

### Generate the Cucumber HTML report

```
# Add Screenshots/Videos to the Cucumber logs
yarn report:prepare

# Generate the report
CYPRESS_PLATFORM=fca-low CYPRESS_TEST_ENV=integ01 yarn report:generate
```

## Plugins VSCode

### Cucumber (Gherkin) Full Support

https://marketplace.visualstudio.com/items?itemName=alexkrechik.cucumberautocomplete

This plugin provides support for writing/maintaining scenarios in the feature files.
It automatically lists the implemented steps while editing the scenarios.

In order to setup the VSCode extension for FCA, you can either open the workspace from the `/quality/fca` folder or copy the following settings in your VSCode User settings.

```
{
  "cucumberautocomplete.customParameters": [],
  "cucumberautocomplete.steps": ["quality/fca/cypress/support/**/steps/*.ts"],
  "cucumberautocomplete.strictGherkinCompletion": false,
  "cucumberautocomplete.formatConfOverride": {
    "Fonctionnalité": 0,
    "Contexte": 1,
    "Scénario": 1,
    "Plan du Scénario:": 1,
    "Etant donné que": 2,
    "Et que": 2,
    "Quand": 2,
    "Alors": 2,
    "Et": 2,
    "Exemples:": 2,
    "\\*": 2,
    "\\|": 3,
    "#": "relative",
    "@": "relative"
  }
}
```
