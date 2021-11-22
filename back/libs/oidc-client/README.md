# OIDC Client

## À propos

Cette libraire sert à encapsuler la libraire tierce [node-openid-client](https://github.com/panva/node-openid-client).

## Règles de validation d'un IdP

### IdP avec discovery

Si l'IdP a le discovery activé alors le paramètre discoveryUrl doit être présent et il ne doit pas y avoir de paramètres de configuration.

### IdP avec discovery avec jwksURL

Si l'IdP n'a pas le discovery activé alors le paramètre discoveryUrl doit être absent et les paramètres de configuration doivent d'êtres présents. En cas de présence d'un paramètre jwksURL, le discovery doit être désactivé et les algos de signature ne doivent pas être symétriques (HS256, HS512).

## Utilisation d'un certificat client

Pour que le client openid fournisse un certificat client au fournisseur d'identité, renseigner les variables suivantes dans la [configuration de la librairie](src/dto/oidc-client-config.dto.ts) avec le chemin vers les fichiers contenant le certificat client et sa clé :

Version anicenne config :

```typescript
export default {
  httpOptions: {
    key: readFileSync(process.env.HTTPS_CLIENT_KEY).toString('utf8'),
    cert: readFileSync(process.env.HTTPS_CLIENT_CERT).toString('utf8'),
    //...
  },
  //...
};)
```

Version nouvelle config (#391)

```typescript
import { ConfigParser } from '@fc/config';

const env = new ConfigParser(process.env,'Https');

export default {
  //...
  httpOptions: {
    key: env.file('CLIENT_KEY'),
    cert: env.file('CLIENT_CERT'),
  //...
  }
  //...
```

## Désactiver le chiffrement des `userinfo`

Dans la configuration du client oidc, s'assurer de ne pas préciser d'algorithme et d'encodage de chiffrement (une chaîne vide fait l'affaire si on est obligé de passer le paramètre)

## Activation du Financial grade API (FAPI)

La librairie [node-openid-client](https://github.com/panva/node-openid-client) supporte le niveau FAPI qui ajoute [quelques comportements spécifiques](https://github.com/panva/node-openid-client/blob/main/docs/README.md#issuerfapiclient) de sécurité.

Pour activer cette option, le paramètre de configuration dans l'application est `fapi` (boolean).  
Au niveau de variables d'environnement, le paramètre est OidcClient_FAPI (booléen interprété par [parseBoolean](../common/src/helpers/parse-boolean.ts))

## Version de Jose :warning:

Depuis la nouvelle version de Oidc-provider les verions de jose qui sont en dépendence de oidc-provider et oidc-client ont divergées. Oidc-client utilise une version 2.X.

[TODO ici](src/dto/oidc-client-config.dto.ts)
[ici](src/services/oidc-client-utils.service.ts)
[Et ici](src/services/oidc-client-utils.service.spec.ts)

[Voici le lien pour savoir si panva a effectuer la mise à jour](https://github.com/panva/node-openid-client/blob/main/package.json#L58)
