# @fc/i18n

## usage in application

### Initialisation

The library is singleton based and should be initialized once at the beginning of the application.

It is initialized via the `initialize` static method that takes a locale _(not used yet)_
and list of translations loaded from translation files (more on this "Translation files" section below).

```ts
// application.tsx

import { I18nService } from '@fc/i18n';
import translations from '../i18n/fr.json';

I18nService.initialize('fr', translations);
```

### Usage

The library exposes a helper called `t` that can be statically imported.

The library MUST be initialized before any use of the helper.  
The library will throw an error if the helper is called before initialization.

**Example:**

```tsx
import { t } from '@fc/i18n';

export const MyComponent = () => (
  <div>
    <h1>{t('MyComponent.title')}</h1>
    <p>{t('MyComponent.baseline')}</p>
    <p>{t('MyComponent.dynamic', { count: 2, color: 'rouge' })}</p>
  </div>
);
```

**Renders to:**

```html
<div>
  <h1>Mon super composant</h1>
  <p>Je suis un exemple</p>
  <p>il y a 2 éléments rouges</p>
</div>
```

## Translation files

Translation files follow an industry standard allowing plural handling and variables injections.

The translation key SHOULD be namespaced for better developer experience,
but this is just a convention without any technical implications.

```json
// fr.json
{
  "MyComponent.title": "Mon super composant",
  "MyComponent.baseline": "Je suis un exemple",
  "MyComponent.dynamic": {
    "term": "count",
    "definition": {
      "one": "il y a 1 élément {color}",
      "other": "il y a {count} éléments {color}s"
    }
  }
}
```

In this example, we manage a sentence that could be plural. Indeed, _term_ points the property that manage the plurial out. The other property are straightforwarded.
The following example shows how to display _il y a 5 éléments bleus_

```tsx
import { t } from '@fc/i18n';

export const MyComponent = () => (
  <div>
    <p>{t('MyComponent.dynamic', { count: 5, color: 'bleu' })}</p>
  </div>
);
```
