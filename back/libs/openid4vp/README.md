# @fc/openid4vp

NestJS library that implements the **verifier** side of [OpenID for Verifiable Presentations (OpenID4VP)](https://openid.net/specs/openid-4-verifiable-presentations-1_0.html) for FranceConnect.

It wraps [@openid4vc/openid4vp](https://github.com/openwallet-foundation-labs/oid4vc-ts) and [@openid4vc/oauth2](https://github.com/openwallet-foundation-labs/oid4vc-ts) with FC configuration, Redis-backed interactions, session binding, and mdoc decoding via `@fc/mdoc`.

## Scope

In scope:

- Creating an authorization interaction (`state`, `nonce`, `interactionId`).
- Building and signing a JAR (JWT Authorization Request) request object, with the
  attribute query expressed as `dcql_query` (DCQL — OpenID4VP 1.0 / HAIP).
- Exposing the `openid4vp://` authorization URI and `request_uri` for the wallet.
- Parsing the wallet authorization response (`direct_post` / `direct_post.jwt` + JARM),
  including the DCQL `vp_token` object keyed by credential id.
- Decoding `vp_token` mdoc payloads into `@fc/mdoc` documents.
- Persisting interactions in Redis and binding interaction IDs to the browser session.

Out of scope (handled elsewhere or not implemented yet):

- Wallet-side behaviour (holder, issuer).
- Full mdoc cryptographic verification (IACA, `deviceAuth`, value digests) — see `@fc/mdoc`.
- `x509_san_dns` client identification — planned (#2622 / FC-2636).
- JAR/JARM encryption (`encryptJwe` rejects; encrypted-only JARM responses skip `verifyJwt`).
- Redis serialization/encryption of interaction payloads (#2630).

## Architecture

```text
Openid4vpService (facade)
├── Openid4vpRequestService   → JAR, authorization URI, dcql_query
├── Openid4vpSessionService   → Redis + @fc/session
├── Openid4vpResponseService  → parse wallet response, decode vp_token
└── Openid4vpCryptoService    → signJwt / verifyJwt / decryptJwe callbacks
```

### Interaction lifecycle

```text
1. Create an interaction                  → interactionId
2. Build one authorization URI per flow   → openid4vp://… (QR code / same-device link)
3. Wallet fetches the request object      → signed JAR, flow resolved and persisted
4. Wallet posts its response              → mdoc documents decoded
5. Save the PID, or the error             → terminal status in Redis
```

The flow (same-device / cross-device) is resolved once, at step 3, from the
`:state` segment of the request URI. It is never read from the response body:
a JARM wallet (`direct_post.jwt`) only posts `response=`, its `state` travels
inside the encrypted JWT.

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

The reference implementation of the lifecycle above is `apps/wallet-bridge`:
`OpenId4vpUiController` (interaction and request URIs) and
`OpenId4vpApiController` (request object and wallet response).

## Configuration

Register an `Openid4vp` section in the instance config and validate it with `Openid4vpConfig`.

| Key                                         | Description                                                                                            |
| ------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| `relayingParty.clientId`                    | Verifier client identifier — required as a URL unless `clientIdScheme` is one of the `x509_*` schemes (`client_id` then derives from the certificate) |
| `relayingParty.clientIdScheme`              | See `Openid4vpClientIdSchemeEnum` for the accepted values — see also the note below                   |
| `relayingParty.responseUri`                 | Wallet POST endpoint (`direct_post` / JARM)                                                            |
| `relayingParty.redirectUri`                 | Browser redirect after success                                                                         |
| `relayingParty.requestUri`                  | JAR fetch URL (`:interactionId` and `:state` placeholders)                                             |
| `relayingParty.nonceLength` / `stateLength` | Entropy length for `nonce` / `state`                                                                   |
| `relayingParty.interactionTtl`              | Redis TTL (seconds) for interactions                                                                   |
| `relayingParty.responseDelay`               | TTL after JAR is read (seconds)                                                                        |
| `relayingParty.redirectDelay`               | Delay (seconds) between the success message display and the browser redirection                        |
| `relayingParty.clientMetadata`              | VP formats, JARM encryption hints, `jwks` in request                                                   |
| `jwks`                                      | Verifier keys (`sig` for JAR when using `redirect_uri`, `enc` for JARM decryption)                     |
| `x509.certificateChainPem`                  | Leaf + intermediate X.509 certificates (required for `x509_hash` / `x509_san_dns`)                     |
| `x509.privateKeyPem`                        | Private key matching the leaf certificate                                                              |
| `requests[]`                                | Attribute queries keyed by `credentialQueryId`, one per `credentialQueryId`                            |
| `requests[].credentialQueryId`              | Must match the DCQL credential query charset `[a-zA-Z0-9_-]+` (no dot), enforced at boot               |
| `requests[].inputFieldRequiredPaths`        | Must be `$['namespace']['claim']`, the only shape convertible to an mdoc DCQL claims path pointer      |
| `requests[].inputFieldOptionalPaths`        | Same shape; claims the wallet may leave out                                                            |

Environment variables (wallet-bridge): see the generated [`back/_doc/env-vars.md`](../../_doc/env-vars.md), `Openid4vp_*` prefix.

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

## Remaining gaps against OpenID4VP 1.0 / HAIP

The attribute query is aligned on 1.0, the rest of the Request Object is still
shaped like the draft versions. A strict HAIP wallet is expected to reject the
request for these reasons, independently of DCQL:

| Emitted today                                    | Expected by 1.0 / HAIP                                                    |
| ------------------------------------------------ | ------------------------------------------------------------------------- |
| standalone `client_id_scheme` parameter          | removed in 1.0: the scheme is a Client Identifier Prefix inside `client_id`|
| `x509_san_uri`                                   | removed in 1.0; HAIP §5 mandates `x509_hash` for signed requests          |
| `authorization_encrypted_response_alg` / `_enc`  | `encrypted_response_enc_values_supported`, listing `A128GCM` and `A256GCM`|
| no `trusted_authorities`                         | HAIP §5: the `aki` Trusted Authorities Query MUST be supported            |

Combined with `client_metadata.vp_formats_supported` (already emitted with its
1.0 name), the standalone `client_id_scheme` makes the Request Object match no
single spec version: wallets built on `@openid4vc/openid4vp` reject it.

Closing these gaps is required before the verifier can be used with a strict
1.0 / HAIP wallet, such as France Identité or the Commission reference wallet.

## Dependencies

- `@fc/config`, `@fc/cryptography`, `@fc/jwt`, `@fc/redis`, `@fc/session`
- `@fc/dcql` (`dcql_query` construction and parsing)
- `@fc/mdoc` (vp_token decoding)
- `@openid4vc/openid4vp`, `@openid4vc/oauth2`

## References

- [OpenID4VP 1.0](https://openid.net/specs/openid-4-verifiable-presentations-1_0.html)
- [OpenWallet Foundation oid4vc-ts](https://github.com/openwallet-foundation-labs/oid4vc-ts)
- [`@fc/mdoc`](../mdoc/README.md) — mdoc decoding and verification
- [`@fc/dcql`](../dcql/README.md) — DCQL query construction and parsing
- [`@fc/eudi`](../eudi/README.md) — EUDI PID types and presentation IDs
- Error codes: [`back/_doc/erreurs.md`](../../_doc/erreurs.md) (`@fc/openid4vp`, scope 86)
