# Tracks

## Objective

Fetch tracks via csmr-tracks consumer.

## Description

Provides a service that, for a given OIDC identity, will return associated tracks.

## Configuration

This library relies on RabbitMQ to communicate with the tracks consumer, so you have to configure tracks broker.

example config in instance: 

```typescript
import { ConfigParser } from '@fc/config';
import { RabbitmqConfig } from '@fc/rabbitmq';

const env = new ConfigParser(process.env, 'TracksBroker');

export default {
  payloadEncoding: 'base64',
  queue: env.string('QUEUE'),
  queueOptions: { durable: false },
  // Global request timeout used for any outgoing app requests.
  requestTimeout: parseInt(process.env.REQUEST_TIMEOUT, 10),
  urls: env.json('URLS'),
} as RabbitmqConfig;
```

You need to add the corresponding env variables.

## Usage

Use the async getList method to fetch tracks for given identity.


```typescript

import { TracksService } from '@fc/tracks';


class Foo {
  constructor(private readonly tracks: TracksService) {}

  async someMethod(idenity: IOidcIdentity) {

    const tracks = await this.tracks.getList(identity);

    console.log(tracks);
  }
}
```

Logs an output like :


```json
[
  {
    "event": "FC_REQUESTED_IDP_USERINFO",
    "date": "2022-06-17T11:58:51.643+02:00",
    "accountId": "3ec64565-a907-4284-935a-0ff0213cc120",
    "spId": "001",
    "spName": "EDF",
    "spAcr": "eidas1",
    "country": "FR",
    "city": "Paris",
    "trackId": "fj8x83sBisV0DqyNyx-s"
  },
  {
    "event": "not_relevant_event",
    "date": "2022-01-17T11:58:51.664+01:00",
    "accountId": "3ec64565-a907-4284-935a-0ff0213cc120",
    "spId": "002",
    "spName": "France Telecom",
    "spAcr": "eidas1",
    "country": "FR",
    "city": "Paris",
    "trackId": "fz8x83sBisV0DqyNyx-s"
  },
  {
    "event": "SP_REQUESTED_FC_USERINFO",
    "date": "2021-11-17T11:58:51.664+01:00",
    "accountId": "3ec64565-a907-4284-935a-0ff0213cc120",
    "spId": "003",
    "spName": "LaPoste",
    "spAcr": "eidas1",
    "country": "FR",
    "city": "Paris",
    "trackId": "gD8x83sBisV0DqyNyx-s"
  }
]
```

In case of an error, the lib will throw rather than returning a falsy value.


Library error scope number is **22**

