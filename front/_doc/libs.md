## How to declare a new shared lib

**A new library should contain a `tsconfig.json` file**

```
{
  "extends": "../../tsconfig.json",
  "include": ["src"]
}
```

#### Libraries

> Modules declarations are arranged in alphabetical order

**Add declaration to `moduleNameMapper` into `jest.config.js`**

```
'^@fc/ma-librairie(|/.*)$': '<rootDir>/libs/ma-librairie/src/$1',
```

**Add declaration to `paths` into `tsconfig.app.json`**

```
"^@fc/ma-librairie(|/.*)$": ["../../libs/ma-librairie/src/*"],
```
