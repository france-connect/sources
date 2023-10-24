# FC Statics Websites (11TY)

## Documentations

- [Eleventy 11Ty](https://www.11ty.dev/docs/)
- [Composants DSFR](https://www.systeme-de-design.gouv.fr/elements-d-interface/composants/)
- [Eleventy DSFR](https://github.com/codegouvfr/eleventy-dsfr)
- [Acessibilite Numerique](https://github.com/DISIC/accessibilite.numerique.gouv.fr/blob/main/CONTRIBUTING.md)

## HOWTO

## Create a new application (minimal requirements)

- Duplicate `./apps/example` folder and rename it to `./apps/[app_name]`
- Create new scripts entries into `web/package.json`
  ```json
  "scripts": {
    "start:[app_name]": "./scripts/yarn-watch.sh [app_name]",
    "build:[app_name]": "./scripts/yarn-build.sh [app_name]",
  }
  ```

Into the app folder

- `public/css/styles.css` file will be used to write custom app CSS styles
- `content` folder is used to store markdown contents files
- `_data/metadata.json` will be used to brand your website

## Create custom templates/components/layouts for an application (optional)

Into the app folder

- Create a `_includes/components` folder, to store specifics components used into templates (checkboxes, modals...)
- Create a `_includes/templates` folder, to store specifics pages partials used into layouts (head, footer...)
- Create a `_includes/layouts` folder, to store specifics pages templates used by contens files (home, contact...)

## Add a custom plugin to your pages

- Add your plugin as a dependency into package.json
- Duplicate `./libs/eleventy.config.js` into `./app/[app_name]`
- import your plugin

```javascript
const mermaidPlugin = require('@kevingimbel/eleventy-plugin-mermaid');

module.exports = function (eleventyConfig) {
  eleventyConfig.addPlugin(require('./eleventy.config.dsfr.js'));
  eleventyConfig.addPlugin(mermaidPlugin);
  [...]
}
```

## Customize your pages

### Add a page to the navigation bar

Into your content markdown file, use the template header to define your needs

```nunjucks
---
eleventyNavigation:
  order: 1
  key: accueil
---
```

### Use a specific layout for a page

Into your content markdown file, use the template header to define your needs

```nunjucks
---
layout: layouts/my-custom-layout.njk
---
```

### Define a page title/description

Into your content markdown file, use the template header to define your needs

```nunjucks
---
title: My Website Homepage
description: Lorem ipsum dolor sit amet...
---
```

## Start your application into dev mode

```bash
cd $FC_ROOT/fc/web
yarn start [app_name]
```

## Build your application for production

```bash
cd $FC_ROOT/fc/web
yarn build [app_name]
```

## Issues & Fixes

- While watching in dev mode and deleting file/folder
- Sticky Footer is not yet implemented
- No Docker container
- SASS files are not yet managed
