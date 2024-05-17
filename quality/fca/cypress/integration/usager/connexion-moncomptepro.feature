#language: fr
@usager @connexionMonComptePro @ignoreDocker
Fonctionnalité: Connexion Partenaires
  # En tant qu'usager d'un fournisseur de service partenaire,
  # je veux me connecter en utilisant moncomptepro iso integration
  # afin d'accéder à mon service

  Scénario: Connexion d'un usager - MonCompro Agent Public
    Etant donné que j'utilise le fournisseur de service "par défaut"
    Et que j'utilise un compte usager "pour moncomptepro"
    Et que je navigue sur la page fournisseur de service
    Et que je clique sur le bouton AgentConnect
    Et que je suis redirigé vers la page interaction
    Et que j'entre l'email "user@yopmail.com"
    Quand je clique sur le bouton de connexion
    Et que j'utilise le fournisseur d'identité "moncomptepro"
    Et que je suis redirigé vers la page login du fournisseur d'identité
    Et que je me connecte sur moncomptepro
    Et que je sélectionne une organisation publique
    Alors je suis redirigé vers la page fournisseur de service
    Et je suis connecté au fournisseur de service

  Scénario: Connexion d'un usager - MonCompro Privé
    Etant donné que j'utilise le fournisseur de service "par défaut"
    Et que j'utilise un compte usager "pour moncomptepro"
    Et que je navigue sur la page fournisseur de service
    Et que je clique sur le bouton AgentConnect
    Et que je suis redirigé vers la page interaction
    Et que j'entre l'email "user@yopmail.com"
    Quand je clique sur le bouton de connexion
    Et que j'utilise le fournisseur d'identité "moncomptepro"
    Et que je suis redirigé vers la page login du fournisseur d'identité
    Et que je me connecte sur moncomptepro
    Et que je sélectionne une organisation privée
    Alors je suis redirigé vers la page erreur technique
    Et le code d'erreur est "Y500015"
