# FC Statics Websites (11TY)

- [FC Statics Websites (11TY)](#fc-statics-websites-11ty)
  - [Documentations](#documentations)
  - [Project Structure](#project-structure)
  - [Start your application in dev mode](#start-your-application-in-dev-mode)
  - [Build your application for production](#build-your-application-for-production)
  - [HOWTO](#howto)
    - [Create a new application (minimal requirements)](#create-a-new-application-minimal-requirements)
      - [Into the app folder](#into-the-app-folder)
      - [Into the main Docker folder ($FC_ROOT/fc/docker)](#into-the-main-docker-folder-fc_rootfcdocker)
    - [Create custom templates/components/layouts for an application (optional)](#create-custom-templatescomponentslayouts-for-an-application-optional)
    - [Add a custom plugin to your pages](#add-a-custom-plugin-to-your-pages)
    - [Use a specific layout for a page](#use-a-specific-layout-for-a-page)
    - [Define a page metadatas title/description](#define-a-page-metadatas-titledescription)
    - [Add a page to the navigation bar](#add-a-page-to-the-navigation-bar)
    - [Search](#search)
    - [Start your application into a Docker environment](#start-your-application-into-a-docker-environment)
    - [Start your application into local development environment](#start-your-application-into-local-development-environment)
    - [Build your application for a production environment](#build-your-application-for-a-production-environment)
    - [Cleanup your application node_modules and instances](#cleanup-your-application-node_modules-and-instances)
  - [Documentations](#documentations-1)
  - [Examples](#examples)
  - [Issues \& Fixes](#issues--fixes)

### Documentations

- [Eleventy 11Ty](https://www.11ty.dev/docs/)
- [Composants DSFR](https://www.systeme-de-design.gouv.fr/elements-d-interface/composants/)
- [Eleventy DSFR](https://github.com/codegouvfr/eleventy-dsfr)

### Project Structure

- Main applications markdown files : `$FC_ROOT/web/apps`
- Output applications folder : `$FC_ROOT/web/instances`
- Generics shareds files/folder across applications : `$FC_ROOT/web/libs`

### Start your application in dev mode

```bash
cd $FC_ROOT/fc/web
yarn start [app_name]
```

### Build your application for production

```bash
cd $FC_ROOT/fc/web
yarn build [app_name]
```

## HOWTO

### Create a new application (minimal requirements)

- Duplicate `./apps/doc-example` folder and rename it to `./apps/[app_name]`
- Update the `name` and `description` fields into `./apps/[app_name]/package.json` with your project `app_name`

##### Into the app folder

- `content` folder is used to store markdown contents files
- `public/css/styles.css` will be used to write custom app CSS styles
- `_data/metadata.json` will be used to brand your website

##### Into the main Docker folder ($FC_ROOT/fc/docker)

- Update `compose/web/main.yml` with a new service
  ```yaml
  [app_name]:
    extends:
      service: web-base
      file: '${COMPOSE_DIR}/web/base.yml'
    hostname: [app_name]
    depends_on:
      - 'rp-all'
    environment:
      - 'PM2_SCRIPT=yarn start [app_name]'
      - 'VIRTUAL_HOST=[app_name].docker.dev-franceconnect.fr'
  ```

### Create custom templates/components/layouts for an application (optional)

Into the `./apps/[app_name]/_includes` folder

- To store **specifics components** used into templates (checkboxes, modals...), create a `components` folder
- To store **specifics pages partials** used into layouts (head, footer...), create a `./_includes/templates` folder
- To store **specifics templates pages** used by contents files (home, contact...), Create a `./_includes/layouts` folder

### Add a custom plugin to your pages

- Add your plugin as a dependency into `./app/[app_name]/package.json`
- Duplicate `./libs/eleventy.config.js` into `./app/[app_name]`
- Import your plugin into `./app/[app_name]/eleventy.config.js`

**Example :**

```javascript
const mermaidPlugin = require('@kevingimbel/eleventy-plugin-mermaid');

module.exports = function (eleventyConfig) {
  eleventyConfig.addPlugin(require('./eleventy.config.dsfr.js'));
  eleventyConfig.addPlugin(mermaidPlugin);
  [...]
}
```

### Use a specific layout for a page

Into the `./apps/[app_name]/content/[my_page].md`, use the template header to define your needs

```nunjucks
---
layout: layouts/my-custom-layout.njk
---
```

### Define a page metadatas title/description

Into the `./apps/[app_name]/content/[my_page].md`, use the template header to define your needs

```nunjucks
---
title: My Website Homepage
description: Lorem ipsum dolor sit amet...
---
```

### Add a page to the navigation bar

Into the `./apps/[app_name]/content/[my_page].md`, use the template header to define your needs

```nunjucks
---
eleventyNavigation:
  order: 1
  key: [slugified-term]
  title: [human readable label]
  # (will create a nested navigation item relative to parent)
  parent: [parent-slugified-term]
---
```

Enhance the navigation with nested items

```nunjucks
---
eleventyNavigation:
  ...
  parent: [parent-slugified-term]
---
```

### Search

**Append/Ignore a page/section to the searching indexer**

- [Pagefind Static Search](https://pagefind.app/docs/indexing/)

**Make the search index**

```bash
cd $FC_ROOT/fc/web
yarn make:search [app_name]
# $ docker exec -itu root [id_app_container] /bin/bash
# $ yarn make:search [app_name]
```

### Start your application into a Docker environment

```bash
docker-stack up [app_name]
docker-stack start-all
# -> http://[app_name].docker.dev-franceconnect.fr
```

### Start your application into local development environment

```bash
cd $FC_ROOT/fc/web
yarn start [app_name]
# -> http://localhost:3000
```

### Build your application for a production environment

```bash
cd $FC_ROOT/fc/web
yarn build [app_name]
```

### Cleanup your application node_modules and instances

```bash
cd $FC_ROOT/fc/web
yarn cleanup
```

## Documentations

- [Nunjucks Templating](https://mozilla.github.io/nunjucks/)
- [Eleventy DSFR](https://github.com/codegouvfr/eleventy-dsfr)
- [Eleventy 11Ty](https://www.11ty.dev/docs/)
- [Code Gouv Repository](https://github.com/codegouvfr/codegouv-website)
- [Composants DSFR](https://www.systeme-de-design.gouv.fr/elements-d-interface/composants/)

## Examples

- [Code Gouv](https://code.gouv.fr/)
- [Acessibilite Numerique](https://github.com/DISIC/accessibilite.numerique.gouv.fr/blob/main/CONTRIBUTING.md)

## Issues & Fixes

- While watching in dev mode and deleting file/folder
- Need to re `start-all` to take `./libs` folder changes
- SASS files are not yet managed
