#language: fr
# Fonctionnalité désactivée sur AgentConnect integ01
@usager @connexionIdentitePersonnalisee @ci @ignoreInteg01
Fonctionnalité: Connexion Usager personalisée bac à sable
  # En tant que partenaire,
  # je veux me connecter avec une identité personalisée dans la bac à sable

  Scénario: Connexion Usager
    Etant donné que le fournisseur de service requiert l'accès aux informations des scopes "tous les scopes"
    Et que je navigue sur la page fournisseur de service
    Et que je clique sur le bouton AgentConnect
    Et que je suis redirigé vers la page interaction
    Et que j'entre l'email "test@fia1.fr"
    Et que je clique sur le bouton de connexion
    Et que je suis redirigé vers la page login du fournisseur d'identité
    Et que j'utilise un compte usager "personnalisé"
    Quand je saisi manuellement l'identité de l'utilisateur
    Alors je suis redirigé vers la page fournisseur de service
    Et je suis connecté au fournisseur de service
    Et le fournisseur de service a accès aux informations du scope "tous les scopes"