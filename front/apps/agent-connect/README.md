# AGENT CONNECT

## Développement Local

> Permet d'économiser les ressources d'une machine.

- ajouter le fichier `/public/data.mock.json`
- récupérer les données de l'appel API
- créer un fichier `.env` à la racine du projet

```bash
BROWSER=none
API_PROXY_HOST=/
API_PROXY_FOR_PATH=/
REACT_APP_API_MOCK_DATA_FILE=/data.mock.json
```

- lancer le serveur local avec la commande `yarn start`
- visiter l'URL `localhost:3000/api/v2/interaction/abcd`

#### Exemple de données récupérées depuis l'API_PROXY_HOST

```json
{
  "identityProviders": [
    {
      "active": true,
      "display": true,
      "name": "Identity Provider 1 - eIDAS faible - ES256",
      "uid": "fia1-low"
    }
  ],
  "ministries": [
    {
      "id": "mock-ministere-interieur-some-fis-disabled-sort 1",
      "sort": 1,
      "name": "MOCK - Ministère de l'intérieur - SOME FIS DISABLED - SORT 1",
      "identityProviders": [
        "fia1-low",
        "fia3-desactive-visible",
        "fia6-active-invisible",
        "fia7-desactive-invisible"
      ]
    }
  ],
  "redirectToIdentityProviderInputs": {
    "acr_values": "eidas1",
    "csrfToken": "4628dba2ece339dbb7ece681ed4986ed4ec546813d1b86a8a6a13ba19c696df5",
    "redirect_uri": "https://fsa1-low.docker.dev-franceconnect.fr/oidc-callback",
    "response_type": "code",
    "scope": "openid uid given_name usual_name email siren siret organizational_unit belonging_population phone chorusdt"
  },
  "redirectURL": "/api/v2/redirect-to-idp",
  "serviceProviderName": "FSA - FSA1-LOW"
}
```
