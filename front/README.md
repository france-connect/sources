# FranceConnect Front Applications

- [FranceConnect Front Applications](#franceconnect-front-applications)
  - [How To](#how-to)
    - [Create a new front application](#create-a-new-front-application)
    - [Add `data-testid` to front components](#add-data-testid-to-front-components)
      - [Inside a component](#inside-a-component)
      - [Into a page using a component (as a component's prop)](#into-a-page-using-a-component-as-a-components-prop)
    - [Known Issues \& Tips](#known-issues--tips)

## How To

#### Create a new front application

1. Copy folder `$FC_ROOT/fc/front/.configs/react-app/.template` into `$FC_ROOT/fc/front/instances`
2. Rename the folder `.template` to `<app_name>`
3. Update files with app properties (name, description, version...)
   - [ ] `instances/<app_name>/.gitlab-build.yml`
   - [ ] `instances/<app_name>/index.html`
   - [ ] `instances/<app_name>/package.json`
4. Create a new Docker configuration into the compose folder `$FC_ROOT/fc/docker/compose`

#### Add `data-testid` to front components

##### Inside a component

- The `data-testid` is CamelCase
- The main component container element will be the name of the component `<div data-testid="MyComponent">`
- A child element of a component will be the name of the component prefixed with the type of the child

```
<div data-testid="MyComponent">
  <h1 data-testid="MyComponent-title">Any Title</h1>
  <a href="#" data-testid="MyComponent-link">Any Link</a>
</div>
```

##### Into a page using a component (as a component's prop)

- The `data-testid` is khebab-case

```
<div data-testid="my-page">
  <h1 data-testid="my-page-title">Any Page Title</h1>
  <MyComponent dataTestId="my-page-my-component" />
<div>
```

#### Known Issues & Tips

- When adding a new i18n translation key/value, use `yarn prepare` to renew all the instances translation files and add this new translation to the instances i18n fixtures files
- If some errors still appear in the browser after adding a file, restarting the TypeScript server, or fixing test units, use docker-stack start <instance_name>-front
