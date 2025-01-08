#language: fr  
@usager @connexionUsager @ci
Fonctionnalité: Connexion Usager personnalisé
  # En tant qu'usager d'un fournisseur de service,
  # je veux me connecter avec un compte personnalisé
  
  @ignoreInteg01
  Scénario: Connexion d'un usager - identité personnalisée
    Etant donné que le fournisseur de service requiert l'accès aux informations des scopes "tous les scopes"
    Et que je navigue sur la page fournisseur de service
    Et que je clique sur le bouton AgentConnect
    Et que je suis redirigé vers la page interaction
    Et que j'entre l'email "test@fia1.fr"
    Et que je clique sur le bouton de connexion
    Et que je suis redirigé vers la page login du fournisseur d'identité
    Et que j'utilise un compte usager "personnalisé"
    Quand je saisis manuellement l'identité de l'utilisateur
    Alors je suis redirigé vers la page fournisseur de service
    Et je suis connecté au fournisseur de service
    Et le fournisseur de service a accès aux informations du scope "tous les scopes"

  @ignoreInteg01 
  Scénario: Connexion d'un usager - claim phone_number non renvoyé si mauvais format
    Etant donné que j'utilise un compte usager "personnalisé avec téléphone incorrect"
    Et que le fournisseur de service requiert l'accès aux informations des scopes "tous les scopes"
    Et que je navigue sur la page fournisseur de service
    Et que je clique sur le bouton AgentConnect
    Et que je suis redirigé vers la page interaction
    Et que j'entre l'email "test@fia1.fr"
    Et que je clique sur le bouton de connexion
    Et que je suis redirigé vers la page login du fournisseur d'identité
    Quand je saisis manuellement l'identité de l'utilisateur
    Alors je suis redirigé vers la page fournisseur de service
    Et je suis connecté au fournisseur de service
    Et le fournisseur de service a accès aux informations du scope "tous les scopes sauf phone"
