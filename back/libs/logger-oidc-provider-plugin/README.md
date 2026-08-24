# Logger OIDC Provider plugin

Context plugin for `@fc/logger`, see [`README`](../logger/README.md#Plugins)

Adds

- clientId

## Resolution

`clientId` is resolved from the raw HTTP request, reading `query` first then
`body`. Within each of them, the following sources are tried in order:

1. the `client_id` parameter
2. the `aud` claim of `id_token_hint` — identifies the client on RP-Initiated
   Logout, where `client_id` is optional
3. the `sub` claim of `client_assertion` — identifies the client on
   `private_key_jwt` authentication, where `client_id` is optional

In practice a given endpoint carries its parameters either in the query or in
the body, never in both, so the two orderings only differ in theory.

An empty parameter is treated as absent and falls through to the next source,
mirroring how `oidc-provider` itself normalises request parameters.

JWT payloads are decoded **without signature verification**. A token that cannot
be decoded is skipped and resolution falls through to the next source.

## Security

The resolved value is attacker-controlled and unverified. It is a correlation
hint for technical logs only, and must never be used as an authorization input
nor stored in session as `spId`.
