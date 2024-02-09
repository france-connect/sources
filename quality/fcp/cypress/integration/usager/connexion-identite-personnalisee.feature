#language: fr
@usager @connexionIdentitePersonnalisee @ci
Fonctionnalité: Connexion Usager personalisée bac à sable
  # En tant que partenaire,
  # je veux me connecter avec une identité personalisée dans la bac à sable

  Scénario: Connexion Usager
    Etant donné que le fournisseur de service requiert l'accès aux informations des scopes "tous les scopes"
    Et que je navigue sur la page fournisseur de service
    Et que je clique sur le bouton FranceConnect
    Et que je suis redirigé vers la page sélection du fournisseur d'identité
    Et que j'utilise un fournisseur d'identité "actif"
    Et que je clique sur le fournisseur d'identité
    Et que je suis redirigé vers la page login du fournisseur d'identité
    Et que j'utilise un compte usager "personnalisé"
    Quand je saisi manuellement l'identité de l'utilisateur
    Et je suis redirigé vers la page confirmation de connexion
    Et les informations demandées par le fournisseur de service correspondent au scope "tous les scopes"
    Et je continue sur le fournisseur de service
    Alors je suis redirigé vers la page fournisseur de service
    Et je suis connecté au fournisseur de service
    Et le fournisseur de service a accès aux informations du scope "tous les scopes"