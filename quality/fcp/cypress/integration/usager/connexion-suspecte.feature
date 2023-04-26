#language: fr
@usager @connexionSuspecte @ci @ignoreInteg01
Fonctionnalité: Connexion Suspecte
  # En tant qu'usager initiateur d'une connexion "suspecte"
  # je veux pouvoir utiliser un fournisseur d'identité niveau substentiel ou élevé
  # (les FI niveau eIDAS faible seront marqués indisponibles)
  # afin de pouvoir accéder à mon fournisseur de service

  @fcpLow
  Scénario: Connexion Suspecte - Affichage de la mire avec FI niveau eidas1 non présent
    Etant donné que je navigue sur la page fournisseur de service
    Quand j'initie une connexion suspecte à FranceConnect low
    Alors je suis redirigé vers la page sélection du fournisseur d'identité
    Et j'utilise un fournisseur d'identité avec niveau de sécurité "eidas1"
    Et le fournisseur d'identité est désactivé dans la mire
    Et j'utilise un fournisseur d'identité avec niveau de sécurité "eidas2"
    Et le fournisseur d'identité est actif dans la mire

  @fcpLow
  Scénario: Connexion Suspecte - via FI niveau substentiel ou élevé
    Etant donné que je navigue sur la page fournisseur de service
    Et que j'initie une connexion suspecte à FranceConnect low
    Et que je suis redirigé vers la page sélection du fournisseur d'identité
    Et que j'utilise un fournisseur d'identité avec niveau de sécurité "eidas2"
    Et que je clique sur le fournisseur d'identité
    Et que je suis redirigé vers la page login du fournisseur d'identité
    Et que le fournisseur d'identité garantit un niveau de sécurité "eidas2"
    Quand je m'authentifie avec succès
    Et je suis redirigé vers la page confirmation de connexion
    Et je continue sur le fournisseur de service
    Alors je suis redirigé vers la page fournisseur de service
    Et je suis connecté au fournisseur de service
    Et la cinématique a utilisé le niveau de sécurité "eidas1"

  @fcpLow
  Scénario: Connexion Suspecte - via FI niveau substentiel ou élevé renvoyant un niveau de sécurité faible
    Etant donné que je navigue sur la page fournisseur de service
    Et que j'initie une connexion suspecte à FranceConnect low
    Et que je suis redirigé vers la page sélection du fournisseur d'identité
    Et que j'utilise un fournisseur d'identité avec niveau de sécurité "eidas2"
    Et que je clique sur le fournisseur d'identité
    Et que je suis redirigé vers la page login du fournisseur d'identité
    Et que le fournisseur d'identité garantit un niveau de sécurité "eidas1"
    Quand je m'authentifie avec succès
    Alors je suis redirigé vers la page erreur technique FranceConnect
    Et le code d'erreur FranceConnect est "Y000011"
    Et le message d'erreur FranceConnect est "Une erreur technique est survenue. Si le problème persiste, veuillez nous contacter."

  @fcpLow
  Scénario: Connexion Suspecte - via FI niveau faible bloquée
    Etant donné que je navigue sur la page fournisseur de service
    Et que j'initie une connexion suspecte à FranceConnect low
    Et que je suis redirigé vers la page sélection du fournisseur d'identité
    Et que j'utilise un fournisseur d'identité avec niveau de sécurité "eidas1"
    Et que le fournisseur d'identité est désactivé dans la mire
    Et que je force l'utilisation du fournisseur d'identité
    Et que je suis redirigé vers la page login du fournisseur d'identité
    Quand je m'authentifie avec succès
    Alors je suis redirigé vers la page erreur technique FranceConnect
    Et le code d'erreur FranceConnect est "Y000011"
    Et le message d'erreur FranceConnect est "Une erreur technique est survenue. Si le problème persiste, veuillez nous contacter."

  @fcpHigh
  Scénario: Connexion Suspecte - Affichage de la mire avec FI eidas2/eidas3 affichés pour une cinématique FS eidas2
    Etant donné que le fournisseur de service requiert un niveau de sécurité "eidas2"
    Et que je navigue sur la page fournisseur de service
    Quand j'initie une connexion suspecte à FranceConnect+
    Alors je suis redirigé vers la page sélection du fournisseur d'identité
    Et j'utilise un fournisseur d'identité avec niveau de sécurité "eidas2"
    Et le fournisseur d'identité est actif dans la mire
    Et j'utilise un fournisseur d'identité avec niveau de sécurité "eidas3"
    Et le fournisseur d'identité est actif dans la mire

  @fcpHigh
  Scénario: Connexion Suspecte - Affichage de la mire avec FI eidas3 seulement pour une cinématique FS eidas3
    Etant donné que le fournisseur de service requiert un niveau de sécurité "eidas3"
    Et que je navigue sur la page fournisseur de service
    Quand j'initie une connexion suspecte à FranceConnect+
    Alors je suis redirigé vers la page sélection du fournisseur d'identité
    Et j'utilise un fournisseur d'identité avec niveau de sécurité "eidas2"
    Et le fournisseur d'identité est désactivé dans la mire
    Et j'utilise un fournisseur d'identité avec niveau de sécurité "eidas3"
    Et le fournisseur d'identité est actif dans la mire
