# CSMR HSM CLIENT

## Description

Provides a service handling the communication with the hsm consumer (csmr-hsm).
The csmr-hsm is responsible for handling cryptographic operations such as signing and verifying data using a secure hardware module.

## Configuration

This library requires the access to RabbitMQ to communicate with the hsm consumer, therefore configuration is needed.

config example in instance:

```typescript
import { ConfigParser } from '@fc/config';
import { Versions } from '@fc/csmr-hsm-client/protocol';
import { MicroservicesRmqConfig } from '@fc/microservices-rmq';

const env = new ConfigParser(process.env, 'CryptographyBroker');

export default {
  payloadEncoding: 'base64',
  queue: env.string('QUEUE'),
  urls: env.json('URLS'),
  queueOptions: { durable: false },
  // Global request timeout used for any outgoing app requests.
  requestTimeout: parseInt(process.env.REQUEST_TIMEOUT, 10),
  protocolVersion: Versions.V2,
} as MicroservicesRmqConfig;
```

The following environment variables must be defined:

- CryptographyBroker_URLS
- CryptographyBroker_QUEUE
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
      type: ActionTypes.SIGN,
      payload: {
        data: dataBuffer.toString(payloadEncoding),
        digest,
      },
    };

    const { payload } = await this.hsm.publish(message);
  }
}
```
