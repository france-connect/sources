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

### Run the Cypress tests on FCA-LOW

#### Start the local stack for FCA-LOW

- [More information regarding the local development stack](../../docker/_doc/README.md)

```shell
docker-stack prune && \
docker-stack up all-fca-low && \
docker-stack fca-low-front && \
docker-stack dep core-fca-low exploitation-fca-low && \
docker-stack fixtures-fca-low && \
docker-stack start exploitation-fca-low && \
docker-stack start fsa1-low fsa2-low fsa4-low fia1-low fia2-low fia4-low fia5-low && \
docker-stack start core-fca-low fca-low-front exploitation-fca-low
```

#### Run the tests on docker environment in the terminal (deleting previous results)

1. [Start the local stack of FCA-LOW using the docker-stack command](#start-the-local-stack-for-fca-low)
1. Run Cypress tests on FCA-LOW against docker environment

```shell
yarn test:low
```

#### Run the tests from Cypress UI for docker environment

1. [Start the local stack of FCA-LOW using the docker-stack command](#start-the-local-stack-for-fca-low)
1. Open Cypress UI to run tests on FCA-LOW against docker environment

```shell
yarn start:low
```

#### Run the tests from Cypress UI for recette environment

1. Duplicate `cypress-fca-low.json` and rename it `cypress-recette.json`
2. Change the following env attributes

  ```json
  "TEST_ENV": "recette",
  "FC_ACCESS_USER": "<FranceConnect access user for HTTP Basic Authentication>",
  "FC_ACCESS_PASS": "<FranceConnect access password for HTTP Basic Authentication>",
  ```

3. Run the job `review-fca-low` on the merge request, in order to deploy the recette environment
4. Check that the recette environment is up and running navigating from `https://recette.dev-franceconnect.fr/fca.html`
5. Open Cypress UI to run tests on FCA-LOW against recette environment

  ```shell
  yarn start:low --config-file cypress-recette.json
  ```

6. Run the `usager` tests (user connection) or `exploitation` tests (admin configuration)

#### Run the tests from Cypress UI for integ01 environment

1. Duplicate `cypress-fca-low.json` and rename it `cypress-integ01.json`
2. Change the following env attributes

  ```json
  "TEST_ENV": "integ01",
  "EXPLOIT_USER_NAME": "<your integ01 operator user>",
  "EXPLOIT_USER_PASS": "<your integ01 operator password>",
  "EXPLOIT_USER_TOTP": "<your integ01 operator totp secret",
  "FC_ACCESS_USER": "<FranceConnect access user for HTTP Basic Authentication>",
  "FC_ACCESS_PASS": "<FranceConnect access password for HTTP Basic Authentication>",
  ```

3. Start the proxy to access `https://docker.dev-franceconnect.fr/integ01/fca.html`

  ```shell
  docker-stack up rp-all
  ```

4. Open Cypress UI to run tests on FCA-LOW against integ01 environment

  ```shell
  yarn start:low --config-file cypress-integ01.json
  ```

5. Run the `usager` tests (user connection) or `exploitation` tests (if you have an operator user)

### Generate the Cucumber HTML report

```shell
# Add Screenshots/Videos to the Cucumber logs
yarn report:prepare

# Generate the report
CYPRESS_PLATFORM=fca-low CYPRESS_TEST_ENV=integ01 yarn report:generate
```

## Plugins VSCode

### Cucumber (Gherkin) Full Support

Link: [CucumberAutoComplete plugin](https://marketplace.visualstudio.com/items?itemName=alexkrechik.cucumberautocomplete)

This plugin provides support for writing/maintaining scenarios in the feature files.
It automatically lists the implemented steps while editing the scenarios.

In order to setup the VSCode extension for FCA, you can either open the workspace from the `/quality/fca` folder or copy the following settings in your VSCode User settings.

```json
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
