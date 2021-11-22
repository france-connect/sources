# Oidc Provider

## À propos

Cette libraire sert à encapsuler la libraire tierce [node-oidc-provider](https://github.com/panva/node-oidc-provider).

## Recettes

### Désactiver le chiffrement des `userinfo`

1. Dans la [configuration de la librairie](src/dto/oidc-provider-config.dto.ts), désactiver la `feature` _encryption_.
1. Dans les configuration des clients, s'assurer de ne pas préciser d'algorithme et d'encodage de chiffrement (une chaîne vide fait l'affaire)

## Découpage fonctionnel

Les parties relative à la gestion des erreurs et à la configuration on été déplacées respectivement dans:

- `./services/oidc-provider-error.service.ts`
- `./services/oidc-provider-config.service.ts`

La gestion des différents middlewares étant une partie métier, ces derniers ont été déplacés dans le `/lib/core/core.service.ts` à l'intérieur de la librairie core.

### Le double adapter

Dans le cas d'une mise à jour de base de données, le cache de service provider se met à jour.
Ce dernier "prévient" les autres services qu'il est opérationnel et déclenche de fait une mise à jour de la configuration de oidc-provider.
Dans cette optique, oidc-provider doit pouvoir piocher dans ce cache la liste des services providers lorsqu'il l'estime nécessaire par l'intermédiaire d'un adapter.
Il y a deux possibilités pour récupérer l'information:

- soit la liste provient de redis
- soit la liste provient du cache de service provider
  Donc, en fonction du contexte définit par oidc-provider, l'adapter appelera un autre adapter lui fournissant la liste correcte des données

  ## Mise à jour en version 7.X

  ### Types et interfaces

  - Les types de la librairie de oidc-provider ne sont plus exportés en interne de la librairie mais avec un @types/oidc-provider
  - L'interface `AnyClientMetadata` a été remplacée au profit de `AllClientMetadata`
  - Oidc-provider utilise la version 3.X de jose. Cette version se rapproche au maximum des types de la librairie Crypto (ex: KeyLike)

  ### Oidc configuration

  - Les valeurs d'expiration de la session et de l'interaction dans la configuration ne sont plus stockées dans les cookies via le paramètre `maxAge` de `long` et `short` mais dans un objet `ttl` via les paramètres `Interaction` et `Session` (en secondes).
  - Oidc-provider 7.X a besoin d'un paramètre Pkce dans sa configuration.
  - Le paramètre `revocation_endpoint_auth_method` a été supprimé de la configuration.
  - Le paramètre `whitelistedJWA` a été remplacé au profit de `enabledJWA`.

  ### Autres modifications apportées

  - Les fonctions `encodeBuffer() derToJose() JWS.compact()` ont été passées en asynchrone donc plus besoin de les overrider
  - Lors de sa sauvegarde dans le Redis notre id de session est maintenant enregistré avec le sub de l'utilisateur en clé pour qu'il puisse être récupéré dans l'ensemble de la cinématique utilisateur
  - L'interaction ID est stocké dans `oidc.entities.Interaction.uid` à part pour la route TOKEN où elle se trouve ici `oidc.entities.Grant.accountId` ou la route USERINFO où elle se trouve là `oidc.entities.Account.accountId`.
  - La fonction `finishInteraction()` dans le `oidc-provider.service.ts` doit maintenant retourner un `grantId` dans l'object `consent`. Celui-ci est généré par le nouveau `oidc-provider-grant.service.ts`.
