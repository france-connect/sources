# Data Provider Core Auth

## Objective

Provide a standard and lazy way to authenticate against FC core and fetch relevant data as a data provider.

## Description

Provides decorator to extract [Bearer token](https://datatracker.ietf.org/doc/html/rfc6750) sent by service providers.
Provides a service to check the token and get identity and other metadatas in return.

## Configuration

You should implement the [configuration DTO](./src/dto/data-provider-core-auth-config.ts) in your app and instance config.

## Usage

### AuthToken decorator

Get the token input in a controller

example: 

```typescript
import { HttpAuthToken } from '@fc/data-provider-core-auth';

  // [...]

  @Get()
  async getTracks(@HttpAuthToken() token: string) {
    console.log(token) // Bearer token from header 'Authorization"
  }

```

### Token check and Identity fetch

A single API call is needed to both validate token and obtain identity in return.

Import the service and call the async [getIdentity()](./src/services/data-provider-core-auth.service.ts) method with the token.

example:

```typescript
    const identity = await this.coreAuth.getIdentity(token);
    // identity is an OIDC Identity
```




The library will throw rather than return a falsy value

Library error scope number is **21**


