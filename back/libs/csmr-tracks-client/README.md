# CSMR-TRACKS-CLIENT

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
import { CsmrTracksClientService } from '@fc/csmr-tracks-client';

class Foo {
  constructor(private readonly tracks: CsmrTracksClientService) {}

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
    "claims": "['sub','gender','family_name'] | null",
    "accountId": "3ec64565-a907-4284-935a-0ff0213cc120",
    "platform": "FranceConnect",
    "idpLabel": "Amelie",
    "spLabel": "EDF",
    "interactionAcr": "eidas1",
    "country": "FR",
    "city": "Paris",
    "trackId": "fj8x83sBisV0DqyNyx-s",
    "authenticationEventId": "4e47191b-4d5c-4a84-a639-18e658ab55af"
  },
  {
    "event": "not_relevant_event",
    "date": "2022-01-17T11:58:51.664+01:00",
    "claims": "['sub','gender','family_name'] | null",
    "accountId": "3ec64565-a907-4284-935a-0ff0213cc120",
    "platform": "FranceConnect",
    "idpLabel": "Amelie",
    "spName": "France Telecom",
    "interactionAcr": "eidas1",
    "country": "FR",
    "city": "Paris",
    "trackId": "fz8x83sBisV0DqyNyx-s",
    "authenticationEventId": "4e47191b-4d5c-4a84-a639-18e658ab55af"
  },
  {
    "event": "SP_REQUESTED_FC_USERINFO",
    "date": "2021-11-17T11:58:51.664+01:00",
    "claims": "['sub','gender','family_name'] | null",
    "accountId": "3ec64565-a907-4284-935a-0ff0213cc120",
    "platform": "FranceConnect",
    "idpLabel": "Amelie",
    "spName": "LaPoste",
    "interactionAcr": "eidas1",
    "country": "FR",
    "city": "Paris",
    "trackId": "gD8x83sBisV0DqyNyx-s",
    "authenticationEventId": "4e47191b-4d5c-4a84-a639-18e658ab55af"
  }
]
```

In case of an error, the lib will throw rather than returning a falsy value.

Library error scope number is **22**
