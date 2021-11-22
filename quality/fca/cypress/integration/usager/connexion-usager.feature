#language: fr
@usager @connexionUsager
Fonctionnalité: Connexion Usager
  # En tant qu'usager d'un fournisseur de service,
  # je veux me connecter en utilisant un fournisseur d'identité
  # afin d'accéder à mon service

  Scénario: Connexion d'un usager - recherche FI par ministère
    Etant donné que le fournisseur de service requiert l'accès aux informations du scope "tous les scopes"
    Et que je navigue sur la page fournisseur de service
    Et que je clique sur le bouton AgentConnect
    Et que je suis redirigé vers la page sélection du fournisseur d'identité
    Et que j'utilise un fournisseur d'identité "actif"
    Quand je cherche le fournisseur d'identité par son ministère
    Et je clique sur le fournisseur d'identité
    Et je suis redirigé vers la page login du fournisseur d'identité
    Et je m'authentifie avec succès
    Alors je suis redirigé vers la page fournisseur de service
    Et je suis connecté
    Et le fournisseur de service a accès aux informations du scope "tous les scopes"

  Plan du Scénario: Connexion d'un usager - FI avec signature <signature>
    Etant donné que j'utilise le fournisseur de service "par défaut"
    Et que le fournisseur de service requiert l'accès aux informations des scopes "obligatoires"
    Et que j'utilise un fournisseur d'identité avec niveau de sécurité "eidas1" et signature "<signature>"
    Et que je navigue sur la page fournisseur de service
    Et que je clique sur le bouton AgentConnect
    Et que je suis redirigé vers la page sélection du fournisseur d'identité
    Et que je cherche le fournisseur d'identité par son ministère
    Et que je clique sur le fournisseur d'identité
    Et que je suis redirigé vers la page login du fournisseur d'identité
    Quand je m'authentifie avec succès
    Alors je suis redirigé vers la page fournisseur de service
    Et je suis connecté
    Et le fournisseur de service a accès aux informations des scopes "obligatoires"

    Exemples:
      | signature |
      | ES256     |
      | HS256     |
      | RS256     |
