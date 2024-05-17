# language: fr

@usager @ci
Fonctionnalité: Connexion Usager - Aucun FI disponible

  Scénario: J'utilise un fournisseur d'identité blacklisté
    Etant donné que j'utilise un fournisseur de service "avec accès au FI par défaut (premier FS)"
    Et que je navigue sur la page fournisseur de service
    Et que je clique sur le bouton AgentConnect
    Et que j'entre l'email "test@fia3.fr"
    Quand je clique sur le bouton de connexion
    Alors je suis redirigé vers la page erreur technique
    Et le code d'erreur est "Y500023"

  Scénario: J'utilise un fournisseur d'identité désactivé mais non blacklisté
    Etant donné que j'utilise un fournisseur de service "par défaut"
    Et que je navigue sur la page fournisseur de service
    Et que je clique sur le bouton AgentConnect
    Et que j'entre l'email "test@fia7.fr"
    Quand je clique sur le bouton de connexion
    Alors je suis redirigé vers la page erreur technique
    Et le titre de la page d'erreur est "Accès indisponible"
    Et le code d'erreur est "Y500017"

  # use this test only when using core-fca-rie
  @ignore
  Scénario: J'utilise un fqdn ne redirigeant vers aucun FI et il n'y a pas de FI par défaut
    Etant donné que j'utilise un fournisseur de service "avec accès au FI par défaut (premier FS)"
    Et que j'utilise le fournisseur d'identité "par défaut"
    Et que je navigue sur la page fournisseur de service
    Et que je clique sur le bouton AgentConnect
    Et que j'entre l'email "test@unknown.fr"
    Quand je clique sur le bouton de connexion
    Alors je suis redirigé vers la page erreur technique
    Et le titre de la page d'erreur est "Accès indisponible"
    Et le code d'erreur est "Y500001"
