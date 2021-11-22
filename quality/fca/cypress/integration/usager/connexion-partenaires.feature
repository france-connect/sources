#language: fr
@usager @connexionPartenaires
Fonctionnalité: Connexion Partenaires
  # En tant qu'usager d'un fournisseur de service partenaire,
  # je veux me connecter en utilisant un fournisseur d'identité partenaire
  # afin d'accéder à mon service

  @ignoreDocker @ignore
  Scénario: Connexion d'un usager - Osmose avec FI mock
    Etant donné que j'utilise le fournisseur de service "osmose"
    Et que je navigue sur la page fournisseur de service
    Et que je clique sur le bouton AgentConnect
    Et que je suis redirigé vers la page sélection du fournisseur d'identité
    Et que j'utilise le fournisseur d'identité "par défaut"
    Quand je cherche le fournisseur d'identité par son ministère
    Et je clique sur le fournisseur d'identité
    Et je suis redirigé vers la page login du fournisseur d'identité
    Et je m'authentifie avec succès
    Alors je suis redirigé vers la page fournisseur de service
    Et je suis connecté
