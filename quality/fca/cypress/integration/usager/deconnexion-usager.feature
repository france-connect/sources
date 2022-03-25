#language: fr
@usager @deconnexionUsager
Fonctionnalité: Deconnexion Usager
  # En tant qu'usager d'un fournisseur de service,
  # je veux me déconnecter du fournisseur de service, d'agent connect et du fournisseur d'identité
  # afin de clore ma session

  Scénario: Deconnexion d'un usager
    Etant donné que le fournisseur de service requiert l'accès aux informations du scope "tous les scopes"
    Et que je navigue sur la page fournisseur de service
    Et que je clique sur le bouton AgentConnect
    Et que je suis redirigé vers la page sélection du fournisseur d'identité
    Et que j'utilise un fournisseur d'identité "actif"
    Et que je cherche le fournisseur d'identité par son ministère
    Et que je clique sur le fournisseur d'identité
    Et que je suis redirigé vers la page login du fournisseur d'identité
    Et que je m'authentifie avec succès
    Et que je suis redirigé vers la page fournisseur de service
    Et que je suis connecté
    Quand je me déconnecte du fournisseur de service
    Alors je suis déconnecté du fournisseur d'identité
    Et la session AgentConnect est détruite
    Et je suis déconnecté du fournisseur de service
