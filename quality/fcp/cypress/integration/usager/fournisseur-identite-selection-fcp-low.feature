#language: fr
@usager @fiSelection @fcpLow
Fonctionnalité: Fournisseur Identité - Sélection - fcp-low
  # En tant qu'usager d'un fournisseur de service,
  # je veux visualiser la liste des fournisseurs d'identité disponibles
  # afin de me connecter au service

  @ignoreInteg01
  Scénario:  Affichage des FI sur la mire - FI eidas1 et supérieurs disponibles pour une cinématique FS eidas1
    Etant donné que le fournisseur de service requiert un niveau de sécurité "eidas1"
    Et que je navigue sur la page fournisseur de service
    Quand je clique sur le bouton FranceConnect
    Alors je suis redirigé vers la page sélection du fournisseur d'identité
    Et j'utilise un fournisseur d'identité avec niveau de sécurité "eidas1"
    Et le fournisseur d'identité est actif dans la mire
    Et j'utilise un fournisseur d'identité avec niveau de sécurité "eidas2"
    Et le fournisseur d'identité est actif dans la mire

  # configuration de FI manquante
  @ignoreInteg01
  Scénario: Affichage des FI sur la mire - aucun FI désactivé et non visible
    Etant donné que j'utilise un fournisseur d'identité "désactivé et non visible"
    Et que je navigue sur la page fournisseur de service
    Quand je clique sur le bouton FranceConnect
    Alors je suis redirigé vers la page sélection du fournisseur d'identité
    Et le fournisseur d'identité n'est pas affiché dans la mire

  # configuration de FI manquante
  @ignoreInteg01
  Scénario: Affichage des FI sur la mire - aucun FI actif et non visible
    Etant donné que j'utilise un fournisseur d'identité "actif et non visible"
    Et que je navigue sur la page fournisseur de service
    Quand je clique sur le bouton FranceConnect
    Alors je suis redirigé vers la page sélection du fournisseur d'identité
    Et le fournisseur d'identité n'est pas affiché dans la mire

  Scénario: Affichage des FI sur la mire - FI actif sélectionnable
    Etant donné que j'utilise un fournisseur d'identité "actif"
    Et que je navigue sur la page fournisseur de service
    Et que je clique sur le bouton FranceConnect
    Et que je suis redirigé vers la page sélection du fournisseur d'identité
    Et que le fournisseur d'identité est actif dans la mire
    Quand je clique sur le fournisseur d'identité
    Alors je suis redirigé vers la page login du fournisseur d'identité

  # configuration de FI manquante
  @ci @ignoreInteg01
  Scénario: Affichage des FI sur la mire - FI désactivé non sélectionnable
    Etant donné que j'utilise un fournisseur d'identité "désactivé et visible"
    Et que je navigue sur la page fournisseur de service
    Et que je clique sur le bouton FranceConnect
    Et que je suis redirigé vers la page sélection du fournisseur d'identité
    Et que le fournisseur d'identité est désactivé dans la mire
    Quand je clique sur le fournisseur d'identité
    Alors je ne suis pas redirigé vers la page login du fournisseur d'identité

  # configuration de FI manquante
  @ci @ignoreInteg01
  Scénario: Connexion d'un usager - erreur si on force la connexion via un FI désactivé
    Etant donné que je navigue sur la page fournisseur de service
    Et que je clique sur le bouton FranceConnect
    Et que je suis redirigé vers la page sélection du fournisseur d'identité
    Et que j'utilise un fournisseur d'identité "désactivé et visible"
    Et que le fournisseur d'identité est désactivé dans la mire
    Quand je force l'utilisation du fournisseur d'identité
    Alors je suis redirigé vers la page erreur technique FranceConnect
    Et le code d'erreur FranceConnect est "Y020017"
    Et le message d'erreur FranceConnect est "Une erreur technique est survenue, fermez l’onglet de votre navigateur et reconnectez-vous."

  Scénario: Connexion d'un usager - erreur si on force la connexion vers un FI inexistant
    Etant donné que je navigue sur la page fournisseur de service
    Et que je clique sur le bouton FranceConnect
    Et que je suis redirigé vers la page sélection du fournisseur d'identité
    Et que j'utilise un fournisseur d'identité "par défaut"
    Et que le fournisseur d'identité est actif dans la mire
    Quand je force l'utilisation d'un fournisseur d'identité inexistant
    Alors je suis redirigé vers la page erreur technique FranceConnect
    Et le code d'erreur FranceConnect est "Y020019"
    Et le message d'erreur FranceConnect est "Une erreur technique est survenue, fermez l’onglet de votre navigateur et reconnectez-vous."

  Scénario: Connexion d'un usager - erreur si on force la connexion via un FI avec un csrf invalide
    Etant donné que je navigue sur la page fournisseur de service
    Et que je clique sur le bouton FranceConnect
    Et que je suis redirigé vers la page sélection du fournisseur d'identité
    Et que j'utilise un fournisseur d'identité "par défaut"
    Et que le fournisseur d'identité est actif dans la mire
    Quand je force l'utilisation d'un fournisseur d'identité avec un csrf non valide
    Alors je suis redirigé vers la page erreur technique FranceConnect
    Et le code d'erreur FranceConnect est "Y470001"
    Et le message d'erreur FranceConnect est "Votre session a expiré ou est invalide, fermez l’onglet de votre navigateur et reconnectez-vous."
