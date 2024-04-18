# I18n - Internationalisation

This library provides a service and a template method to handle literal translations in applications.

The translation files format is enforced by this library.

## Key features

- Template helper
- variables substitution
- plural handling

## Installation

1. Import `I18nModule` it in your app.module file, in the import section.

```ts
// apps/my-app/my-app.module.ts

import { I18nModule } from '@fc/i18n';

@Module({
  imports: [I18nModule],
})
```

2. Add `I18nConfig` the configuration for @fc/i18N to your app and instance
3. Add `I18nSession` to your app session schema
4. Define the `I18n` part of your session's `defaultData` to have a language set.

## Settings user language

To set the current user language in session, use the `setSessionLanguage()` method.

```ts
export class SomeService {
  constructor(private readonly i18n: I18nService) {}

  someMethod() {
    this.i18n.setSessionLanguage('en-GB');
  }
}
```

## Translation files

The translations are stored as typescript files rather than JSON, despite JSON tending to be a standard in the industry.

| Benefits                                | Drawbacks                            |
| --------------------------------------- | ------------------------------------ |
| easy importation                        | Compatibility with translators tools |
| composition                             |                                      |
| overrides (/libs < /apps < /instances ) |                                      |

The translations keys are string and the values can be another string or an `I18nComplexTermInterface` object.  
The latter, allows to define alternative string according to a numeric value passed as variable.

**exemple:**

```ts
export const enGB: I18nTranslationsMapType = {
  'home.greetings': 'Hello World!',
  'home.greeting_name': 'Hello {name}!',
  'home.i_have_x_apples': {
    term: 'count',
    definition: {
      one: 'I have one apple',
      many: 'I have a lot of apples',
      other: 'I have {count} apples',
    },
  },
  'home.intro': 'Welcome to <strong>{project}</strong> homepage!',
};
```

`term` designate the name of the variable that will be used to toggle the behavior.

The keys in `definition` are hard coded and can be the following:

- zero
- one
- two
- few
- many
- other

## Usage in templates

The translation function to use in templates is referenced as `$translate`.

**Method definition**

```ts
  translate(
    key: I18nTermKey,
    variables?: I18nVariables,
    options: I18nTranslateOptionsInterface = {},
  ): string {
```

**Usage exemples**

```html
<!-- Simple usage -->
<p>
  <%= $translate('home.greetings') %>
  <!-- Hello world! -->
</p>
```

```html
<!-- Variables usage -->
<p>
  <%= $translate('home.greetings_name', { name: locals.userName }) %>
  <!-- Hello Bob! -->
</p>
```

```html
<!-- Variables usage -->
<p>
  <% const apples = ['Pink lady', 'McIntosh', 'Golden', 'Fuji', 'Gala']; %>
  <%=$translate('home.i_have_x_apples', { count: locals.apples.length }) %>
  <!-- 'I have a lot of apples -->
</p>
```

```html
<!-- Force language -->
<p>
  <%= $translate('home.greetings', null, { language: 'fr-FR' }) %>
  <!-- Bonjour le Monde! -->
</p>
```

```html
<!-- Escape dynamic content (to allow usage of '<%-' marker) -->
<p>
  <%- $translate('home.greetings', {project: "Bob's Delight" } , {
  escapeVariables: true }) %>
  <!-- Welcome to <strong>Bob&39s Delight</strong> homepage! -->
</p>
```

## Usage in NetsJS typescript

Use it as any other service, and with the same API as in templates (it's the same method).

```ts
constructor(private readonly i18n: I18nService) {}

someMethod() {
  return this.i18n.translate('home.greetings');
}
```

## Nice to have in the future

- gender conjugation
