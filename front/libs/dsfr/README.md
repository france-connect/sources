# Design System FranceConnect

## Installation dans une application `front/apps`

```bash
yarn add @fc/dsfr
```

## Usage

- Depuis un fichier JS/TS

```typescript
import '@fc/dsfr';
```

- Utiliser les couleurs et/ou les breakpoints dans un fichier JS/TS

```typescript
import variables from '@fc/dsfr/variables.module.json';
```

## Components

#### Use the stepper with a config

`page.layout.tsx`

```typescript
import { Options, StepperContextProvider } from '@fc/dsfr';

const stepperConfig = ConfigService.get<StepperConfig>(Options.CONFIG_NAME_STEPPER);

return (
  <StepperContextProvider config={stepperConfig}>
    <MyComponentPage />
  </StepperContextProvider>
);
```

`my-component.page.tsx`

```typescript
import { StepperContext } from '@fc/dsfr';

const { gotoNextPage } = use(StepperContext);

return (
  <button onClick={gotoNextPage}>
)
```

## Commande Yarn

- `build` : Compile les fichiers SASS vers des fichier CSS pour la prod si besoin

## SASS Documentation

- [Nom de fichier avec un `_`](https://sass-lang.com/documentation/at-rules/use#partials)

## DSFR

[Documentation Officielle Design Systeme de l'Etat](https://gouvfr.atlassian.net/wiki/spaces/DB/overview?homepageId=145359476)
