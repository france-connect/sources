# State management with react-redux

## Usage

### Step by step library implementation example

1. The first step is to create the state interface for your library. It should be exported from the library to be used by the application when necessary.

`custom-lib/src/interfaces/example-state.interface.ts`

```typescript
/* istanbul ignore file */

// declarative file
export interface CustomLibState {
  foo: string;
  bar: boolean;
  fizz: number;
  ...
}
```

2. Create a `store` folder into your library `src` folder, this folder will contain a barrel file :

`custom-lib/src/store/index.ts`

```typescript
/* istanbul ignore file */

// declarative file
export * from './actions';
export * from './reducers';
export * from './side-effects';
export * from './state';
```

3. Then, create the `state` configuration file.

`custom-lib/src/store/state.ts`

```typescript
/* istanbul ignore file */

// declarative file
import { GlobalState } from '@fc/state-management';

import { CustomLibState } from './interfaces';

// Your state configuration MUST use the GlobalState interface
export const state: GlobalState<CustomLibState> = {
  /**
   * To be composed later (see application implementation)
   * you need to scope your state with the library name.
   */
  CustomLib: {
    blacklist: true,
    /**
     * You must initialize every state's keys/values of the state
     */
    defaultValue: {
      foo: 'foo';
      bar: false;
      fizz: 0,
      ...
    },
  },
};
```

4. Create an `action type` with enums, it will expose your library actions to the application.

`my-lib/src/enums/action-types.enum.ts`

```typescript
/* istanbul ignore file */

// declarative file
export enum CustomLibActionTypes {
  CUSTOM_LIB_REQUESTED = 'CUSTOM_LIB_REQUESTED',
  CUSTOM_LIB_FAILED = 'CUSTOM_LIB_FAILED',
  ...
}
```

5.  Export `action types`

`custom-lib/src/enums/index.ts`

```typescript
/* istanbul ignore file */

// declarative file
export * from './action-types.enum';
```

6. Here comes the reducers.

`custom-lib/src/store/reducers.ts`

```typescript
import { FSA } from '@fc/common';

import { CustomLibActionTypes } from '../enums';
import { CustomLibState } from './interfaces';

/**
 * Here we limit the modifications to the library state only, but be wary
 * that the global state is sent as first parameter ⚠️ ⚠️ ⚠️.
 */

export const CustomLibFailed = (state, action: FSA) => ({
  ...state,
  CustomLib: {
    ...state.CustomLib,
    bar: true,
  },
});

export const CustomLibRequested = (state, action: FSA) => (
  const { fizz } =  action.payload;
  return {
  ...state,
  CustomLib: {
    ...state.CustomLib,
    fizz,
  },
});


// Reducers MUST be exported mapped by corresponding action type to be called later
export const reducers = {
  [CustomLibActionTypes.CUSTOM_LIB_FAILED]: CustomLibFailed,
  [CustomLibActionTypes.CUSTOM_LIB_REQUESTED]: CustomLibRequested,
};
```

7. You have everything to create your actions.

`custom-lib/src/store/actions.ts`

```typescript
import { FSA } from '@fc/common';

import { CustomLibActionTypes } from '../enums';
import { CustomLibState } from '../interfaces';

export function customLibFailed(): FSA {
  return {
    type: CustomLibActionTypes.CUSTOM_LIB_FAILED,
  };
}

export function CustomLibRequested(): FSA {
  return {
    type: CustomLibActionTypes.CUSTOM_LIB_REQUESTED,
  };
}
```

8. Finally, you link action types with actions to dispatch using side effects

`custom-lib/src/store/side-effects.ts`

```typescript
import { ConfigService } from '@fc/config';
import { FSA } from '@fc/common'
import * as httpClient from '@fc/http-client';
import { SideEffectMap } from '@fc/state-management';

import { CustomLibActionTypes} from '../enums';
import { CustomLibFailed, CustomLibRequested } from './actions';

export const requestCustomLib = async (action: FSA, dispatch: Function) => {
  try {

    /**
     * 
     * Some treatments for example
     * 
     */

    dispatch(CustomLibRequested(data));
  } catch (err) {
    dispatch(CustomLibFailed());
  }
};

// sideEffects MUST be exported mapped by corresponding action type to be called later
export const sideEffects: SideEffectMap = {
  [CustomLibActionTypes.CUSTOM_LIB_REQUESTED]: requestCustomLib,
};
```

### Step by step application implementation example

⚠️ From this step you already have a library that exposes required elements. If not, see previous section.

0. Install react-redux in the application if not already done.

1. In the application src root, you will need to create a `store` directory as:

`<app>/src/store/index.ts`

```typescript
/* istanbul ignore file */

// declarative file
export * from './middlewares';
export * from './reducers';
export * from './states';
```

`<app>/src/store/middlewares.ts`

```typescript
/* istanbul ignore file */

// declarative file
import { customLibSideEffects } from '@fc/custom-lib';
import { initSideEffectsMiddleware, SideEffectMap } from '@fc/state-management';

const sideEffectsMap: SideEffectMap = {
  // This is where you will spread used side-effects from libraries
  ...customLibSideEffects,
};

// This will return you a unique middleware injectable in your store provider (see application.tsx)
export const sideEffectsMiddleware = initSideEffectsMiddleware(sideEffectsMap);
```

`<app>/src/store/reducers.ts`

```typescript
/* istanbul ignore file */

// declarative file
import { ReducersMapObject } from 'redux';

import { customLibReducers } from '@fc/custom-lib';

export const reducersMap: ReducersMapObject = {
  // This is where you will spread used reducers from libraries
  ...customLibReducers,
};
```

`<app>/src/store/states.ts`

```typescript
/* istanbul ignore file */

// declarative file
import { CustomLibState } from '@fc/custom-lib';

/**
 * This one should not be typed as his type will be inferred (see application.tsx) from the composition
 * of spread states (each unique state is typed by his library)
 */
export const statesMap = {
  // This is where you will spread used states from libraries
  ...CustomLibState,
};
```

2. You are now ready to implement your store provider in the application.

`<app>/src/ui/application.tsx`

```tsx
import './application.scss';

import React from 'react';

import { AppContextProvider, StoreProvider } from '@fc/state-management';

import { AppConfig } from '../config';
import { reducers, sideEffectsMiddleware, states } from '../store';

export function Application(): JSX.Element {
  return (
    <React.StrictMode>
      <AppContextProvider value={{ config: AppConfig }}>
        <!--
          - The store provider should be instantiated after the AppContextProvider
            to have access to the configuration.
          - The store provider is typed with the composed state of the application
            (see up ./store/states.ts).
          - Do not forget that you need to provide a middlewares array to the
            store provider nonetheless.
        -->
        <StoreProvider<typeof states>
          debugMode={process.env.NODE_ENV !== 'production'}
          middlewares={[sideEffectsMiddleware]}
          persistKey={AppConfig.persistKey}
          reducers={reducersMap}
          states={statesMap}>
        </StoreProvider>
      </AppContextProvider>
    </React.StrictMode>
  );
}
```
