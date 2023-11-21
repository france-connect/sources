#language: fr
@usager @fcpLow @connexionSSO @ci
Fonctionnalité: Connexion Usager - SSO - FCP Low
  # En tant qu'agent,
  # je souhaite bénéficier d'une authentification unique sur FranceConnect
  # afin de naviguer sur différents FS sans avoir à me ré-authentifier

  Scénario: Connexion SSO - FCP Low - deux FS avec accès au même FI
    Etant donné que j'utilise un fournisseur de service "avec accès au FI par défaut (premier FS)"
    Et que j'utilise le fournisseur d'identité "par défaut"
    Et que je navigue sur la page fournisseur de service
    Et que je me connecte à FranceConnect
    Et que je suis redirigé vers la page fournisseur de service
    Et que je suis connecté au fournisseur de service
    Et que j'utilise un fournisseur de service "avec accès au FI par défaut (deuxième FS)"
    Et que je navigue sur la page fournisseur de service
    Quand je clique sur le bouton FranceConnect
    Alors je suis redirigé vers la page d'information
    Et je continue sur le fournisseur de service
    Et je suis connecté au fournisseur de service

  @ignoreInteg01
  Scénario: Connexion SSO - FCP Low - deuxième FS sans accès au FI
    Etant donné que j'utilise un fournisseur de service "avec accès exclusif à un FI"
    Et que j'utilise le fournisseur d'identité "disponible que pour un FS"
    Et que je navigue sur la page fournisseur de service
    Et que je me connecte à FranceConnect
    Et que je suis redirigé vers la page fournisseur de service
    Et que je suis connecté au fournisseur de service
    Et que j'utilise un fournisseur de service "par défaut"
    Et que je navigue sur la page fournisseur de service
    Quand je clique sur le bouton FranceConnect
    Alors je suis redirigé vers la page sélection du fournisseur d'identité
    Et le fournisseur d'identité est désactivé dans la liste

  @ignoreInteg01
  Scénario: Connexion SSO - FCP Low - deuxième FS utilise un autre FI
    Etant donné que j'utilise un fournisseur de service "avec accès exclusif à un FI"
    Et que j'utilise le fournisseur d'identité "disponible que pour un FS"
    Et que je navigue sur la page fournisseur de service
    Et que je me connecte à FranceConnect
    Et que je suis redirigé vers la page fournisseur de service
    Et que je suis connecté au fournisseur de service
    Et que j'utilise un fournisseur de service "par défaut"
    Et que je navigue sur la page fournisseur de service
    Et que je clique sur le bouton FranceConnect
    Et que je suis redirigé vers la page sélection du fournisseur d'identité
    Et que j'utilise un fournisseur d'identité "par défaut"
    Et que je clique sur le fournisseur d'identité
    Et que je suis redirigé vers la page login du fournisseur d'identité
    Quand je m'authentifie avec succès
    Alors je suis redirigé vers la page d'information
    Et je continue sur le fournisseur de service
    Et je suis connecté au fournisseur de service

  @ignoreInteg01
  Scénario: Connexion SSO - FCP Low - troisième FS utilise SSO après une cinématique non terminée (arrêt MIRE)
    Etant donné que j'utilise un fournisseur de service "avec accès au FI par défaut (premier FS)"
    Et que j'utilise le fournisseur d'identité "par défaut"
    Et que je navigue sur la page fournisseur de service
    Et que je me connecte à FranceConnect
    Et que je suis redirigé vers la page fournisseur de service
    Et que je suis connecté au fournisseur de service
    Et que j'utilise un fournisseur de service "sans accès au FI par défaut"
    Et que je navigue sur la page fournisseur de service
    Et que je clique sur le bouton FranceConnect
    Et que je suis redirigé vers la page sélection du fournisseur d'identité
    Et que j'utilise un fournisseur de service "avec accès au FI par défaut (deuxième FS)"
    Et que je navigue sur la page fournisseur de service
    Quand je clique sur le bouton FranceConnect
    Alors je suis redirigé vers la page d'information
    Et je continue sur le fournisseur de service
    Et je suis connecté au fournisseur de service

  @ignoreInteg01
  Scénario: Connexion SSO - FCP Low - troisième FS utilise SSO après une cinématique non terminée (arrêt page consentement)
    Etant donné que j'utilise un fournisseur de service "avec accès au FI par défaut (premier FS)"
    Et que j'utilise le fournisseur d'identité "par défaut"
    Et que je navigue sur la page fournisseur de service
    Et que je me connecte à FranceConnect
    Et que je suis redirigé vers la page fournisseur de service
    Et que je suis connecté au fournisseur de service
    Et que j'utilise un fournisseur de service "sans accès au FI par défaut"
    Et que j'utilise un fournisseur d'identité "disponible que pour un FS"
    Et que je navigue sur la page fournisseur de service
    Et que je me connecte au fournisseur d'identité
    Et que je suis redirigé vers la page confirmation de connexion
    Et que j'utilise un fournisseur de service "avec accès au FI par défaut (deuxième FS)"
    Et que j'utilise le fournisseur d'identité "par défaut"
    Et que je navigue sur la page fournisseur de service
    Quand je clique sur le bouton FranceConnect
    Alors je suis redirigé vers la page sélection du fournisseur d'identité

  Scénario: Connexion SSO - FCP Low - déconnexion d'un FS seulement et SSO terminé
    Etant donné que j'utilise un fournisseur de service "avec accès au FI par défaut (premier FS)"
    Et que j'utilise le fournisseur d'identité "par défaut"
    Et que je navigue sur la page fournisseur de service
    Et que je me connecte à FranceConnect
    Et que je suis redirigé vers la page fournisseur de service
    Et que je suis connecté au fournisseur de service
    Et que j'utilise un fournisseur de service "avec accès au FI par défaut (deuxième FS)"
    Et que je navigue sur la page fournisseur de service
    Et que je clique sur le bouton FranceConnect
    Et que je suis redirigé vers la page d'information
    Et que je continue sur le fournisseur de service
    Et que je suis connecté au fournisseur de service
    Et que j'utilise un fournisseur de service "avec accès au FI par défaut (premier FS)"
    Et que je navigue sur la page fournisseur de service
    Et que je suis connecté au fournisseur de service
    Quand je me déconnecte du fournisseur de service et du fournisseur d'identité
    Alors je suis déconnecté du fournisseur de service
    Et je clique sur le bouton FranceConnect
    Et je suis redirigé vers la page sélection du fournisseur d'identité
    Et j'utilise un fournisseur de service "avec accès au FI par défaut (deuxième FS)"
    Et je navigue sur la page fournisseur de service
    Et je suis connecté au fournisseur de service

  @ignoreInteg01
  Scénario: Connexion SSO - FCP Low - deux FS avec accès au même FI ayant chacun son propre sub
    Etant donné que j'utilise un fournisseur de service "avec accès au FI par défaut (premier FS)"
    Et que j'utilise le fournisseur d'identité "par défaut"
    Et que je navigue sur la page fournisseur de service
    Et que je me connecte à FranceConnect
    Et que je suis redirigé vers la page fournisseur de service
    Et que je suis connecté au fournisseur de service
    Et que je mémorise le sub envoyé au fournisseur de service
    Et que j'utilise un fournisseur de service "avec un entityId différent"
    Et que je navigue sur la page fournisseur de service
    Et que je clique sur le bouton FranceConnect
    Et que je suis redirigé vers la page de consentement
    Et que je consens à transmettre mes informations au fournisseur de service
    Et que je continue sur le fournisseur de service
    Et que je suis connecté au fournisseur de service
    Et que le sub transmis au fournisseur de service est différent du sub mémorisé
    Et que j'utilise un fournisseur de service "avec accès au FI par défaut (premier FS)"
    Et que j'utilise le fournisseur d'identité "par défaut"
    Et que je navigue sur la page fournisseur de service
    Quand je redemande les informations de l'usager
    Alors je suis redirigé vers la page fournisseur de service
    Et le sub transmis au fournisseur de service est identique au sub mémorisé