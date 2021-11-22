### Désactiver une règle de lint

La désactivation exceptionelle des règles de lint se fait élément par élément et règle par règle. Le commentaire est toujours précédé d'un commentaire de justification.

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
 * 😱 Pas cool 😱
 */

/* eslint-disable @typescript-eslint/naming-convention */

const { given_name, family_name } = userinfos;

/* ... */

/* eslint-disable */
const { given_name, family_name } = userinfos;
/* eslint-enable */
```
