#language: fr
@usager @fiSelection @fcpHigh
Fonctionnalité: Fournisseur Identité - Sélection - fcp-high
  # En tant qu'usager d'un fournisseur de service,
  # je veux visualiser la liste des fournisseurs d'identité disponibles
  # afin de me connecter au service

  @ignoreInteg01
  Scénario: Affichage des FI sur la mire - FI eidas2/eidas3 disponibles pour une cinématique FS eidas2
    Etant donné que le fournisseur de service requiert un niveau de sécurité "eidas2"
    Et que je navigue sur la page fournisseur de service
    Quand je clique sur le bouton FranceConnect
    Alors je suis redirigé vers la page sélection du fournisseur d'identité
    Et j'utilise un fournisseur d'identité avec niveau de sécurité "eidas2", chiffrement "" et signature "ES256"
    Et le fournisseur d'identité est actif dans la mire
    Et j'utilise un fournisseur d'identité avec niveau de sécurité "eidas2", chiffrement "RSA-OAEP,A256GCM" et signature "ES256"
    Et le fournisseur d'identité est actif dans la mire
    Et j'utilise un fournisseur d'identité avec niveau de sécurité "eidas2", chiffrement "ECDH-ES,A256GCM" et signature "RS256"
    Et le fournisseur d'identité est actif dans la mire
    Et j'utilise un fournisseur d'identité avec niveau de sécurité "eidas3", chiffrement "" et signature "RS256"
    Et le fournisseur d'identité est actif dans la mire
    Et j'utilise un fournisseur d'identité avec niveau de sécurité "eidas3", chiffrement "RSA-OAEP,A256GCM" et signature "RS256"
    Et le fournisseur d'identité est actif dans la mire
    Et j'utilise un fournisseur d'identité avec niveau de sécurité "eidas3", chiffrement "ECDH-ES,A256GCM" et signature "ES256"
    Et le fournisseur d'identité est actif dans la mire

  @ignoreInteg01
  Scénario:  Affichage des FI sur la mire - FI eidas2 indisponibles pour une cinématique FS eidas3
    Etant donné que le fournisseur de service requiert un niveau de sécurité "eidas3"
    Et que je navigue sur la page fournisseur de service
    Quand je clique sur le bouton FranceConnect
    Alors je suis redirigé vers la page sélection du fournisseur d'identité
    Et j'utilise un fournisseur d'identité avec niveau de sécurité "eidas2", chiffrement "" et signature "ES256"
    Et le fournisseur d'identité est désactivé dans la mire
    Et j'utilise un fournisseur d'identité avec niveau de sécurité "eidas2", chiffrement "RSA-OAEP,A256GCM" et signature "ES256"
    Et le fournisseur d'identité est désactivé dans la mire
    Et j'utilise un fournisseur d'identité avec niveau de sécurité "eidas2", chiffrement "ECDH-ES,A256GCM" et signature "RS256"
    Et le fournisseur d'identité est désactivé dans la mire
    Et j'utilise un fournisseur d'identité avec niveau de sécurité "eidas3", chiffrement "" et signature "RS256"
    Et le fournisseur d'identité est actif dans la mire
    Et j'utilise un fournisseur d'identité avec niveau de sécurité "eidas3", chiffrement "RSA-OAEP,A256GCM" et signature "RS256"
    Et le fournisseur d'identité est actif dans la mire
    Et j'utilise un fournisseur d'identité avec niveau de sécurité "eidas3", chiffrement "ECDH-ES,A256GCM" et signature "ES256"
    Et le fournisseur d'identité est actif dans la mire

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

  @ci
  Scénario: Affichage des FI sur la mire - FI désactivé non sélectionnable
    Etant donné que j'utilise un fournisseur d'identité "désactivé et visible"
    Et que je navigue sur la page fournisseur de service
    Et que je clique sur le bouton FranceConnect
    Et que je suis redirigé vers la page sélection du fournisseur d'identité
    Et que le fournisseur d'identité est désactivé dans la mire
    Quand je clique sur le fournisseur d'identité
    Alors je ne suis pas redirigé vers la page login du fournisseur d'identité

  @ci
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

  @ci
  Scénario: Connexion d'un usager - erreur connexion abandonnée
    Etant donné que je navigue sur la page fournisseur de service
    Et que je clique sur le bouton FranceConnect
    Et que je suis redirigé vers la page sélection du fournisseur d'identité
    Quand je clique sur le lien retour vers le fournisseur de service
    Alors je suis redirigé vers la page erreur du fournisseur de service
    Et le titre de l'erreur fournisseur de service est "access_denied"
    Et la description de l'erreur fournisseur de service est "User auth aborted"
