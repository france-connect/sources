# user-preferences

## Objective

Fetch user-preferences through the csmr-user-preferences consumer.

## Description

Provides a service that, for a given OIDC identity, will return associated user preferences.
It also provides a service which allow to update user preferences.

## Configuration

This library relies on RabbitMQ to communicate with the consumer, so you have to configure broker.

example config in instance:

```typescript
import { ConfigParser } from '@fc/config';
import { RabbitmqConfig } from '@fc/rabbitmq';

const env = new ConfigParser(process.env, 'Broker');

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

### Fetch userPreferences

Use the async getUserPreferencesList method to fetch tracks for given identity.

```typescript
import { UserPreferencesService } from '@fc/user-preferences';

class Foo {
  constructor(private readonly userPreferences: UserPreferencesService) {}

  async someMethod(idenity: IOidcIdentity) {
    const userPreferences = await this.userPreferences.getUserPreferencesList(
      identity,
    );

    console.log(userPreferences);
  }
}
```

Logs an output like :

```json
[
  {
    "uid": "07e573f2-3312-4bb9-bc48-6fcec737e497",
    "name": "fip1-low",
    "image": "fi-mock-faible.svg",
    "title": "FIP1-LOW - eIDAS LOW",
    "active": true,
    "isChecked": true
  },
  {
    "uid": "b5e9539a-599a-4ed2-9b4f-8f4bfc5fbb64",
    "name": "fip2-low",
    "image": "fi-mock-substantiel.svg",
    "title": "FIP2-LOW - eIDAS SUBSTANTIAL - NO DISCOVERY",
    "active": true,
    "isChecked": false
  },
  [...]
]
```

In case of an error, the lib will throw rather than returning a falsy value.
