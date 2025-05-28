# CSMR HSM CLIENT

## Description

Provides a service handling the communication with the hsm consumer (csmr-hsm).
The csmr-hsm is responsible for handling cryptographic operations such as signing and verifying data using a secure hardware module.

## Configuration

This library requires the access to RabbitMQ to communicate with the hsm consumer, therefore configuration is needed.

config example in instance:

```typescript
import { ConfigParser } from '@fc/config';
import { RabbitmqConfig } from '@fc/rabbitmq';

const env = new ConfigParser(process.env, 'MicroserviceCsmrHsmClient');

export default {
  payloadEncoding: 'base64',
  queue: env.string('QUEUE'),
  urls: env.json('URLS'),
  queueOptions: { durable: false },
  // Global request timeout used for any outgoing app requests.
  requestTimeout: parseInt(process.env.REQUEST_TIMEOUT, 10),
} as RabbitmqConfig;
```

The following environment variables must be defined:

- MicroserviceCsmrHsmClient_QUEUE
- MicroserviceCsmrHsmClient_URLS
- REQUEST_TIMEOUT

## Usage

Use the async publish method to send message to hsm consummer ( csmr-hsm )

```typescript
import { ActionTypes, CsmrHsmClientService } from '@fc/csmr-hsm-client';

class Foo {
  constructor(
    @Inject('CsmrHsmClient')
    private readonly hsm: CsmrHsmClientService
  ) {}

  async someMethod(payload: any) {
    const message = {
      type: ActionTypes.CRYPTO_SIGN,
      payload: {
        data: dataBuffer.toString(payloadEncoding),
        digest,
      },
    };

    const { payload } = await this.hsm.publish(message);
  }
}
```
