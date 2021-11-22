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
this massage that will be received by all the application listening to the `topic` (or `patern` in nestJS): `TRACKS_GET`

```json
{
  "pattern": "TRACKS_GET",
  "data": {
    "given_name": "Jean_E000001",
    "family_name": "MARTIN",
    "birthdate": "1981-02-03",
    "gender": "male",
    "preferred_username": "",
    "birthcountry": "99100",
    "birthplace": "75112",
    "email": "",
    "phone_number": "",
    "address": {
      "country": "",
      "formatted": "",
      "locality": "",
      "postal_code": "",
      "street_address": ""
    }
  }
}
```

Function that get the account hash from account data (identity pivo) :
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
