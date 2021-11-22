# FC/USER-DASHBOARD

## Developemment Docker

```bash
docker-stack-legacy up ud
docker-stack-legacy dep-all
docker-stack-legacy start-all
# https://ud.docker.dev-franceconnect.fr/
```

#### Ajouter des Fixtures dans la base ES

```sh
# connection au container
docker exec -it fc_csmr-tracks_1 /bin/bash
cd apps/csmr-tracks/fixtures

# check si les variables globales existent
echo $Elasticsearch_TRACKS_INDEX

# lancer le script
node --trace-warnings ./scripts/populate-account-traces.script.js
```

#### Se connecter avec l'user

> Utilisateur : `Angela Louise Dubois`<br>
> Login Utilisateur : `test`<br>
> Mot de Passe : `123`<br>

## Developpement Local

#### Lancer l'application

> Uniquement pour des besoins UI/UX

Ajouter un fichier `.env.development.local` à la racine du dossier `user-dashboard`

```bash
API_PROXY_HOST=http://www.acme.org
API_PROXY_FOR_PATH=/acme
REACT_APP_MOCK_USER_INFOS=/user.mock.json
REACT_APP_MOCK_TRACES=/traces.mock.json
```

Ajouter le fichier `user.mock.json` dans le dossier `user-dashboard/public`

```json
{
  "userInfos": {
    "givenName": "Elmer",
    "familyName": "Fudd"
  }
}
```

Ajouter le fichier `traces.mock.json` dans le dossier `user-dashboard/public`

```json
[
  {
    "accountId": "any-unique-identifier-string-1",
    "city": "Acme City",
    "country": "Acme Country",
    "date": "2011-10-06T14:48:00.000Z",
    "event": "FC_REQUESTED_IDP_USERINFO",
    "spAcr": "eidas1",
    "spId": "00-1",
    "spName": "Acme Service Provider",
    "trackId": "trackId-1"
  },
  {
    "accountId": "any-unique-identifier-string-2",
    "city": "Acme City",
    "country": "Acme Country",
    "date": "2011-10-05T14:48:00.000Z",
    "event": "not_relevant_event",
    "spAcr": "eidas1",
    "spId": "00-2",
    "spName": "Acme Service Provider",
    "trackId": "trackId-2"
  },
  {
    "accountId": "any-unique-identifier-string-3",
    "city": "Acme City",
    "country": "Acme Country",
    "date": "2012-10-05T14:48:00.000Z",
    "event": "SP_REQUESTED_FC_USERINFO",
    "spAcr": "eidas1",
    "spId": "00-2",
    "spName": "Acme Service Provider",
    "trackId": "trackId-3"
  }
]
```

Lancer la commande locale

```bash
# fc/front/apps/user-dashboard
yarn start
```

Naviguer sur

```bash
http://localhost:3000/mes-connexions
```
