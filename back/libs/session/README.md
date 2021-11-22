# Library Session

## Objective

Aims to replace the previous "session" library who is intricated with the oidc protocol.

Provides a complete session management with a redis store.

## Description

The session module is scoped by library. This way, the properties in the libraries should not overlap.

The session works paired with an interceptor who populate the current request (as long as the route is not blacklisted through the `exludedRoutes` configuration parameter, see below) using the session cookie and the `Session` decorator who expose the `get` and `set` functions from the session service scoped to the library provided in the descriptor.

The session is validated each time data are requested from it. To achieve that, you need to declare a DTO in your library that validate the structure of your session.

In the application, you should then combine your libraries DTOs with the "ValidateNested" property of class validator to create a unique DTO.

In the controllers where you want to retrieve data, you should the use the `Session` decorator (⚠️ beware not using the "nestjs" one) with the library name. Don't forget to type it with your session Dto to benefit the strong typing feature !

It should looks like:

```typescript
@Session('YourLibrary') session: ISessionService<YourLibrarySessionDto>
```

## Configuration

- `encryptionKey` ↦ Used to encrypt the session.
- `prefix` ↦ Used to prefix sessions keys in redis.
- `cookieOptions` ↦ Parameters for the session cookie.
  - `signed` ↦ The cookie must be signed to prevent tampering.
  - `sameSite` ↦ See [SameSite cookies](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie/SameSite).
  - `httpOnly` ↦ Prevent the access from the `document` object.
  - `secure` ↦ do not set cookies if not HTTP**S**.
  - `maxAge` ↦ Maximum live time before cookie expiration.
  - `domain` ↦ Send cookies only for this domain.
- `cookieSecrets` ↦ The array of secrets used to compute the hash. You can rotate them.
- `sessionCookieName` ↦ The name for the session cookie that will be displayed in the browser.
- `lifetime` ↦ The time to live of the session (It is recommanded to set the same lifetime as the cookie max-age).
- `sessionIdLength` ↦ The lentgh of the session id random (should be over 32 to respect the PSSI).
- `excludedRoutes` ↦ The routes or the regexp to match routes for which we do not allow the session to be used (Ex. backend API).

## Migration from original session module

### Create Session Schema file for your app

We need to provide a Schema that describes the type of data that can be stored in the session
This Schema target to the shared `OidcSession` interface.

```typescript
export class MockServiceProviderSession {
  @IsObject()
  @ValidateNested()
  @Type(() => OidcClientSession)
  readonly OidcClient: OidcClientSession;
}
```

### Import Session module in your module file

```typescript
    SessionModule.forRoot({
     schema: MockServiceProviderSession,
   }),
```

### Migration Session to Session: Create config file for Session instead of Session in app

Differences :

- `excludedRoutes` (array of string)
- `encryptionKey` instead of `cryptographyKey`

### Create corresponding config file in instance

```typescript
export class SessionConfig {...}
// That should be the same as the previous
export class SessionConfig {...}
```

### Replace sessionConfig with SessionConfig in main.ts of the app

```typescript
import { SessionConfig } from '@fc/session';
//...
@IsObject()
@ValidateNested()
@Type(() => SessionConfig)
readonly Session: SessionConfig;
```

This is used to configure `cookieParser`

## Usage when decorator is not relevant/usable

This librairy is mainly used by Controllers for which the Interceptor require a context to analyse
The `interactionId` is extracted from the request and target behind the hoods for whom the session have to be stored for.
Some program files such as services don't have a request to intercept, we need to reconstruct the context and inject this library to use it.

- Include this library in the module where it's required.
- Instantiate the SessionService in the library constructor.
- Create the bounded information instead of the Interceptor.
- Call the decorator method (either `set()` ot `get()`) directly from the service:

Example:

```typescript
const boundSessionContext: ISessionBoundContext = {
  sessionId,
  moduleName: 'OidcClient',
};
this.sessionService.set.bind(
  this.sessionService,
  boundSessionContext,
)(sessionProperties);
```

### Usage of Alias `setAlias()` and `getAlias()`

In some interactions between server to server we don't always have access to our `sessionId`.
We need to store it temporarily in Redis binded by the `interactionId` for which we always have access to.

- `setAlias()` Set the binding link between a key: `interactionId`, a value: `sessionId` for a lifetime: `cookies.long.maxAge`
- `getAlias` Get the binding link between a key: `interactionId`to its value: `sessionId`.
