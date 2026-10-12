# @fc/dcql

Wrapper around the OpenWallet Foundation Digital Credentials Query Language
implementation [`dcql`](https://github.com/openwallet-foundation-labs/dcql-ts)
(npm `dcql`). It exposes a small NestJS façade and stable FC types so callers
do not depend on OWF classes or on how valibot schemas evolve inside `dcql`.

## Scope

1. Build a `mso_mdoc` `dcql_query` from an OpenID4VP request config entry
   (see `BuildMdocDcqlQueryInput`).
2. Parse and validate an incoming `dcql_query` with `DcqlQuery.parse` /
   `DcqlQuery.validate`.
3. Extract claim names for the mock-wallet consent screen.

Out of scope:

- Matching credentials (`DcqlQuery.query`) and validating presentations
  (`DcqlPresentationResult`).
- SD-JWT VC / W3C VC query construction (mdoc only).
- Receiving / unwrapping a DCQL `vp_token` (handled in `@fc/openid4vp`).
- Multiple credential queries: a built query always asks for a single
  credential.
- Advanced constraints of a _received_ query. `parse()` only returns the fields
  FC uses (see `DcqlQueryInterface`); anything else the npm library validated is
  dropped, so a caller behaves as if those constraints were absent.

## Public API

Import `DcqlModule`, then inject `DcqlService` or use `@IsDcqlQuery()`. Do not
import `dcql` from `wallet-bridge`, `@fc/openid4vp` or `mock-wallet`.

```typescript
import { Module } from '@nestjs/common';

import { DcqlModule } from '@fc/dcql';

@Module({
  imports: [DcqlModule],
})
export class Openid4vpModule {}
```

```typescript
import { Injectable } from '@nestjs/common';

import { DcqlService } from '@fc/dcql';

@Injectable()
export class Openid4vpRequestService {
  constructor(private readonly dcql: DcqlService) {}

  buildQuery() {
    return this.dcql.buildMdocQuery(/* … */);
  }
}
```

See `BuildMdocDcqlQueryInput` for the exact input shape — it evolves faster
than this README, `dcql.service.spec.ts` has live examples.

`buildMdocQuery()` converts each JSONPath `$['namespace']['claim']` into a
DCQL claims path pointer `["namespace", "claim"]`, then parse/validates the
result. The credential query `id` must match the DCQL charset
(alphanumerics, `_`, `-` — no dots); `Openid4vpRequestConfig` enforces it at
boot so a misconfiguration does not surface on a user request.

A built query never points twice at the same claim (§6.1), which the npm
library does not check.

`parse()` accepts an unknown JSON payload (typically the `dcql_query` field
of a Request Object) and returns the same FC interfaces. The payload is not
pre-validated by `@fc/dcql` itself: `DcqlQuery.parse()` / `.validate()` do the
actual runtime validation and throw on any invalid shape, which `parse()`
catches and rethrows as `DcqlInvalidQueryException`.

`extractClaimNames()` lists the claims a query asks for (used by the
mock-wallet consent screen).

The `@IsDcqlQuery()` class-validator decorator applies the same validation as
`parse()` to a DTO property. It requires `DcqlModule` to be imported by the
module that validates the DTO.

## Dependencies

Runtime: `dcql` (pinned in the root `fc` workspace `package.json`).

The library `tsconfig` sets `skipLibCheck` so transitive valibot typings from
`dcql` do not break the Nest/TypeScript toolchain.

Jest maps the ESM-only npm `dcql` package to `libs/dcql/.mocks` (same folder
name as `@openid4vc/openid4vp`'s own npm mock, `libs/openid4vp/.mocks`; `@owf/mdoc`
uses `libs/mdoc/mocks/lib` instead — both folder names coexist in the monorepo
for this kind of raw npm package substitute). This mapping is global
(`moduleNameMapper['^dcql$']` in `jest.config.ts`), so any `import { DcqlQuery }
from 'dcql'` resolves to the mock automatically: `dcql.service.spec.ts` does not
need its own `jest.mock('dcql')` and instead imports the same mock directly from
`@mocks/dcql` to configure `DcqlQuery.parse` / `.validate`.

## References

- [OpenID4VP 1.0 — §6 DCQL](https://openid.net/specs/openid-4-verifiable-presentations-1_0.html#name-digital-credentials-query-l)
- [OWF dcql-ts](https://github.com/openwallet-foundation-labs/dcql-ts)
- [npm dcql](https://www.npmjs.com/package/dcql)
