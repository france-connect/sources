# Identity Provider Adapter Mongo

Adaptateur MongoDB pour la gestion des FI (Identity Providers).


## À propos

Cette librairie fournie un adapteur pour récupérer des FI renseignés en base de données MongoDB.


## À savoir

### Structure des données

Les données sont structurées dans un objet à 2 niveaux comme suit :

  - **/** : Données sécifique au core FranceConnect / AgentConnect (nom, logo, activation, etc.)
  - **/client** : Les informations spécifique au core en tant que client (client_secret, choix d'algo de signature, etc.)
  - **/issuer** : Les données décrivant le FI (différents les endpoints OIDC, url de discovery le cas échéants, etc.) 


### Valildation

Les données en provenance de la base de données sont validées par DTO.  

Il existe 2 DTO distincts, selon qu'on utilse ou non le [mode discovery](https://openid.net/specs/openid-connect-discovery-1_0.html) d'OIDC.
