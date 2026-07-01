# @fc/eudi

Shared TypeScript types for the [European Digital Identity (EUDI) Wallet](https://eudi.dev/) ecosystem.

This library holds enums, interfaces, and related constants aligned with EUDI rulebooks and attestation profiles. It gives wallet-bridge and other FC services a single, stable import path for EUDI-shaped data without coupling them to a specific credential format (mdoc, SD-JWT, etc.), neither coupling @fc/openid4vp with EUDI specific considerations.

## Contents

- **Enums** — document types (`EudiDocTypes`), presentation identifiers (`EudiPresentationId`), PID attributes such as gender (`EudiGenders`).
- **Interfaces** — typed claim shapes for EUDI credentials, e.g. the PID profile (`EudiPidInterface`).

## Usage

```typescript
import { EudiDocTypes, EudiPidInterface, EudiPresentationId } from '@fc/eudi';
```

## References

- [EUDI Wallet Architecture and Reference Framework](https://eudi.dev/)
- [EUDI PID rulebook](https://github.com/eu-digital-identity-wallet/eudi-doc-attestation-rulebooks-catalog/blob/main/rulebooks/pid/pid-rulebook.md)
