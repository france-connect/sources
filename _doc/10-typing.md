# Typing

## Foreword

TypeScript is used in the project as a mean to enforce structured code and prevent regressions. This language provides a first level of code documentation, which contributes to a better comprehension and maintenance. Here is a list of links to learn TypeScript and some advanced usages:

- [Get started](https://www.typescriptlang.org/docs/)
- [Narrowing](https://www.typescriptlang.org/docs/handbook/2/narrowing.html)
- [Creating Types from Types](https://www.typescriptlang.org/docs/handbook/2/types-from-types.html)

### `any`

**The type `any` is forbidden on the project.** If you do not know which type to apply to your code, you MUST either declare an interface or use the `unknown` type which enforce that next usages will be typed ones. It MUST remains exceptional. Generics and/or composition SHOULD always be preferred when possible.

```typescript
/**
 * 😍 Cool 😍
 */

const response: json | string = await unconsistentApiCall();

interface Metadata {
  [key: string]: unknown;
}

function handleInput(input: unknown): void {
  switch (typeof input) {
    case "number":
      handleNumber(input);
      break;
    case "string":
      handleString(input);
      break;
    case Error:
      handleError(input);
      break;
    default:
      break;
  }
}
```

```typescript
/**
 * 😱 Not cool 😱
 */

// If "inconsistentApiCall" returns either an object or a string, we should type it.
const response: unknown = await inconsistentApiCall();

// Why use TypeScript then ?
interface Metadata {
  [key: string]: any;
}

// As stated earlier, "any" does not enforce the type in the editor when giving the argument to the handling functions. `unknown` does !
function handleInput(input: any): void {
  switch (typeof input) {
    case "number":
      handleNumber(input);
      break;
    case "string":
      handleString(input);
      break;
    case Error:
      handleError(input);
      break;
    default:
      break;
  }
}
```

### `void`

When a function does not return a value, `void` type MUST be used. The `void` type indicates that the value returned by the function MUST not be used.
- 🚩 `void` is different from `undefined`, as the last SHOULD be taken into account when developing.

```typescript
/**
 * 😍 Cool 😍
 */

function logSomething(): void {
  console.log("Hello world !");
}

function getUser(name: string): User | undefined {
  const user = await getUserByName(name);

  if (!user) {
    return;
  }

  console.log(`Found user "${name}" !`);
  return user;
}

function handleBar(bar: string | number | undefined): void {
  if (!bar) {
    return;
  }

  switch (typeof input) {
    case "number":
      handleNumber(input);
      break;
    case "string":
      handleString(input);
      break;
  }
}
```

```typescript
/**
 * 😱 Not cool 😱
 */

function logSomething(): undefined {
  console.log("Hello world !");
}

function getUser(name: string): User | void {
  const user = await getUserByName(name);

  if (!user) {
    return;
  }

  console.log(`Found user "${name}" !`);
  return user;
}
```

### Summing up to level up

TypeScript is a very powerful and versatile language. There is therefor a multitude of ways to typing.

- 🚩 All typing methods are not equals.
- 🚩 Using cherry-picking types and using generics increase code consistency and maintainability.

```typescript
/**
 * 😍 Cool 😍
 */

type Gender = "M" | "F";

interface Identity {
  gender?: Gender;
  lastName: string;
  firstName: string;
  birthdate: Date;
  size: number;
}

type AnonymousIdentity = Pick<Identity, "gender", "birthdate", "size">;

function setIdentityField<IdKey extends keyof Identity>(
  identity: Identity,
  key: IdKey,
  value: Identity[IdKey]
): void {
  identity[key] = value;
}
```

```typescript
/**
 * 😱 Not cool 😱
 */

interface Identity {
  gender?: "M" | "F";
  lastName: string;
  firstName: string;
  birthdate: Date;
  size: number;
}

interface AnonymousIdentity {
  gender?: "M" | "F";
  birthdate: Date;
  size: number;
}

function setIdentityField(
  identity: Identity,
  key: "gender" | "lastName" | "firstName" | "birthdate" | "size",
  value: unknown
): void {
  identity[key] = value;
}
```
