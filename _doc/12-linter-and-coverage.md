### Disabling an eslint rule

Disabling an eslint rule MUST remains exceptional and MUST always be done one rule at a time. The "disable" comment MUST always be preceded by a justification which explains why the rule SHOULD be disabled in this particular context.

```typescript
/**
 * 😍 Cool 😍
 */

const {
  // oidc spec defined property
  // eslint-disable-next-line @typescript-eslint/naming-convention
  given_name,
  // oidc spec defined property
  // eslint-disable-next-line @typescript-eslint/naming-convention
  family_name,
} = userinfos;
```

```typescript
/**
 * 😱 Not cool 😱
 */

/* eslint-disable @typescript-eslint/naming-convention */

const { given_name, family_name } = userinfos;

/* ... */

/* eslint-disable */
const { given_name, family_name } = userinfos;
/* eslint-enable */
```
