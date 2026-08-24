# @fc/mdoc

Wrapper around the OpenWallet Foundation ISO 18013-5 implementation
[`@owf/mdoc`](https://github.com/openwallet-foundation-labs/mdoc-ts) (mdoc-ts).
It exposes a small NestJS façade and stable FC types so callers do not depend
on OWF classes or on how encoding/zod evolves inside `@owf/mdoc`.

## Scope

Decoding paths use `@owf/mdoc` parsers (`DeviceResponse.decode`,
`DeviceResponse.fromEncodedForOid4Vp`, `IssuerSigned.decode`, …) and map the
result into plain interfaces under `@fc/mdoc`:

1. OID4VP / CBOR payloads for `DeviceResponse` and `IssuerSigned`.
2. MSO fields (`valueDigests`, `validityInfo`, `digestAlgorithm`, …).
3. X.509 material from `IssuerAuth` (`x5chain` / certificate chain).
4. COSE `alg` on `DeviceSignature` / `DeviceMac` (numeric, per IANA COSE).
5. Structural validity window checks (`validityInfo`) and issuer signature
   algorithm whitelist (`ES256` / `ES384` / `ES512`) without an `MdocContext`.

Out of scope (requires `MdocContext`, trust store, session transcript, etc.):

- `IssuerAuth.verify` / chain validation to IACA.
- `DeviceAuth.verify` (device signature or MAC over `SessionTranscript`).
- Cryptographic digest checks for disclosed attributes vs MSO.
- SD-JWT VC (separate stack).

### Mock issuance (dev fixtures)

`buildMdocVpToken()` (and `MdocService.buildMdocVpToken()`) build a base64url mdoc `vp_token` using `@owf/mdoc` (`DeviceResponse.encodedForOid4Vp`, the wire form used in OpenID4VP). Issuer and device signatures are generated from the supplied configuration and OpenID4VP session parameters (`clientId`, `nonce`, `responseUri`).

Use `Verifier.verifyDeviceResponse` from `@owf/mdoc` in the wallet-bridge
Verifier when you can provide `MdocContext` and verification options.

## Configuration

Register a `Mdoc` section in the instance config and validate it with `MdocConfig`.

| Key                       | Description                                              |
| ------------------------- | -------------------------------------------------------- |
| `docType`                 | mdoc doctype presented in the `vp_token`                 |
| `issuerPrivateKeyPem`     | PEM private key used to sign the issuer namespace        |
| `issuerCertificatePem`    | PEM certificate bundled in the issuer auth               |
| `devicePrivateKeyJwk`     | Device private JWK used to sign device authentication  |
| `deviceCertificatePem`    | PEM certificate bundled in the device signature        |

Environment variables (mock-wallet): `Mdoc_ISSUER_PRIVATE_KEY`, `Mdoc_ISSUER_CERTIFICATE`, `Mdoc_DEVICE_PRIVATE_KEY_JWK`, `Mdoc_DEVICE_CERTIFICATE`. See [`back/_doc/env-vars.md`](../../_doc/env-vars.md).

Example (mock-wallet instance): [`back/instances/mock-wallet/src/config/mdoc.ts`](../../instances/mock-wallet/src/config/mdoc.ts).

## Public API

Import `MdocModule` and inject `MdocService` only.

```typescript
import { Module } from '@nestjs/common';

import { MdocModule } from '@fc/mdoc';

@Module({
  imports: [MdocModule],
})
export class WalletBridgeModule {}
```

```typescript
import { Injectable } from '@nestjs/common';

import { MdocService } from '@fc/mdoc';

@Injectable()
export class VerifierMdocService {
  constructor(private readonly mdoc: MdocService) {}

  parse(vpToken: string) {
    const documents = this.mdoc.decodeDeviceResponse(vpToken);
    for (const document of documents) {
      this.mdoc.verifyValidityInfo(document.issuerSigned.mso.validityInfo);
    }
    return documents;
  }
}
```

## Helpers

### `extractSimpleDocument<DocType>(documents, docType)`

Picks the document matching `docType` from a decoded `DeviceResponse` and
flattens its `issuerSigned.nameSpaces` into a plain claims object grouped by
namespace. Returns a `SimpleDocumentInterface<DocType>` shaped as
`{ docType, claims }`, where `claims` is typed by the generic `DocType`
provided by the caller.

Use it after `MdocService.decodeDeviceResponse` when you only need disclosed
attributes and do not want to walk the OWF `nameSpaces` map yourself. It does
not perform any cryptographic check: combine it with
`MdocService.verifyValidityInfo` (and a full Verifier when available).

```typescript
import { Injectable } from '@nestjs/common';

import { extractSimpleDocument, MdocService } from '@fc/mdoc';

interface MobileDriverLicenseClaims {
  'org.iso.18013.5.1': {
    family_name: string;
    given_name: string;
    birth_date: string;
  };
}

@Injectable()
export class MobileDriverLicenseService {
  constructor(private readonly mdoc: MdocService) {}

  extract(vpToken: string) {
    const documents = this.mdoc.decodeDeviceResponse(vpToken);
    return extractSimpleDocument<MobileDriverLicenseClaims>(
      documents,
      'org.iso.18013.5.1.mDL',
    );
  }
}
```

## Types

- `MdocDocumentInterface`, `MdocIssuerSignedInterface`, `MdocDeviceSignedInterface`,
  `MdocMsoInterface`, `MdocValidityInfoInterface`,
  `MdocIssuerSignedItemInterface`
- `SimpleDocumentInterface<Claims>`: flattened `{ docType, claims }` shape
  produced by `extractSimpleDocument`.
- `MdocClaim`, `MdocClaims`: generic claim record types
  (`Record<string, unknown>` and namespaced variant).
- `MdocAlgorithmsEnum`: ES256 / ES384 / ES512 (whitelist for issuer auth).
- `MdocDigestAlgorithmsEnum`: MSO `digestAlgorithm` string values.
- `MdocDeviceAuthInterface.algorithm`: raw COSE `alg` integer (signature or MAC).

## Dependencies

Runtime: `@owf/mdoc` (pinned in the root `fc` workspace `package.json`).

The library `tsconfig` sets `skipLibCheck` so transitive Zod typings from
`@owf/mdoc` do not break the Nest/TypeScript toolchain.

## References

- [ISO/IEC 18013-5](https://www.iso.org/standard/69084.html)
- [ISO/IEC 18013-7](https://www.iso.org/standard/82772.html)
- [OWF mdoc-ts](https://github.com/openwallet-foundation-labs/mdoc-ts)
