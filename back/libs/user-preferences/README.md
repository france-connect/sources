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
    "uid": "fip1-high",
    "name": "fip1-high",
    "image": "fi-mock-eleve.svg",
    "title": "IDP1 - Identity Provider - eIDAS élevé - discov - crypt",
    "active": true,
    "isChecked": true
  },
  {
    "uid": "fip2-high",
    "name": "fip2-high",
    "image": "fi-mock-eleve.svg",
    "title": "IDP2 - Identity Provider - eIDAS élevé - nodiscov - nocrypt",
    "active": true,
    "isChecked": true
  },
  {
    "uid": "fip3-desactive-visible",
    "name": "fip3-desactive-visible",
    "image": "fi-mock-eleve.svg",
    "title": "FIP3 - FI désactivé mais visible",
    "active": false,
    "isChecked": true
  },
  {
    "uid": "fip4-desactive-invisible",
    "name": "fip4-desactive-invisible",
    "image": "fi-mock-eleve.svg",
    "title": "FIP4 - FI désactivé et invisible",
    "active": false,
    "isChecked": true
  },
  {
    "uid": "fip5-active-invisible",
    "name": "fip5-active-invisible",
    "image": "fi-mock-eleve.svg",
    "title": "FIP5 - FI activé et invisible",
    "active": true,
    "isChecked": true
  },
  {
    "uid": "fip6-high",
    "name": "fip6-high",
    "image": "fi-mock-eleve.svg",
    "title": "IDP6 - Identity Provider - eIDAS élevé - whitelisted - nodiscov - crypt",
    "active": true,
    "isChecked": true
  },
  {
    "uid": "fip8-high",
    "name": "fip8-high",
    "image": "fi-mock-eleve.svg",
    "title": "IDP8 - Identity Provider - eIDAS élevé - whitelisted - discov - crypt",
    "active": true,
    "isChecked": true
  },
  {
    "uid": "fip11-high",
    "name": "fip11-high",
    "image": "fi-mock-eleve.svg",
    "title": "IDP11 - Identity Provider - eIDAS élevé - whitelisted - nodiscov - crypt",
    "active": true,
    "isChecked": true
  },
  {
    "uid": "fip13-high",
    "name": "fip13-high",
    "image": "fi-mock-eleve.svg",
    "title": "IDP13 - Identity Provider - eIDAS élevé - crypted (ECDH-ES + A256GCM) - signed (ES256)",
    "active": true,
    "isChecked": true
  },
  {
    "uid": "fip14-high",
    "name": "fip14-high",
    "image": "fi-mock-eleve.svg",
    "title": "IDP14 - Identity Provider - eIDAS élevé - crypted (RSA-OAEP + A256GCM) - signed (RS256)",
    "active": true,
    "isChecked": true
  },
  {
    "uid": "fip15-high",
    "name": "fip15-high",
    "image": "fi-mock-substantiel.svg",
    "title": "IDP15 - Identity Provider - eIDAS substantiel - crypted (RSA-OAEP + A256GCM) - signed (ES256)",
    "active": true,
    "isChecked": true
  },
  {
    "uid": "fip16-high",
    "name": "fip16-high",
    "image": "fi-mock-substantiel.svg",
    "title": "IDP16 - Identity Provider - eIDAS substantiel - crypted (ECDH-ES + A256GCM) - signed (RS256)",
    "active": true,
    "isChecked": true
  },
  {
    "uid": "fip17-high",
    "name": "fip17-high",
    "image": "fi-mock-substantiel.svg",
    "title": "IDP17 - Identity Provider - eIDAS substantiel - crypted (none) - signed (ES256)",
    "active": true,
    "isChecked": true
  },
  {
    "uid": "fip18-high",
    "name": "fip18-high",
    "image": "fi-mock-faible.svg",
    "title": "IDP18 - Identity Provider - eIDAS faible - crypted (none) - signed (ES256)",
    "active": true,
    "isChecked": true
  },
  {
    "uid": "fip19-high",
    "name": "fip19-high",
    "image": "fi-mock-faible.svg",
    "title": "IDP19 - Identity Provider - eIDAS faible - crypted (none) - signed (RS256)",
    "active": true,
    "isChecked": true
  },
  {
    "uid": "fip20-high",
    "name": "fip20-high",
    "image": "fi-mock-faible.svg",
    "title": "IDP20 - Identity Provider - eIDAS faible - crypted (none) - signed (HS256)",
    "active": true,
    "isChecked": true
  }
]
```

In case of an error, the lib will throw rather than returning a falsy value.
