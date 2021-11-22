# Core

## À propos

Cette libraire permet de fournir un noyau fonctionnel aux différentes instances.

## Recettes

## Souscriptions aux middlewares

La souscription aux middlewares sur l'instance de l'oidcProvider a été déplacée dans le core service afin de respecter un découpage métier.
Le core service enregistre 5 middlewares :

- overrideAuthorizePrompt
- overrideAuthorizeAcrValues
- authorizationMiddleware
- tokenMiddleware
- userinfoMiddleware
