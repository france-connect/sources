#language: fr
@usager @connexionPartenaires @ignoreDocker
Fonctionnalité: Connexion Partenaires
  # En tant qu'usager d'un fournisseur de service partenaire,
  # je veux me connecter en utilisant un fournisseur d'identité partenaire
  # afin d'accéder à mon service

  @ignore
  Scénario: Connexion d'un usager - Osmose avec FI mock
    Etant donné que j'utilise le fournisseur de service "osmose"
    Et que je navigue sur la page fournisseur de service
    Et que je clique sur le bouton AgentConnect
    Et que je suis redirigé vers la page interaction
    Et que j'utilise le fournisseur d'identité "par défaut"
    Et que j'entre l'email "test@fia1.fr"
    Quand je clique sur le bouton de connexion
    Et que je suis redirigé vers la page login du fournisseur d'identité
    Et que je m'authentifie avec succès
    Alors je suis redirigé vers la page fournisseur de service
    Et je suis connecté au fournisseur de service
