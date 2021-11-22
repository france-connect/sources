# AGENT CONNECT

## Développement Local

> Permet d'économiser les ressources d'une machine.

- ajouter le fichier `/public/data.mock.json`

```json
{
  "identityProviders": [],
  "ministries": ["ministry of something"],
  "redirectToIdentityProviderInputs": "",
  "redirectURL": "",
  "serviceProviderName": ""
}
```

```bash
BROWSER=none
API_PROXY_HOST=/
API_PROXY_FOR_PATH=/
REACT_APP_API_MOCK_DATA_FILE=/data.mock.json
```

```json
{
  // récupérer les données de l'API depuis la console
  "ministries": [],
  "identityProviders": []
}
```

- lancer le serveur local avec la commande `yarn start`
- visiter l'URL `localhost:3000/api/v2/interaction/abcd`

# Architecture du dossier `src`

**src/index.ts**

- gère les composants/décorateurs principaux de l'application (redux, router...)
- charge `applicationlayout` qui permet l'affichage des éléments architecturaux principaux (header/footer) communs aux pages

**src/application-layout**

- responsable de l'affichage du header/footer
- responsable de la page a afficher requêtée par le navigateur

**src/routes.ts**

- fichier déclaratif des routes/pages de l'application

**src/pages**

- chaque fichiers représente une page de l'application
- l'affichage de ces pages est géré par le `applicationLayout`

**src/components**

- dossier contenant les features/blocks visuels partageables entre toutes les applications

**src/constants.ts**

- fichier des constantes globales à l'application

**src/redux**
