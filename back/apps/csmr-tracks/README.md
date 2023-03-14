# Consumer Traces

## À propos

Cette application est un consumer RabbitMQ qui prend en charge les messages de demandes de traces usager et renvoie les informations.

Le consumer écoute le `pattern` (au sens de NestJs) "TRACKS_GET"

## Utilisation

### Raw

#### Elasticsearch

les données sont stoqués dans Elasticsearch et visible depuis l'URL:

- [http://localhost:9200/fc_tracks/\_search?pretty](http://localhost:9200/fc_tracks/_search?pretty)

#### RabbitMQ

Le container RabbitMQ est déployé en local depuis le `docker-compose`:

- `./fc-docker/compose/fc-core.yml` in the container `csmr-tracks`.
- In ths environment settings this two vars have to be set:
  - `'TracksBroker_URLS=["amqp://tracksbroker:5672"]'`
  - `'TracksBroker_QUEUE=tracks'`

Accessible depuis l'[interface graphique de RabbitMQ](http://localhost:15673/#/queues/%2F/tracks) :

- Login: `guest`
- Password: `guest`

Then in the section `Publish message` in the field `Payload` we can broadcast
this message that will be received by all the application listening to the `topic` (or `pattern` in nestJS): `TRACKS_GET`

for aggregate :

```json
{
  "pattern": "TRACKS_GET",
  "data": {
    "given_name": "Jean_E000001",
    "family_name": "MARTIN",
    "birthdate": "1981-02-03",
    "gender": "male",
    "birthcountry": "99100",
    "birthplace": "75112"
  }
}
```

for csmr-tracks :

```json
{
  "pattern": "TRACKS_GET",
  "data": {
    "identityHash": "m+yf8zrTpLBGrSjYIL+kzpjNkTtE6LTbl9dikcHd7A0="
  }
}
```

Function that get the account hash from account data (identity pivot) :
[../../libs/cryptography-fcp/src/cryptography-fcp.service.ts](<computeIdentityHash(pivotIdentity)>)

### Depuis Nest

```typescript
import { timeout } from 'rxjs/operators';
import { TracksProtocol } from '@fc/microservices';

class MyService {
  constructor(@Inject('TracksBroker') private broker: ClientProxy) {}

  myMethod() {
    // Fonction de callback
    const next = (resolve, reject, data): void => resolve(data);

    // Fonction d'erreur
    const error = (error) => console.error(error);

    // Données à envoyer
    const payload = { foo: 'bar' };

    this.broker
      .send(TracksProtocol.Commands.GET, payload)
      // Gestion native du timeout
      .pipe(timeout(requestTimeout))
      // Écoute de la "réponse" de RabbitMQ
      .subscribe({
        next,
        error,
      });
  }
}
```

### output

payload format:

```
{
  "type": "TRACKS_DATA",
  "payload": [],
  "meta": {
    "total": 172281, // all events for this user
    "size": 10, // size of the payload array, maximum 500
    "offset": 0 // always sending the last events so always 0
  }
}
```

Tracked events:

- FC_VERIFIED : the user has been authenticated and arrived on the consent/information page of FranceConnect
- FC_DATATRANSFER_CONSENT_IDENTITY : the user has given his consent to share its identity with a private service provider
- FC_DATATRANSFER_CONSENT_DATA : the user has given his consent to share some data from a data provider with a private service provider
- DP_REQUESTED_FC_CHECKTOKEN : the data provider has requested the validation of a token before providing its data to the private service provider

event format:

```
{
  "event": "FC_VERIFIED",
  "time": 1675874359719,
  "spLabel": "sp Label",
  "spAcr": "eidas1",
  "idpLabel": "idp Label",
  "country": "FR",
  "city": "Paris",
  "claims": [ ], // claims are not listed for FC_VERIFIED events
  "trackId": "3840b73f-e46b-4cc3-9fcf-1dce0ec06e91",
  "platform": "FranceConnect" // or FranceConnect+
},
```

claim format:

```
{
  "identifier": "birthcountry",
  "label": "Pays de naissance",
  "provider": {
    "key": "FCP_LOW",
    "label": "FranceConnect"
  }
}
```
