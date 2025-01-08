#language: fr
@usager @aidantsConnect @ci
Fonctionnalité: Aidants Connect
  # En tant qu'usager d'un fournisseur de service,
  # je veux utiliser Aidants Connect
  # afin de me connecter au service

  @fcpHigh
  Scénario: Aidants Connect non présent sous la mire
    Etant donné que je navigue sur la page fournisseur de service
    Quand je clique sur le bouton FranceConnect
    Alors je suis redirigé vers la page sélection du fournisseur d'identité
    Et le bouton Aidants Connect n'est pas affiché sous la mire

  @fcpLow
  Scénario: Connexion via lien Aidants Connect depuis la mire
    Etant donné que j'utilise un fournisseur d'identité "Aidants Connect"
    Et que je navigue sur la page fournisseur de service
    Et que je clique sur le bouton FranceConnect
    Et que je suis redirigé vers la page sélection du fournisseur d'identité
    Et que le bouton Aidants Connect est affiché sous la mire
    Quand je clique sur le bouton Aidants Connect
    Alors je suis redirigé vers la page login du fournisseur d'identité

  @fcpLow @ignoreInteg01
  Scénario: Aidants Connect est présent sous la mire mais n'est pas actif
    Etant donné que j'utilise le fournisseur de service "sans accès au FI Aidants Connect"
    Et que je navigue sur la page fournisseur de service
    Quand je clique sur le bouton FranceConnect
    Alors je suis redirigé vers la page sélection du fournisseur d'identité
    Et le bouton Aidants Connect est affiché sous la mire
    Et le bouton Aidants Connect n'est pas actif

  @fcpLow @ignoreInteg01
  Scénario: TA01: Aidants Connect - FS sans périmètre associé
    Etant donné que j'utilise un fournisseur de service "sans périmètre Aidants Connect"
    Et que je navigue sur la page fournisseur de service
    Et que je clique sur le bouton FranceConnect
    Et que je suis redirigé vers la page sélection du fournisseur d'identité
    Et que j'utilise le fournisseur d'identité "Aidants Connect"
    Et que j'utilise un compte usager "personnalisé"
    Quand je clique sur le bouton Aidants Connect
    Et je suis redirigé vers la page login du fournisseur d'identité
    Et je m'authentifie sur Aidants Connect
    Alors je suis redirigé vers la page confirmation de connexion
    Et je continue sur le fournisseur de service
    Et je suis connecté au fournisseur de service

  @fcpLow @ignoreInteg01
  Scénario: TA03: Aidants Connect - FS avec périmètres Aidants Connect et mandat avec un périmètre
    Etant donné que j'utilise un fournisseur de service "avec les périmètres Famille-Scolarité et Travail-Formation"
    Et que je navigue sur la page fournisseur de service
    Et que je clique sur le bouton FranceConnect
    Et que je suis redirigé vers la page sélection du fournisseur d'identité
    Et que j'utilise le fournisseur d'identité "Aidants Connect"
    Et que j'utilise un compte usager "personnalisé"
    Quand je clique sur le bouton Aidants Connect
    Et je suis redirigé vers la page login du fournisseur d'identité
    Et je m'authentifie sur Aidants Connect avec un mandat "avec le périmètre Famille-Scolarité"
    Alors je suis redirigé vers la page de consentement
    Et je consens à transmettre mes informations au fournisseur de service
    Et je continue sur le fournisseur de service
    Et je suis connecté au fournisseur de service

  @fcpLow @ignoreInteg01
  Scénario: TA04: Aidants Connect - FS avec périmètres Aidants Connect et mandat avec deux périmètres
    Etant donné que j'utilise un fournisseur de service "avec les périmètres Famille-Scolarité et Travail-Formation"
    Et que je navigue sur la page fournisseur de service
    Et que je clique sur le bouton FranceConnect
    Et que je suis redirigé vers la page sélection du fournisseur d'identité
    Et que j'utilise le fournisseur d'identité "Aidants Connect"
    Et que j'utilise un compte usager "personnalisé"
    Quand je clique sur le bouton Aidants Connect
    Et je suis redirigé vers la page login du fournisseur d'identité
    Et je m'authentifie sur Aidants Connect avec un mandat "avec les périmètres Famille-Scolarité et Travail-Formation"
    Alors je suis redirigé vers la page de consentement
    Et je consens à transmettre mes informations au fournisseur de service
    Et je continue sur le fournisseur de service
    Et je suis connecté au fournisseur de service

  @fcpLow @ignoreInteg01 @exceptions
  Scénario: TA05: Aidants Connect - Erreur si aucun périmètre renvoyé par Aidants Connect
    Etant donné que j'utilise un fournisseur de service "avec les périmètres Famille-Scolarité et Travail-Formation"
    Et que je navigue sur la page fournisseur de service
    Et que je clique sur le bouton FranceConnect
    Et que je suis redirigé vers la page sélection du fournisseur d'identité
    Et que j'utilise le fournisseur d'identité "Aidants Connect"
    Et que j'utilise un compte usager "personnalisé"
    Quand je clique sur le bouton Aidants Connect
    Et je suis redirigé vers la page login du fournisseur d'identité
    Et je m'authentifie sur Aidants Connect avec un mandat "sans périmètre"
    Alors je suis redirigé vers la page erreur technique FranceConnect
    Et le code d'erreur FranceConnect est "Y600020"
    Et le message d'erreur FranceConnect est "Une erreur technique est survenue, fermez l’onglet de votre navigateur et reconnectez-vous."
    Et le lien retour vers le FS est affiché dans la page erreur technique

  @fcpLow @ignoreInteg01
  Scénario: TA06: Aidants Connect - Erreur si absence de périmètre correspondant au FS
    Etant donné que j'utilise un fournisseur de service "avec les périmètres Famille-Scolarité et Travail-Formation"
    Et que je navigue sur la page fournisseur de service
    Et que je clique sur le bouton FranceConnect
    Et que je suis redirigé vers la page sélection du fournisseur d'identité
    Et que j'utilise le fournisseur d'identité "Aidants Connect"
    Et que j'utilise un compte usager "personnalisé"
    Quand je clique sur le bouton Aidants Connect
    Et je suis redirigé vers la page login du fournisseur d'identité
    Et je m'authentifie sur Aidants Connect avec un mandat "avec un périmètre différent"
    Alors le code d'erreur FranceConnect est "Y600020"
    Et le message d'erreur FranceConnect est "Une erreur technique est survenue, fermez l’onglet de votre navigateur et reconnectez-vous."
    Et le lien retour vers le FS est affiché dans la page erreur technique

  @fcpLow @ignoreInteg01
  Scénario: TA07: Aidants Connect - SSO ok - FS sans périmètre
    Etant donné que j'utilise un fournisseur de service "avec les périmètres Famille-Scolarité et Travail-Formation"
    Et que j'utilise le fournisseur d'identité "Aidants Connect"
    Et que j'utilise un mandat Aidants Connect "avec le périmètre Famille-Scolarité"
    Et que je navigue sur la page fournisseur de service
    Et que je me connecte à FranceConnect avec Aidants Connect
    Et que je suis redirigé vers la page fournisseur de service
    Et que je suis connecté au fournisseur de service
    Quand j'utilise un fournisseur de service "sans périmètre Aidants Connect"
    Et je navigue sur la page fournisseur de service
    Et je clique sur le bouton FranceConnect
    Alors je suis redirigé vers la page confirmation de connexion
    Et je continue sur le fournisseur de service
    Et je suis connecté au fournisseur de service

  @fcpLow @ignoreInteg01
  Scénario: TA08: Aidants Connect - SSO ok - accès à un des périmètres du FS
    Etant donné que j'utilise un fournisseur de service "par défaut"
    Et que j'utilise le fournisseur d'identité "Aidants Connect"
    Et que j'utilise un mandat Aidants Connect "avec le périmètre Famille-Scolarité"
    Et que je navigue sur la page fournisseur de service
    Et que je me connecte à FranceConnect avec Aidants Connect
    Et que je suis redirigé vers la page fournisseur de service
    Et que je suis connecté au fournisseur de service
    Quand j'utilise un fournisseur de service "avec les périmètres Famille-Scolarité et Travail-Formation"
    Et je navigue sur la page fournisseur de service
    Et je clique sur le bouton FranceConnect
    Alors je suis redirigé vers la page de consentement
    Et je consens à transmettre mes informations au fournisseur de service
    Et je continue sur le fournisseur de service
    Et je suis connecté au fournisseur de service

  @fcpLow @ignoreInteg01
  Scénario: TA09: Aidants Connect - SSO en erreur - non accès à un des périmètres du FS
    Etant donné que j'utilise un fournisseur de service "par défaut"
    Et que j'utilise le fournisseur d'identité "Aidants Connect"
    Et que j'utilise un mandat Aidants Connect "avec un périmètre différent"
    Et que je navigue sur la page fournisseur de service
    Et que je me connecte à FranceConnect avec Aidants Connect
    Et que je suis redirigé vers la page fournisseur de service
    Et que je suis connecté au fournisseur de service
    Quand j'utilise un fournisseur de service "avec les périmètres Famille-Scolarité et Travail-Formation"
    Et je navigue sur la page fournisseur de service
    Et je clique sur le bouton FranceConnect
    Alors je suis redirigé vers la page erreur technique FranceConnect
    Et le code d'erreur FranceConnect est "Y600020"
    Et le message d'erreur FranceConnect est "Une erreur technique est survenue, fermez l’onglet de votre navigateur et reconnectez-vous."
    Et le lien retour vers le FS est affiché dans la page erreur technique

  @fcpLow @ignoreInteg01
  Scénario: TA10: Aidants Connect - Log métier mandat validé sans SSO
    Etant donné que j'utilise un fournisseur de service "sans périmètre Aidants Connect"
    Et que je navigue sur la page fournisseur de service
    Et que je clique sur le bouton FranceConnect
    Et que je suis redirigé vers la page sélection du fournisseur d'identité
    Et que j'utilise le fournisseur d'identité "Aidants Connect"
    Et que j'utilise un compte usager "personnalisé"
    Quand je clique sur le bouton Aidants Connect
    Et je suis redirigé vers la page login du fournisseur d'identité
    Et je m'authentifie sur Aidants Connect avec un mandat "avec le périmètre Famille-Scolarité"
    Alors je suis redirigé vers la page confirmation de connexion
    Et l'événement "FC_VALID_REP_SCOPE" est journalisé avec "rep_scope" "Famille-Scolarité"

  @fcpLow @ignoreInteg01
  Scénario: TA11: Aidants Connect - Log métier mandat non validé sans SSO
    Etant donné que j'utilise un fournisseur de service "avec les périmètres Famille-Scolarité et Travail-Formation"
    Et que je navigue sur la page fournisseur de service
    Et que je clique sur le bouton FranceConnect
    Et que je suis redirigé vers la page sélection du fournisseur d'identité
    Et que j'utilise le fournisseur d'identité "Aidants Connect"
    Et que j'utilise un compte usager "personnalisé"
    Quand je clique sur le bouton Aidants Connect
    Et je suis redirigé vers la page login du fournisseur d'identité
    Et je m'authentifie sur Aidants Connect avec un mandat "avec un périmètre différent"
    Alors je suis redirigé vers la page erreur technique FranceConnect
    Et le code d'erreur FranceConnect est "Y600020"
    Et l'événement "FC_INVALID_REP_SCOPE" est journalisé avec "rep_scope" "Etranger-Europe"

  @fcpLow @ignoreInteg01
  Scénario: TA12: Aidants Connect - Log métier mandat validé avec SSO
    Etant donné que j'utilise un fournisseur de service "par défaut"
    Et que j'utilise le fournisseur d'identité "Aidants Connect"
    Et que j'utilise un mandat Aidants Connect "avec le périmètre Famille-Scolarité"
    Et que je navigue sur la page fournisseur de service
    Et que je me connecte à FranceConnect avec Aidants Connect
    Et que je suis redirigé vers la page fournisseur de service
    Et que je suis connecté au fournisseur de service
    Quand j'utilise un fournisseur de service "avec les périmètres Famille-Scolarité et Travail-Formation"
    Et je navigue sur la page fournisseur de service
    Et je clique sur le bouton FranceConnect
    Alors je suis redirigé vers la page de consentement
    Et l'événement "FC_VALID_REP_SCOPE" est journalisé avec "rep_scope" "Famille-Scolarité"

  @fcpLow @ignoreInteg01
  Scénario: TA13: Aidants Connect - Log métier mandat non validé avec SSO
    Etant donné que j'utilise un fournisseur de service "par défaut"
    Et que j'utilise le fournisseur d'identité "Aidants Connect"
    Et que j'utilise un mandat Aidants Connect "avec un périmètre différent"
    Et que je navigue sur la page fournisseur de service
    Et que je me connecte à FranceConnect avec Aidants Connect
    Et que je suis redirigé vers la page fournisseur de service
    Et que je suis connecté au fournisseur de service
    Quand j'utilise un fournisseur de service "avec les périmètres Famille-Scolarité et Travail-Formation"
    Et je navigue sur la page fournisseur de service
    Et je clique sur le bouton FranceConnect
    Alors je suis redirigé vers la page erreur technique FranceConnect
    Et le code d'erreur FranceConnect est "Y600020"
    Et l'événement "FC_INVALID_REP_SCOPE" est journalisé avec "rep_scope" "Etranger-Europe"