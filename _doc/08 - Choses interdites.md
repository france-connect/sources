### Imbrication de ternaires

L'imbrication de ternaires n'est pas autorisée.

```typescript
/**
 * 😍 Cool 😍
 */

const isActive = accountState === "active" ? true : false;

const isAdmin = isActive && grade === "admin" ? true : false;

const message = isErrorCodeValid(errorCode)
  ? getUserMessage(errorCode)
  : getDefaultUserMessage();
```

```typescript
/**
 * 😱 Pas cool 😱
 */

const isAdmin =
  accountState === "active" ? (grade === "admin" ? true : false) : false;
```
