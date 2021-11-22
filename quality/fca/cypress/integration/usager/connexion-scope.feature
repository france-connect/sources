#language: fr
@usager @connexionScope
Fonctionnalité: Connexion Usager - Scope
  # En tant qu'usager d'un fournisseur de service,
  # je veux me connecter en utilisant un fournisseur d'identité
  # afin de communiquer certaines informations personnelles au fournisseur de service

  Plan du Scénario: Connexion d'un usager - scope <scopeType>
    Etant donné que le fournisseur de service requiert l'accès aux informations des scopes "<scopeType>"
    Et que je navigue sur la page fournisseur de service
    Et que je clique sur le bouton AgentConnect
    Et que je suis redirigé vers la page sélection du fournisseur d'identité
    Et que j'utilise un fournisseur d'identité "actif"
    Et que je cherche le fournisseur d'identité par son ministère
    Et que je clique sur le fournisseur d'identité
    Et que je suis redirigé vers la page login du fournisseur d'identité
    Quand je m'authentifie avec succès
    Alors je suis redirigé vers la page fournisseur de service
    Et je suis connecté
    Et le fournisseur de service a accès aux informations des scopes "<scopeType>"

    Exemples:
      | scopeType                                 |
      | tous les scopes                           |
      | obligatoires                              |
      | obligatoires et siren/siret               |
      | obligatoires et organizational_unit/phone |
      | obligatoires et belonging_population      |
      | email                                     |
      | chorusdt                                  |

  Scénario: Connexion d'un usager - scope anonyme
    Etant donné que le fournisseur de service requiert l'accès aux informations du scope "anonyme"
    Et que je navigue sur la page fournisseur de service
    Et que je clique sur le bouton AgentConnect
    Et que je suis redirigé vers la page sélection du fournisseur d'identité
    Et que j'utilise un fournisseur d'identité "actif"
    Et que je cherche le fournisseur d'identité par son ministère
    Et que je clique sur le fournisseur d'identité
    Et que je suis redirigé vers la page login du fournisseur d'identité
    Quand je m'authentifie avec succès
    Alors je suis redirigé vers la page fournisseur de service
    Et je suis connecté
    Et le fournisseur de service a accès aux informations du scope "anonyme"

  Scénario: Connexion d'un usager - attribut scope inconnu ignoré
    Etant donné que le fournisseur de service requiert l'accès aux informations des scopes "email avec scope inconnu"
    Et que je navigue sur la page fournisseur de service
    Et que je clique sur le bouton AgentConnect
    Et que je suis redirigé vers la page sélection du fournisseur d'identité
    Et que j'utilise un fournisseur d'identité "actif"
    Et que je cherche le fournisseur d'identité par son ministère
    Et que je clique sur le fournisseur d'identité
    Et que je suis redirigé vers la page login du fournisseur d'identité
    Quand je m'authentifie avec succès
    Alors je suis redirigé vers la page fournisseur de service
    Et je suis connecté
    Et le fournisseur de service a accès aux informations des scopes "email"

  Scénario: Connexion d'un usager - erreur scope vide
    Etant donné que le fournisseur de service a configuré sa requête authorize avec un scope "vide"
    Et que je navigue sur la page fournisseur de service
    Quand je clique sur le bouton AgentConnect
    Alors je suis redirigé vers la page erreur du fournisseur de service
    Et le titre de l'erreur fournisseur de service est "invalid_request"
    Et la description de l'erreur fournisseur de service est "openid scope must be requested when using the acr_values parameter"

  Scénario: Connexion d'un usager - erreur scope openid manquant
    Etant donné que le fournisseur de service a configuré sa requête authorize avec des scopes "obligatoires sans openid"
    Et que je navigue sur la page fournisseur de service
    Quand je clique sur le bouton AgentConnect
    Alors je suis redirigé vers la page erreur du fournisseur de service
    Et le titre de l'erreur fournisseur de service est "invalid_request"
    Et la description de l'erreur fournisseur de service est "openid scope must be requested when using the acr_values parameter"

  Scénario: Connexion d'un usager - erreur FS non habilité pour ce scope
    Etant donné que j'utilise le fournisseur de service "non habilité à demander le scope belonging_population"
    Et que le fournisseur de service requiert l'accès aux informations des scopes "obligatoires et belonging_population"
    Et que je navigue sur la page fournisseur de service
    Quand je clique sur le bouton AgentConnect
    Alors je suis redirigé vers la page erreur du fournisseur de service
    Et le titre de l'erreur fournisseur de service est "invalid_scope"
    Et la description de l'erreur fournisseur de service est "requested scope is not allowed"
