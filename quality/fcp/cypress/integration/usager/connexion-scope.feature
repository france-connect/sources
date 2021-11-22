#language: fr
@usager @connexionScope
Fonctionnalité: Connexion Usager - Scope
  # En tant qu'usager d'un fournisseur de service,
  # je veux me connecter en utilisant un fournisseur d'identité
  # afin de communiquer certaines informations personnelles au fournisseur de service

  Plan du Scénario: Connexion d'un usager - scope <scopeType>
    Etant donné que le fournisseur de service requiert l'accès aux informations des scopes "<scopeType>"
    Et que je navigue sur la page fournisseur de service
    Et que je clique sur le bouton FranceConnect
    Et que je suis redirigé vers la page sélection du fournisseur d'identité
    Et que j'utilise un fournisseur d'identité "actif"
    Et que je clique sur le fournisseur d'identité
    Et que je suis redirigé vers la page login du fournisseur d'identité
    Quand je m'authentifie avec succès
    Et je suis redirigé vers la page confirmation de connexion
    Et les informations demandées par le fournisseur de service correspondent aux scopes "<scopeType>"
    Et je continue sur le fournisseur de service
    Alors je suis redirigé vers la page fournisseur de service
    Et je suis connecté
    Et le fournisseur de service a accès aux informations des scopes "<scopeType>"

    Exemples:
      | scopeType                 |
      | tous les scopes           |
      | profile sans alias        |
      | identite_pivot sans alias |
      | birth                     |
      | profile                   |
      | identite_pivot            |

  Scénario: Connexion d'un usager - scope anonyme
    Etant donné que le fournisseur de service requiert l'accès aux informations du scope "anonyme"
    Et que je navigue sur la page fournisseur de service
    Et que je clique sur le bouton FranceConnect
    Et que je suis redirigé vers la page sélection du fournisseur d'identité
    Et que j'utilise un fournisseur d'identité "actif"
    Et que je clique sur le fournisseur d'identité
    Et que je suis redirigé vers la page login du fournisseur d'identité
    Quand je m'authentifie avec succès
    Et je suis redirigé vers la page confirmation de connexion
    Et aucune information n'est demandée par le fournisseur de service pour le scope "anonyme"
    Et je continue sur le fournisseur de service
    Alors je suis redirigé vers la page fournisseur de service
    Et je suis connecté
    Et le fournisseur de service a accès aux informations du scope "anonyme"

  Scénario: Connexion d'un usager - attribut scope inconnu ignoré
    Etant donné que le fournisseur de service requiert l'accès aux informations des scopes "profile avec scope inconnu"
    Et que je navigue sur la page fournisseur de service
    Et que je clique sur le bouton FranceConnect
    Et que je suis redirigé vers la page sélection du fournisseur d'identité
    Et que j'utilise un fournisseur d'identité "actif"
    Et que je clique sur le fournisseur d'identité
    Et que je suis redirigé vers la page login du fournisseur d'identité
    Quand je m'authentifie avec succès
    Et je suis redirigé vers la page confirmation de connexion
    Et les informations demandées par le fournisseur de service correspondent aux scopes "profile"
    Et je continue sur le fournisseur de service
    Alors je suis redirigé vers la page fournisseur de service
    Et je suis connecté
    Et le fournisseur de service a accès aux informations des scopes "profile"

  Scénario: Connexion d'un usager - erreur scope vide
    Etant donné que le fournisseur de service a configuré sa requête authorize avec un scope "vide"
    Et que je navigue sur la page fournisseur de service
    Quand je clique sur le bouton FranceConnect
    Alors je suis redirigé vers la page erreur du fournisseur de service
    Et le titre de l'erreur fournisseur de service est "invalid_request"
    Et la description de l'erreur fournisseur de service est "openid scope must be requested when using the acr_values parameter"

  Scénario: Connexion d'un usager - erreur scope openid manquant
    Etant donné que le fournisseur de service a configuré sa requête authorize avec un scope "profile sans openid"
    Et que je navigue sur la page fournisseur de service
    Quand je clique sur le bouton FranceConnect
    Alors je suis redirigé vers la page erreur du fournisseur de service
    Et le titre de l'erreur fournisseur de service est "invalid_request"
    Et la description de l'erreur fournisseur de service est "openid scope must be requested when using the acr_values parameter"

  @ignoreLow
  Scénario: Connexion d'un usager - erreur FS non habilité pour ce scope
    Etant donné que j'utilise le fournisseur de service "habilité à demander le scope identite_pivot"
    Et que le fournisseur de service requiert l'accès aux informations du scope "email"
    Et que je navigue sur la page fournisseur de service
    Quand je clique sur le bouton FranceConnect
    Alors je suis redirigé vers la page erreur du fournisseur de service
    Et le titre de l'erreur fournisseur de service est "invalid_scope"
    Et la description de l'erreur fournisseur de service est "requested scope is not allowed"
