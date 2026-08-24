# Wallet Bridge

NestJS application that bridges the **OpenID4VP** wallet presentation flow with the FranceConnect OIDC provider.

It exposes three sets of routes simultaneously:
- **UI routes** for the browser (QR code page, SSE status stream, final redirect)
- **API routes** for the wallet (JAR request object, VP response endpoint)
- **OIDC endpoints** via `@fc/oidc-provider`

## Architecture

```text
Browser              Wallet Bridge               Mobile wallet
    │                      │                           │
    │  GET /ui/authorize-create-interaction             │
    │─────────────────────▶│                           │
    │                      │                           │
    │  GET /ui/authorize-request-uri/:interactionId     │
    │─────────────────────▶│                           │
    │                      │                           │
    │  SSE /api/authorize-request-status/:interactionId │
    │─────────────────────▶│                           │
    │                      │  GET /api/authorize-request-object/:interactionId
    │                      │◀──────────────────────────│
    │                      │                           │
    │                      │  POST /api/authorize-response
    │                      │◀──────────────────────────│
    │                      │                           │
    │  GET /ui/authorize-redirect/:interactionId        │
    │─────────────────────▶│                           │
    │                      │                           │
    │  GET /interaction/:uid  (via @fc/oidc-provider)   │
    │─────────────────────▶│                           │
```

## Interaction lifecycle

1. `GET /ui/authorize-create-interaction` — `OpenId4vpUiController` creates an interaction via `@fc/openid4vp` and redirects to the QR page.
2. `GET /ui/authorize-request-uri/:interactionId` — renders the QR code containing the `openid4vp://` URI. The browser simultaneously opens an SSE connection on `/api/authorize-request-status/:interactionId`.
3. `GET /api/authorize-request-object/:interactionId` — the wallet downloads the signed JAR; the interaction moves to `REQUEST_OBJECT_PROVIDED`.
4. `POST /api/authorize-response` — the wallet submits its VP response. `OpenId4vpApiController` parses the mdoc documents, extracts and validates the EUDI PID, and persists the response. The interaction moves to `RESPONSE_RECEIVED`.
   - If the wallet notifies an authorization error instead (OAuth2 `error` / `error_description` body, e.g. user abort), or if parsing/PID validation fails, the interaction moves to `ERROR` with the error parameters persisted on it (defaults: `access_denied` / `Authentication failed`).
5. The browser receives the terminal display event via SSE:
   - `RESPONSE_RECEIVED` — a success message is displayed, then the browser is redirected to `/ui/authorize-redirect/:interactionId` after `relayingParty.redirectDelay` seconds.
   - `ERROR` — a failure message is displayed over the QR code; the user cannot go further on this page.
6. `GET /interaction/:uid` — `WalletBridgeIdentityService` finishes the OIDC interaction with the retrieved identity.

## Identity injected into the OIDC provider

`WalletBridgeIdentityService` extends `OidcProviderAppConfigLibService` and overrides `findAccount` / `finishInteraction`. `finishInteraction` generates a backend session id, binds it to the interaction and completes the OIDC interaction (acr `eidas3`). `findAccount` then retrieves the persisted VP response through that binding, extracts the EUDI PID claims and maps them to OIDC claims (`given_name`, `family_name`, `birthdate`, `gender`, `birthplace`, `birthcountry`, `email`). The `sub` is currently the backend session id (business rules to be defined).

## SSE status endpoint (`/api/authorize-request-status/:interactionId`)

[Server-Sent Events (SSE)](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events) is a W3C standard allowing a server to push a stream of events to a browser over a single HTTP connection. Unlike WebSockets, the connection is unidirectional (server → client) and relies on a plain `text/event-stream` response. NestJS expose cette fonctionnalité via le décorateur `@Sse()` et les observables RxJS ([doc NestJS SSE](https://docs.nestjs.com/techniques/server-sent-events)).

The browser receives interaction status changes in real time via `EventSource`.

### Stream construction (`buildStatusStream`)

The stream merges two sources:

1. **Pub/sub events** — Redis channel subscription for the interaction, registered **before** the initial read to avoid a race condition (an event published in between would be lost).
2. **Initial state** — deferred read of the current persisted status from Redis.

`scan((latest, status) => Math.max(latest, status))` ensures statuses only advance: a pub/sub event received before the initial read is discarded if the Redis status is already ahead.

### RxJS operators

| Operator | Purpose |
|---|---|
| `distinctUntilChanged()` | Deduplicates consecutive identical statuses |
| `takeWhile((status) => !isTerminal(status), true)` | Closes the stream on a terminal status — _inclusive_: the terminal event is emitted before the stream closes |
| `map(toDisplayEvent)` | Translates the internal status into the display event sent to the browser (see contract below) |
| `takeUntil(timer(interactionTtl * 1000))` | Hard timeout relative to SSE open time; the Redis TTL remains the authoritative interaction expiry |
| `catchError(…)` | Maps any stream error to the `NOT_FOUND` display event so the browser shows the failure and stops reconnecting |
| `finalize(…)` | Logs `SSE_CLOSED` regardless of how the stream ends |

### SSE contract

The server sends **display events**, not internal statuses: `{ display: SseDisplayState | null, final: boolean }` (`SseDisplayEventInterface`). The status → display translation lives in `SseService.toDisplayEvent`, covered by unit tests:

| Internal status | `display` | `final` |
|---|---|---|
| `REQUEST_URI_PROVIDED` | `null` | `false` |
| `REQUEST_OBJECT_PROVIDED` | `pending` | `false` |
| `RESPONSE_RECEIVED` | `success` | `true` |
| `NOT_FOUND` | `error` | `true` |
| `ERROR` | `error` | `true` |

### Browser-side JavaScript (`public/js/oid4vp.js`)

`oid4vp.js` uses the native `EventSource` API (ES2015, no bundler). The setup runs at the top level — no wrapper function.

The browser is a pure executor with no knowledge of internal statuses: it shows the overlay named by `display` (`pending` / `success` / `error`, cloned from `<template>` elements into empty live regions so screen readers reliably announce the change), closes the stream when `final` is `true`, and schedules the redirect to the success URL after `redirectDelay` seconds when `display` is `success`.

A `setTimeout` matching `interactionTtl` bounds `EventSource` reconnections once the interaction has expired server-side, ensuring the connection closes even if no terminal event is received.

## Dependencies

- [`@fc/openid4vp`](../../libs/openid4vp/README.md) — interaction lifecycle, Redis pub/sub, JAR/JARM crypto
- `@fc/oidc-provider` — OIDC provider (node-oidc-provider)
- `@fc/eudi` — EUDI PID types and presentation identifiers
- `@fc/mdoc` — `vp_token` decoding
- `@fc/qrcode` — QR code generation
