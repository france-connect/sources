# @fc/openid4vp

NestJS library that implements the **verifier** side of [OpenID for Verifiable Presentations (OpenID4VP)](https://openid.net/specs/openid-4-verifiable-presentations-1_0.html) for FranceConnect.

It wraps [@openid4vc/openid4vp](https://github.com/openwallet-foundation-labs/oid4vc-ts) and [@openid4vc/oauth2](https://github.com/openwallet-foundation-labs/oid4vc-ts) with FC configuration, Redis-backed interactions, session binding, and mdoc decoding via `@fc/mdoc`.

## Scope

In scope:

- Creating an authorization interaction (`state`, `nonce`, `interactionId`).
- Building and signing a JAR (JWT Authorization Request) request object.
- Exposing the `openid4vp://` authorization URI and `request_uri` for the wallet.
- Parsing the wallet authorization response (`direct_post` / `direct_post.jwt` + JARM).
- Decoding `vp_token` mdoc payloads into `@fc/mdoc` documents.
- Persisting interactions in Redis and binding interaction IDs to the browser session.

Out of scope (handled elsewhere or not implemented yet):

- Wallet-side behaviour (holder, issuer).
- Full mdoc cryptographic verification (IACA, `deviceAuth`, value digests) — see `@fc/mdoc`.
- `x509_san_dns` client identification — planned (#2622 / FC-2636).
- `x509_hash` client identification — JAR signed with `x5c` and `client_id` derived from the leaf certificate hash.
- JAR/JARM encryption (`encryptJwe` rejects; encrypted-only JARM responses skip `verifyJwt`).
- Redis serialization/encryption of interaction payloads (#2630).

## Architecture

```text
Openid4vpService (facade)
├── Openid4vpRequestService   → JAR, authorization URI, presentation definition
├── Openid4vpSessionService   → Redis + @fc/session
├── Openid4vpResponseService  → parse wallet response, decode vp_token
└── Openid4vpCryptoService    → signJwt / verifyJwt / decryptJwe callbacks
```

### Interaction lifecycle

```text
1. createAuthorizationRequest(requestConfig) → interactionId
2. getAuthorizeRequestUri(interaction)       → openid4vp://… URL for QR
3. getRequestObject(interaction)             → signed JAR (wallet fetches request_uri)
4. setAuthorizationRequestObjectAsRead()     → state mapping + TTL adjustment
5. parseResponse(body, interaction)          → MdocDocumentInterface[]
6. saveResponse(interaction, documents)      → persist PID in Redis
   saveError(interaction, error, errorDescription) → persist failure in Redis
```

Interaction status values: `REQUEST_URI_PROVIDED` → `REQUEST_OBJECT_PROVIDED` → `RESPONSE_RECEIVED` | `ERROR`.

`Openid4vpInteractionStatus` values are **explicit and ordered by progression**: consumers arbitrate concurrent status sources by numeric comparison (the wallet-bridge SSE stream keeps the highest value via `Math.max`), so terminal statuses must keep the highest values. Do not insert a status in the middle of the enum without reviewing those consumers.

`RESPONSE_RECEIVED` and `ERROR` are terminal states: both delete the `state` Redis key (the wallet cannot replay the response) and publish the new status on the Redis pub/sub channel. `saveError` additionally persists the OAuth2 `error` / `errorDescription` on the interaction, keeping the failure cause available for debugging or later use.

## Public API

Import `Openid4vpModule` and inject `Openid4vpService` only.

```typescript
import { Module } from '@nestjs/common';

import { Openid4vpModule } from '@fc/openid4vp';

@Module({
  imports: [Openid4vpModule],
})
export class WalletBridgeModule {}
```

```typescript
import { Injectable } from '@nestjs/common';

import { Openid4vpService, Openid4vpRequestConfig } from '@fc/openid4vp';

@Injectable()
export class MyVerifierService {
  constructor(private readonly openid4vp: Openid4vpService) {}

  async startPresentation(request: Openid4vpRequestConfig) {
    const interactionId =
      await this.openid4vp.createAuthorizationRequest(request);
    const interaction =
      await this.openid4vp.getUserInteractionById(interactionId);
    const requestUri = this.openid4vp.getAuthorizeRequestUri(interaction);
    return { interactionId, requestUri };
  }

  async handleWalletResponse(body: Record<string, unknown>, state: string) {
    const interaction = await this.openid4vp.getInteractionByState(state);
    return this.openid4vp.parseResponse(body, interaction);
  }
}
```

## Configuration

Register an `Openid4vp` section in the instance config and validate it with `Openid4vpConfig`.

| Key                                         | Description                                                                        |
| ------------------------------------------- | ---------------------------------------------------------------------------------- |
| `relayingParty.clientId`                    | Verifier client identifier                                                         |
| `relayingParty.clientIdScheme`              | `redirect_uri`, `x509_hash`, or `x509_san_dns` (enum)                              |
| `relayingParty.responseUri`                 | Wallet POST endpoint (`direct_post` / JARM)                                        |
| `relayingParty.redirectUri`                 | Browser redirect after success                                                     |
| `relayingParty.requestUri`                  | JAR fetch URL (`:interactionId` placeholder)                                       |
| `relayingParty.nonceLength` / `stateLength` | Entropy length for `nonce` / `state`                                               |
| `relayingParty.interactionTtl`              | Redis TTL (seconds) for interactions                                               |
| `relayingParty.responseDelay`               | TTL after JAR is read (seconds)                                                    |
| `relayingParty.redirectDelay`               | Delay (seconds) between the success message display and the browser redirection    |
| `relayingParty.clientMetadata`              | VP formats, JARM encryption hints, `jwks` in request                               |
| `jwks`                                      | Verifier keys (`sig` for JAR when using `redirect_uri`, `enc` for JARM decryption) |
| `x509.certificateChainPem`                  | Leaf + intermediate X.509 certificates (required for `x509_hash` / `x509_san_dns`) |
| `x509.privateKeyPem`                        | Private key matching the leaf certificate                                          |
| `requests[]`                                | Presentation definitions keyed by `presentationId`                                 |

Environment variables (wallet-bridge): `Openid4vp_CLIENT_ID`, `Openid4vp_CLIENT_ID_SCHEME`, `Openid4vp_JWKS`, `Openid4vp_X509_CERTIFICATE_CHAIN`, `Openid4vp_X509_PRIVATE_KEY`. See [`back/_doc/env-vars.md`](../../_doc/env-vars.md).

Example (wallet-bridge instance): [`back/instances/wallet-bridge/src/config/openid4vp.ts`](../../instances/wallet-bridge/src/config/openid4vp.ts).

## Session

`Openid4vpSessionService.bindRequestToSession` stores interaction IDs in the app session under `Openid4vp.interactions`.

Use `getUserInteractionById` in UI controllers to ensure the browser session owns the interaction. API endpoints keyed by `state` do not require session binding.

Nest the DTO in the app session schema:

```typescript
import { Openid4vpSessionDto } from '@fc/openid4vp';

export class WalletBridgeSession {
  @ValidateNested()
  @Type(() => Openid4vpSessionDto)
  readonly Openid4vp: Openid4vpSessionDto;
}
```

## Crypto callbacks

`Openid4vpCryptoService` implements `@openid4vc` callbacks:

| Callback     | Phase                          | Purpose                                             |
| ------------ | ------------------------------ | --------------------------------------------------- |
| `signJwt`    | Request (`requestCallbacks`)   | Sign JAR with verifier `sig` JWK or X.509 `x5c` key |
| `encryptJwe` | Request                        | Not configured (throws)                             |
| `decryptJwe` | Response (`responseCallbacks`) | Decrypt JARM JWE with verifier `enc` key            |
| `verifyJwt`  | Response                       | Verify wallet-signed JARM JWT                       |

`verifyJwt` is only invoked when the wallet returns a **signed** JARM payload (compact JWT with 3 segments). Encrypted-only responses (`authorization_encrypted_response_*` in client metadata) call `decryptJwe` but skip `verifyJwt`.

## Real-time status (Redis pub/sub)

`Openid4vpSessionService` publishes interaction status changes to a Redis channel (`STATUS_CHANNEL`) and exposes an RxJS `Observable` stream via `subscribeToInteractionStatus`.

### Design decisions

**Dedicated subscriber connection (`initStatusSubscriber`)**

Redis does not allow regular commands on a connection that is in pub/sub mode. `statusSubscriber` is a duplicate of the shared `RedisService` client, reserved exclusively for `SUBSCRIBE`. It is created lazily on the first call to `subscribeToInteractionStatus` and torn down in `onModuleDestroy`.

**Error handling on the subscriber**

ioredis reconnects automatically on transient failures (network loss, server restart). Errors are logged but never forwarded to `status$`: emitting an error on the shared `Subject` would complete every active stream and require all callers to re-subscribe after each failure.

**Message handler safety**

The `'message'` event handler catches all JSON parse errors and logs them without rethrowing. A thrown exception inside a Node.js EventEmitter `'message'` handler propagates as an uncaught exception and would crash the process.

**Publish is best-effort**

`publishStatus` catches Redis publish errors and logs them without rethrowing. The interaction status is already persisted in Redis before `publishStatus` is called; a publish failure does not corrupt state, it only means connected SSE clients may not receive the event in real time.

## Dependencies

- `@fc/config`, `@fc/cryptography`, `@fc/jwt`, `@fc/redis`, `@fc/session`
- `@fc/mdoc` (vp_token decoding)
- `@openid4vc/openid4vp`, `@openid4vc/oauth2`

## References

- [OpenID4VP 1.0](https://openid.net/specs/openid-4-verifiable-presentations-1_0.html)
- [OpenWallet Foundation oid4vc-ts](https://github.com/openwallet-foundation-labs/oid4vc-ts)
- [`@fc/mdoc`](../mdoc/README.md) — mdoc decoding and verification
- [`@fc/eudi`](../eudi/README.md) — EUDI PID types and presentation IDs
- Error codes: [`back/_doc/erreurs.md`](../../_doc/erreurs.md) (`@fc/openid4vp`, scope 86)
