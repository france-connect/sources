#language: fr
@usager @fiBlacklistWhitelist @fcpHigh @ci
Fonctionnalité: Fournisseur Identité - Blacklist et Whitelist - fcp-high
  # En tant que fournisseur de service,
  # je veux que seuls les fournisseurs d'identité whitelistés ou non blacklistés soient disponibles
  # afin de contrôler les accès à mon service

  # Aucun FS avec FI blacklisté en integ01
  @ignoreInteg01
  Scénario: Blacklist de FI - FI blacklistés affichés comme indisponibles
    Etant donné que j'utilise un fournisseur de service "avec une blacklist de FI"
    Et que le fournisseur de service requiert l'accès aux informations du scope "identite_pivot"
    Et que je navigue sur la page fournisseur de service
    Quand je clique sur le bouton FranceConnect
    Alors je suis redirigé vers la page sélection du fournisseur d'identité
    Et j'utilise un fournisseur d'identité "blacklisté"
    Et le fournisseur d'identité est désactivé dans la mire
    Et j'utilise un fournisseur d'identité "non blacklisté"
    Et le fournisseur d'identité est actif dans la mire

  # Aucun FS avec FI blacklisté en integ01
  @ignoreInteg01
  Scénario: Blacklist de FI - erreur si on force la connexion via un FI blacklisté
    Etant donné que j'utilise un fournisseur de service "avec une blacklist de FI"
    Et que le fournisseur de service requiert l'accès aux informations des scopes "profile"
    Et que je navigue sur la page fournisseur de service
    Et que je clique sur le bouton FranceConnect
    Et que je suis redirigé vers la page sélection du fournisseur d'identité
    Et que j'utilise un fournisseur d'identité "blacklisté"
    Et que le fournisseur d'identité est désactivé dans la mire
    Quand je force l'utilisation du fournisseur d'identité
    Alors je suis redirigé vers la page erreur technique FranceConnect
    Et le code d'erreur FranceConnect est "Y020023"
    Et le message d'erreur FranceConnect est "Une erreur technique est survenue, fermez l’onglet de votre navigateur et reconnectez-vous."

  Scénario: Whitelist de FI - FI non whitelistés affichés comme indisponibles
    Etant donné que j'utilise un fournisseur de service "avec une whitelist de FI"
    Et que le fournisseur de service requiert l'accès aux informations du scope "identite_pivot"
    Et que je navigue sur la page fournisseur de service
    Quand je clique sur le bouton FranceConnect
    Alors je suis redirigé vers la page sélection du fournisseur d'identité
    Et j'utilise un fournisseur d'identité "non whitelisté"
    Et le fournisseur d'identité est désactivé dans la mire
    Et j'utilise un fournisseur d'identité "whitelisté"
    Et le fournisseur d'identité est actif dans la mire

  Scénario: Whitelist de FI - erreur si on force la connexion via un FI non whitelisté
    Etant donné que j'utilise un fournisseur de service "avec une whitelist de FI"
    Et que le fournisseur de service requiert l'accès aux informations des scopes "profile"
    Et que je navigue sur la page fournisseur de service
    Et que je clique sur le bouton FranceConnect
    Et que je suis redirigé vers la page sélection du fournisseur d'identité
    Et que j'utilise un fournisseur d'identité "non whitelisté"
    Et que le fournisseur d'identité est désactivé dans la mire
    Quand je force l'utilisation du fournisseur d'identité
    Alors je suis redirigé vers la page erreur technique FranceConnect
    Et le code d'erreur FranceConnect est "Y020023"
    Et le message d'erreur FranceConnect est "Une erreur technique est survenue, fermez l’onglet de votre navigateur et reconnectez-vous."
