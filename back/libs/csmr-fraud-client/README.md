# CSMR FRAUD CLIENT

## Description

Provides a service handling the communication with the csmr-fraud.
The csmr-fraud is responsible for fetching fraud tracks and processing fraud cases filed on the user dashboard.

## Configuration

This library requires access to RabbitMQ to communicate with the fraud consumer, therefore the fraud broker configuration is needed.

Config example in `instance`:

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

- `FraudBroker_QUEUE`
- `FraudBroker_URLS`
- `REQUEST_TIMEOUT`

## Usage

Use the async methods on `CsmrFraudClientService` to publish messages to the fraud service.

### Process a fraud case

```typescript
import { CsmrFraudClientService } from '@fc/csmr-fraud-client';
import {
  FraudCaseMessageDto,
  FraudCaseResponseDto,
} from '@fc/csmr-fraud-client/dto';

class Foo {
  constructor(private readonly csmrFraudClient: CsmrFraudClientService) {}

  async processCase(
    message: FraudCaseMessageDto,
  ): Promise<FraudCaseResponseDto> {
    return this.csmrFraudClient.publishFraudCase(message);
  }
}
```

### Fetch fraud tracks

```typescript
import { CsmrFraudClientService } from '@fc/csmr-fraud-client';
import {
  FraudTracksMessageDto,
  FraudTracksResponseDto,
} from '@fc/csmr-fraud-client/dto';

class Foo {
  constructor(private readonly csmrFraudClient: CsmrFraudClientService) {}

  async fetchTracks(
    message: FraudTracksMessageDto,
  ): Promise<FraudTracksResponseDto> {
    return this.csmrFraudClient.publishFraudTracks(message);
  }
}
```

In case of an error, the lib will throw rather than returning a falsy value.

Library error scope number is **53**
