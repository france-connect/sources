#language: fr
@usager @affichageFournisseurIdentité @fcpHigh
Fonctionnalité: Affichage Fournisseur Identité
  # En tant qu'usager d'un fournisseur de service,
  # je veux visualiser la liste des fournisseurs d'identité disponibles
  # afin de me connecter au service

  @ignoreInteg01
  Scénario: Affichage des FI sur la mire - FI eidas2/eidas3 affichés pour une cinématique FS eidas2
    Etant donné que le fournisseur de service requiert un niveau de sécurité "eidas2"
    Et que je navigue sur la page fournisseur de service
    Quand je clique sur le bouton FranceConnect
    Alors je suis redirigé vers la page sélection du fournisseur d'identité
    Et j'utilise un fournisseur d'identité avec niveau de sécurité "eidas2", chiffrement "" et signature "ES256"
    Et le fournisseur d'identité est affiché dans la mire
    Et j'utilise un fournisseur d'identité avec niveau de sécurité "eidas2", chiffrement "RSA-OAEP,A256GCM" et signature "ES256"
    Et le fournisseur d'identité est affiché dans la mire
    Et j'utilise un fournisseur d'identité avec niveau de sécurité "eidas2", chiffrement "ECDH-ES,A256GCM" et signature "RS256"
    Et le fournisseur d'identité est affiché dans la mire
    Et j'utilise un fournisseur d'identité avec niveau de sécurité "eidas3", chiffrement "" et signature "RS256"
    Et le fournisseur d'identité est affiché dans la mire
    Et j'utilise un fournisseur d'identité avec niveau de sécurité "eidas3", chiffrement "RSA-OAEP,A256GCM" et signature "RS256"
    Et le fournisseur d'identité est affiché dans la mire
    Et j'utilise un fournisseur d'identité avec niveau de sécurité "eidas3", chiffrement "ECDH-ES,A256GCM" et signature "ES256"
    Et le fournisseur d'identité est affiché dans la mire

  @ignoreInteg01
  Scénario:  Affichage des FI sur la mire - seulement FI eidas3 affichés pour une cinématique FS eidas3
    Etant donné que le fournisseur de service requiert un niveau de sécurité "eidas3"
    Et que je navigue sur la page fournisseur de service
    Quand je clique sur le bouton FranceConnect
    Alors je suis redirigé vers la page sélection du fournisseur d'identité
    Et j'utilise un fournisseur d'identité avec niveau de sécurité "eidas2", chiffrement "" et signature "ES256"
    Et le fournisseur d'identité n'est pas affiché dans la mire
    Et j'utilise un fournisseur d'identité avec niveau de sécurité "eidas2", chiffrement "RSA-OAEP,A256GCM" et signature "ES256"
    Et le fournisseur d'identité n'est pas affiché dans la mire
    Et j'utilise un fournisseur d'identité avec niveau de sécurité "eidas2", chiffrement "ECDH-ES,A256GCM" et signature "RS256"
    Et le fournisseur d'identité n'est pas affiché dans la mire
    Et j'utilise un fournisseur d'identité avec niveau de sécurité "eidas3", chiffrement "" et signature "RS256"
    Et le fournisseur d'identité est affiché dans la mire
    Et j'utilise un fournisseur d'identité avec niveau de sécurité "eidas3", chiffrement "RSA-OAEP,A256GCM" et signature "RS256"
    Et le fournisseur d'identité est affiché dans la mire
    Et j'utilise un fournisseur d'identité avec niveau de sécurité "eidas3", chiffrement "ECDH-ES,A256GCM" et signature "ES256"
    Et le fournisseur d'identité est affiché dans la mire

  Scénario: Affichage des FI sur la mire - aucun FI désactivé et non visible
    Etant donné que j'utilise un fournisseur d'identité "désactivé et non visible"
    Et que je navigue sur la page fournisseur de service
    Quand je clique sur le bouton FranceConnect
    Alors je suis redirigé vers la page sélection du fournisseur d'identité
    Et le fournisseur d'identité n'est pas affiché dans la mire

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

  Scénario: Affichage des FI sur la mire - FI désactivé non sélectionnable
    Etant donné que j'utilise un fournisseur d'identité "désactivé et visible"
    Et que je navigue sur la page fournisseur de service
    Et que je clique sur le bouton FranceConnect
    Et que je suis redirigé vers la page sélection du fournisseur d'identité
    Et que le fournisseur d'identité est désactivé dans la mire
    Quand je clique sur le fournisseur d'identité
    Alors je ne suis pas redirigé vers la page login du fournisseur d'identité

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
