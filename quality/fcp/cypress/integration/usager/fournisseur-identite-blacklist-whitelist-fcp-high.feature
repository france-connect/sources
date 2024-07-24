#language: fr
@usager @fiBlacklistWhitelist @fcpHigh @ci
Fonctionnalité: Fournisseur Identité - Blacklist et Whitelist - fcp-high
  # En tant que fournisseur de service,
  # je veux que seuls les fournisseurs d'identité whitelistés ou non blacklistés soient disponibles
  # afin de contrôler les accès à mon service

  # Aucun FS avec FI blacklisté en integ01
  @ignoreInteg01
  Scénario: Affichage des FI sur la mire - aucun FI de blacklist du FS
    Etant donné que j'utilise un fournisseur de service "avec une blacklist de FI"
    Et que le fournisseur de service requiert l'accès aux informations du scope "identite_pivot"
    Et que je navigue sur la page fournisseur de service
    Quand je clique sur le bouton FranceConnect
    Alors je suis redirigé vers la page sélection du fournisseur d'identité
    Et j'utilise un fournisseur d'identité "blacklisté"
    Et le fournisseur d'identité n'est pas affiché dans la mire
    Et j'utilise un fournisseur d'identité "non blacklisté"
    Et le fournisseur d'identité est affiché dans la mire

  Scénario: Affichage des FI sur la mire - seulement les FI de whitelist du FS
    Etant donné que j'utilise un fournisseur de service "avec une whitelist de FI"
    Et que le fournisseur de service requiert l'accès aux informations du scope "identite_pivot"
    Et que je navigue sur la page fournisseur de service
    Quand je clique sur le bouton FranceConnect
    Alors je suis redirigé vers la page sélection du fournisseur d'identité
    Et j'utilise un fournisseur d'identité "non whitelisté"
    Et le fournisseur d'identité n'est pas affiché dans la mire
    Et j'utilise un fournisseur d'identité "whitelisté"
    Et le fournisseur d'identité est affiché dans la mire
