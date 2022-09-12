# @fc/Config

This module should be used as a main configuration provider for any React applications.

## Usage

### `initialize` static method

Should be called only once into the main application's component and before any third party libraries context provider :<br>

`font/apps/*/src/ui/application.ts`

```javascript
import { config } from './config/index.ts';

// initializing the module
ConfigService.initialize(config);

export function Application(): JSX.Element {
  return <React.StrictMode>...</React.StrictMode>;
}
```

### `get` static method

Retrieve any configuration's value<br>

```javascript
ConfigService.get('path.to.any.configuration.value');
}
```
