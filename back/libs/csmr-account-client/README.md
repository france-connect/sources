# CSMR ACCOUNT CLIENT

## Description

Provides a service to handle communication with the csmr-account.  
The csmr-account is responsible for extracting both the `accountIdLow` and `accountIdHigh` from the `identityHash`.

The `identityHash` is derived from the user's identity pivot using the `computeIdentityHash` function provided by the `cryptographyFcpService`. source code here: [../../libs/cryptography-fcp/src/cryptography-fcp.service.ts](<computeIdentityHash(pivotIdentity)>).

## Configuration

This library requires access to RabbitMQ to communicate with the account consumer, therefore the account broker configuration is needed.

config example in instance:

```typescript
import { ConfigParser } from '@fc/config';
import { RabbitmqConfig } from '@fc/rabbitmq';

const env = new ConfigParser(process.env, 'AccountBroker');

export default {
  payloadEncoding: 'base64',
  queue: env.string('QUEUE'),
  queueOptions: { durable: false },
  // Global request timeout used for any outgoing app requests.
  requestTimeout: parseInt(process.env.REQUEST_TIMEOUT, 10),
  urls: env.json('URLS'),
} as RabbitmqConfig;
```

The following environment variables must be defined:

- AccountBroker_QUEUE
- AccountBroker_URLS
- REQUEST_TIMEOUT

## Usage

Use the async `getIdsWithIdentityHash` method to retrieve `accountIdLow` and `accountIdHigh` from an `identityHash`.

```typescript
import { CsmrFraudClientService } from '@fc/csmr-fraud-client';

class Foo {
  constructor(private readonly account: CsmrFraudClientService) {}

  async someMethod(identity: IOidcIdentity) {
    await this.account.getAccoundIdsFromIdentity(identity);
  }
}
```

In case of error, the library will throw an exception rather than return a falsy value.

Library error scope number is **54**
