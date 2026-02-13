# Framework Upgrade

## Cypress Upgrade

### Resources

#### Cypress Core

- [Cypress Migration Guide](https://docs.cypress.io/guides/references/migration-guide)
- [Cypress changelog](https://docs.cypress.io/guides/references/changelog)
- [Cypress issues](https://github.com/cypress-io/cypress/issues)

- [Cypress Cucumber Preprocessor](https://github.com/badeball/cypress-cucumber-preprocessor/releases)

#### Cypress Plugins

- [cypress-axe](https://yarnpkg.com/package?q=cypress-axe&name=cypress-axe)
- [cypress-image-snapshot](https://yarnpkg.com/package?q=cypress-image-snapshot&name=@simonsmith/cypress-image-snapshot)
- [cypress-maildev](https://yarnpkg.com/package?q=cypress-maildev&name=cypress-maildev)
- [cypress-on-fix](https://yarnpkg.com/package?q=cypress-on-fix&name=cypress-on-fix)
- [cypress-plugin-api](https://yarnpkg.com/package?q=cypress-plugin-api&name=cypress-plugin-api)

#### Autres

- [axe-core (accessibility)](https://github.com/dequelabs/axe-core/releases)
- [multiple-cucumber-html-reporter (reporting)](https://yarnpkg.com/package?q=multiple-cucumber-html-reporter&name=multiple-cucumber-html-reporter)
- [amqplib (RabbitMQ client)](https://yarnpkg.com/package?q=amqplib&name=amqplib)
- [mongodb (MongoDB client)](https://yarnpkg.com/package?q=%20%20%20%20mongodb&name=mongodb)
- [postgres (Postgres client)](https://yarnpkg.com/package?q=postgres&name=postgres)

### Upgrade Process

1. Read the Cypress Migration and changelog to detect interesting release to upgrade to
2. Check the opened issues on the release (the latest release could be unstable)
3. Check the compatibility with the Cypress Cucumber Preprocessor
4. Upgrade Cypress with the Cypress Cucumber Preprocessor
5. Check the impact on a test execution
6. Adjust the Cypress tests
7. Adjust the Cypress plugins
8. Run the tests BDD on FC+ and E2E on FC-APPS to check the stability of the run
9. Run the tests BDD on FC+, FC v2, user-dashboard, FC legacy, formulaire-usagers
10. Run the tests E2E on FC-APPS

#### How to generate a new Cypress docker image

##### 1. Retrieve an Gitlab access token

In Gitlab, 
- click on "Preferences" then "Access tokens"
- Add a new "Personal access tokens" with scope "read_registry, write_registry"
- Keep the access token

More information <https://docs.gitlab.com/user/project/settings/project_access_tokens/#create-a-project-access-token>

##### 2. Configure the Docker registry environment variables

Edit the file `~/.bashrc` to setup the following environment variables with your access token.

```
export FC_DOCKER_REGISTRY=registry.gitlab.dev-franceconnect.fr/france-connect/fc
export FC_DOCKER_REGISTRY_USER=<gitlab user>
export FC_DOCKER_REGISTRY_PASS=<access token>
```

##### 3. Build and push a new Cypress docker image

- Update the Cypress Dockerfile: [docker/builds/cypress/Dockerfile]
- Update the quality dependencies: [quality/package.json]
- Open a bash terminal, and run the build and push command

```bash
# docker-stack build-push cypress <version>
docker-stack build-push cypress 15.8.2
```

##### 4. Update the CYPRESS_IMAGE_VERSION environment variable

Edit the docker-stack config [tools/config/ci.sh], in order to set the default value.

```bash
export CYPRESS_IMAGE_VERSION=${CYPRESS_IMAGE_VERSION:-15.8.2}
```

### Known issues when upgrading to Cypress v15.8.2

#### 1. `oqtlib`

The v13.0.0 is a total rewrite of the library. It is not compatible with the version used in the fc-apps E2E tests.

We will keep using v12.0.1, until we implement the new fc-apps.

see https://github.com/yeojz/otplib/releases/tag/v13.0.0

#### 2. `@types/node`

We keep v22.19.7 to match current version of `node` used by the applications.

#### 3. `mongodb`

We keep v6.21.0 to match current version of `mongodb` used by the applications.
