# CSMR FRAUD CLIENT

## Description

Provides a service handling the communication with the csmr-fraud.
The csmr-fraud is responsible for processing fraud case filled on the user dashboard.

## Configuration

This library requires the access to RabbitMQ to communicate with the fraud consumer, therefore the fraud broker configuration is needed.

config example in instance:

```typescript
import { ConfigParser } from '@fc/config';
import { RabbitmqConfig } from '@fc/rabbitmq';

const env = new ConfigParser(process.env, 'FraudBroker');

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

- FraudBroker_QUEUE
- FraudBroker_URLS
- REQUEST_TIMEOUT

## Usage

Use the async processFraudCase method to send the form to OTRS

```typescript
import { CsmrFraudClientService } from '@fc/csmr-fraud-client';

class Foo {
  constructor(private readonly csmrFraudClient: CsmrFraudClientService) {}

  async someMethod(idenity: IOidcIdentity) {
    await this.csmrFraudClient.processFraudCase(identity, fraudCase);
  }
}
```

In case of an error, the lib will throw rather than returning a falsy value.

Library error scope number is **53**
