#language: fr
@usager @connexionClaims @ci
Fonctionnalité: Connexion avec LocalStorage
  # En tant qu'usager d'un fournisseur de service,
  # je veux me connecter sans avoir à écrire mon email après m'être connecté une première fois
  # afin d'accéder à mon service

  Scénario: Connexion avec LocalStorage - avec email et interruption
    Etant donné que le fournisseur de service requiert l'accès aux informations du scope "tous les scopes"
    Et que je navigue sur la page fournisseur de service
    Et que je clique sur le bouton AgentConnect
    Et que je suis redirigé vers la page interaction
    Et que j'entre l'email "<email>"
    Et que je clique sur le bouton de connexion
    Et que j'utilise le fournisseur d'identité "<fi>"
    Et que je suis redirigé vers la page login du fournisseur d'identité
    Quand je navigue sur la page fournisseur de service
    Et que je clique sur le bouton AgentConnect
    Et que je suis redirigé vers la page interaction
    Alors le champ email correspond à "<email>"
    Et je clique sur le bouton de connexion
    Et je suis redirigé vers la page login du fournisseur d'identité

    Exemples:
      | email                        | fi           |
      | albus.dumbledore@hogwarts.uk | moncomptepro |
      | albus.dumbledore@fia1.fr     | par défaut   |
