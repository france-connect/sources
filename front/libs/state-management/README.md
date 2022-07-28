# State management with react-redux

## Usage

### Step by step library implementation example

💡 We will cover a fictive "Counter" library.

1. The first step is to create the state interface for your library. It should be exported from the library to be used by the application when necessary.

`./interfaces/counter-state.interface.ts`

```typescript
/* istanbul ignore file */

// declarative file
export interface CounterState {
  name: string;
  value: number;
}
```

2. In the library src root, you will need to create a `store` directory as:

`./store/index.ts`

```typescript
/* istanbul ignore file */

// declarative file
export * from './actions';
export * from './reducers';
export * from './side-effects';
export * from './state';
```

3. Then, you need to configure your state.

`./store/state`

```typescript
/* istanbul ignore file */

// declarative file
import { GlobalState } from '@fc/state-management';

import { CounterState } from './interfaces';

// Your state configuration MUST use the GlobalState interface
export const state: GlobalState<CounterState> = {
  /**
   * To be composed later (see application implementation) you need to scope
   * your state with the library name.
   */
  Counter: {
    blacklist: true,
    /**
     * Be sure to define each last level key / array so that your library is ready
     * at start without unwanted crash.
     */
    defaultValue: {
      name: 'Final Countdown 🎵',
      value: 10,
    },
  },
};
```

4. Actions types will be defined in an enum and exposed by the library so that the application can "react" to it (you got it 🤣 ?).

`./enums/action-types.enum.ts`

```typescript
/* istanbul ignore file */

// declarative file
export enum ActionTypes {
  COUNTER_DECREMENTED = 'COUNTER_DECREMENTED',
  COUNTER_INCREMENTED = 'COUNTER_INCREMENTED',
}
```

5. Here comes the reducers.

`./store/reducers.ts`

```typescript
import { FSA } from '@fc/state-management';

import { ActionTypes } from '../enums';
import { CounterState } from './interfaces';

/**
 * Here we limit the modifications to the library state only, but be wary
 * that the global state is sent as first parameter ⚠️ ⚠️ ⚠️.
 */

const decrement = ({ Counter }: { Counter: CounterState }, action: FSA) => {
  // ⚠️ This is an example, the state parameter should not be muted !
  state.value -= 1;

  // return here the new state
  return state;
};

// Another one reducer [bite the dust]
const increment = ({ Counter }: { Counter: CounterState }, action: FSA) => {
  state.value += 1;

  return state;
};

// Reducers MUST be exported mapped by corresponding action type to be called later
export const reducers = {
  [ActionTypes.COUNTER_DECREMENTED]: decrement,
  [ActionTypes.COUNTER_INCREMENTED]: increment,
};
```

6. You have everything to create your actions.

`./store/actions.enum.ts`

```typescript
import { FSA } from '@fc/state-management';

import { ActionTypes } from './types';

export function counterDecremented(payload: number): FSA {
  return {
    type: ActionTypes.COUNTER_DECREMENTED,
    payload,
  };
}

export function counterIncremented(payload: number): FSA {
  return {
    type: ActionTypes.COUNTER_INCREMENTED,
    payload,
  };
}
```

7. Finally, you link action types with actions to dispatch using side effects

```typescript
import { FSA, SideEffectMap } from '@fc/state-management';

import { ActionTypes } from '../enums';
import { increment } from './actions';

const decrementSideEffect = (action: FSA, dispatch, state: GlobalState, next) => {
  const { decrementLevel } = await axios.get('/counter-decrement-level');

  dispatch(counterDecremented({ decrementLevel }));

  return next(action);
};

const incrementSideEffect = (action: FSA, dispatch, state: GlobalState, next) => {
  const { incrementLevel } = await axios.get('/counter-increment-level');

  dispatch(counterIncremented({ decrementLevel }));

  return next(action);
};

// sideEffects MUST be exported mapped by corresponding action type to be called later
export const sideEffects: SideEffectMap = {
  [ActionTypes.COUNTER_DECREMENTED]: decrementSideEffect,
  [ActionTypes.COUNTER_INCREMENTED]: incrementSideEffect,
};
```

### Step by step application implementation example

⚠️ From this step you already have a library that exposes required elements. If not, see previous section.

0. Install react-redux in the application if not already done.

1. In the application src root, you will need to create a `store` directory as:

`./store/index.ts`

```typescript
/* istanbul ignore file */

// declarative file
export * from './middlewares';
export * from './reducers';
export * from './states';
```

`./store/middlewares.ts`

```typescript
/* istanbul ignore file */

// declarative file
import { initSideEffectsMiddleware, SideEffectMap } from '@fc/state-management';

const sideEffectsMap: SideEffectMap = {
  // This is where you will spread used side-effects from libraries
};

// This will return you a unique middleware injectable in your store provider (see application.tsx)
export const sideEffectsMiddleware = initSideEffectsMiddleware(sideEffectsMap);
```

`./store/reducers.ts`

```typescript
/* istanbul ignore file */

// declarative file
import { ReducersMap } from '@fc/state-management';

export const reducersMap: ReducersMap = {
  // This is where you will spread used reducers from libraries
};
```

`./store/states.ts`

```typescript
/* istanbul ignore file */

// declarative file

/**
 * This one should not be typed as his type will be inferred (see application.tsx) from the composition
 * of spread states (each unique state is typed by his library)
 */
export const statesMap = {
  // This is where you will spread used states from libraries
};
```

2. You are now ready to implement your store provider in the application.

`./application.tsx`

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
          debugMode
          middlewares={[sideEffectsMiddleware]}
          persistKey={AppConfig.persistKey}
          reducers={reducers}
          states={states}>
        </StoreProvider>
      </AppContextProvider>
    </React.StrictMode>
  );
}
```
