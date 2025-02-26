# OverrideCode

A small TypeScript/JavaScript library that allows you to **wrap and override** existing functions or methods—_even when they are imported by destructuring_ in other libraries. This is particularly helpful if you need to replace the original implementation with custom logic in your application code, or during testing/mocking scenarios.

> **Important**  
> For overrides to work properly, you **must** load your override code **before** any other imports that might use the function(s) you want to override. If not, libraries may import (by destructuring) a reference to a function you want to override _before_ the override is performed, rendering your override ineffective.

---

## Table of Contents

- [Quick Start](#quick-start)
- [Usage](#usage)
  - [Wrap a function](#wrap-a-function)
  - [Override a function](#override-a-function)
  - [Restore the original function](#restore-the-original-function)
  - [Access the original function from an override](#access-the-original-function-from-an-override)
  - [Execute a callback with the original function](#execute-a-callback-with-the-original-function)
- [Example](#example)

---

## Quick Start

1. **Load** your override code as early as possible—before other imports that might use the function(s) you want to override.
2. **Wrap** the function you want to override.
3. **Override** it with your custom logic.

```typescript
import { OverrideCode } from 'your-override-library';
import * as crypto from 'crypto';

// 1. Wrap the function
OverrideCode.wrap(crypto, 'sign', 'crypto.sign');

// 2. Override the function
OverrideCode.override('crypto.sign', (...args) => {
  console.log('Overridden crypto.sign called with:', ...args);

  // Optionally call the original
  const originalSign = OverrideCode.getOriginal('crypto.sign');
  const result = originalSign(...args);

  return result;
});
```

---

## Usage

### Wrap a function

```typescript
OverrideCode.wrap(originalObject, functionName, key?);
```

- **`originalObject`**: The object containing the function/method you want to wrap (e.g. `JSON`, `crypto`, or a custom object).
- **`functionName`**: The property name of the function in `originalObject`.
- **`key?`**: An optional unique name to store references. If omitted, defaults to `functionName`.

### Override a function

```typescript
OverrideCode.override(key, overrideFunction);
```

- **`key`**: The name you used when wrapping.
- **`overrideFunction`**: The custom function to use instead of the original.

### Restore the original function

```typescript
OverrideCode.restore(originalObject, functionName, key?);
```

- **`originalObject`**: The object containing the wrapped function.
- **`functionName`**: The property name of the function to restore.
- **`key?`**: If omitted, defaults to the `functionName` used in `wrap`.

### Access the original function from an override

You can retrieve the original function from `OverrideCode.getOriginal(key)`:

```typescript
const overrideFunction = (...args) => {
  const originalFunc = OverrideCode.getOriginal('myKey');
  const originalResult = originalFunc(...args);
  return `Custom logic with ${originalResult}`;
};
```

### Execute a callback with the original function

If you need to temporarily revert to the original function, run some code, and then restore the override:

```typescript
OverrideCode.execWithOriginal(originalObject, functionName, key, () => {
  // Within this callback, originalObject[functionName] is the original
});
```

And the asynchronous version:

```typescript
await OverrideCode.execWithOriginalAsync(
  originalObject,
  functionName,
  key,
  async () => {
    // Async code with the original function
  },
);
```

---

## Example

Here’s how you might override `JSON.parse`. The key part is to ensure these lines run **before** other files that might call `JSON.parse`:

```typescript
import { overriddenBySafelyParseJson, OverrideCode } from './my-override-lib';

OverrideCode.wrap(JSON, 'parse', 'JSON.parse');
OverrideCode.override('JSON.parse', overriddenBySafelyParseJson);
```

Any subsequent code that calls `JSON.parse` will use the overridden version.
