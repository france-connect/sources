#language: fr
@usager @connexionClaims @ci
Fonctionnalité: Connexion avec Claims
  # En tant qu'usager d'un fournisseur de service,
  # je veux me connecter en utilisant un fournisseur d'identité
  # afin d'accéder à mon service

  Scénario: Connexion avec claims - avec claim AMR pwd
    Etant donné que le fournisseur de service requiert le claim "amr"
    Et que je navigue sur la page fournisseur de service
    Et que je clique sur le bouton AgentConnect
    Et que je suis redirigé vers la page sélection du fournisseur d'identité
    Et que je cherche le fournisseur d'identité par son ministère
    Et que je clique sur le fournisseur d'identité
    Et que je suis redirigé vers la page login du fournisseur d'identité
    Quand je m'authentifie avec succès
    Alors je suis redirigé vers la page fournisseur de service
    Et je suis connecté
    Et la cinématique a renvoyé l'amr "pwd"

  Scénario: Connexion avec claims - claim AMR absent si non demandé
    Etant donné que le fournisseur de service ne requiert pas le claim "amr"
    Et que je navigue sur la page fournisseur de service
    Et que je clique sur le bouton AgentConnect
    Et que je suis redirigé vers la page sélection du fournisseur d'identité
    Et que je cherche le fournisseur d'identité par son ministère
    Et que je clique sur le fournisseur d'identité
    Et que je suis redirigé vers la page login du fournisseur d'identité
    Quand je m'authentifie avec succès
    Alors je suis redirigé vers la page fournisseur de service
    Et je suis connecté
    Et la cinématique n'a pas renvoyé d'amr

  Scénario: Connexion avec claims - erreur FS non habilité pour amr
    Etant donné que j'utilise le fournisseur de service "non habilité à demander le claim amr"
    Et que le fournisseur de service requiert le claim "amr"
    Et que le fournisseur de service requiert l'accès aux informations des scopes "obligatoires"
    Et que je navigue sur la page fournisseur de service
    Et que je clique sur le bouton AgentConnect
    Alors je suis redirigé vers la page erreur technique
    Et le code d'erreur est "Y030009"
