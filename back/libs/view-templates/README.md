# @fc/view-templates

## Decorator

The `@TemplateMethod(alias: string)` decorator is placed on a class method and allows exposing a method in templates.

The decorator requires a parameter `alias` (string), used to call the method in the templates.  
To identify helpers and avoid name collisions, helpers are prefixed with the `$` sign in the templates.

### Simple example

```ts
@TemplateMethod('fooBar')
someMethod(arg) {
  // ...
}
```

```html
<p><%= $fooBar(locals.args) %></p>
```

The prerequisites for the method to be correctly exposed vary depending on whether the method is static or an instance method:

- Static method: The class must be imported somewhere in the project.
- Instance method: The service must be @Injectable() and exposed in a module as a provider.

## Extended example

### Exposition of the method in typescript file

```ts
import { Injectable } from '@nestjs/common';

import { DatabaseService } from '@fc/database';
import { TemplateMethod } from '@fc/view-templates';

@Injectable()
export class FooTemplateHelper {
  constructor(private db: DatabaseService) {}

  /**
   * static method exposed in templates
   * `alias` may differ from real name
   */
  @TemplateMethod('uppercase')
  static strToUpper(value: string) {
    return value.toUpperCase();
  }

  /**
   * instance method exposed in templates
   */
  @TemplateMethod('getFooById')
  getFooById(id: string) {
    return this.db.get(id);
  }

  /**
   * Method NOT exposed in templates
   */
  saveFoo(foo) {
    return this.db.save(foo);
  }
}
```

### Usage in the templates:

```html
<div>
  <h2><%= $uppercase('some string') %></h2>

  <p><%= $getFooById(locals.id) %></p>
</div>
```

## Exceptions

### Collisions

The `@TemplateMethod(alias: string)` throws a `ViewTemplateConflictingAliasException` at app startup if the decorator is called more than once with the same `alias`.
