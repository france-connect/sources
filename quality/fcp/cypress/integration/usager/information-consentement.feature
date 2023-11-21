#language: fr
@usager @informationConsentement @ci
Fonctionnalité: Information Consentement
  # En tant qu'usager FranceConnect,
  # je veux être informé des données personnelles transmises au fournisseur de service
  # afin de donner mon consentement

  Scénario: Information - FS public
    Etant donné que j'utilise un fournisseur de service "public"
    Et le fournisseur de service requiert l'accès aux informations du scope "identite_pivot sans alias"
    Et que je navigue sur la page fournisseur de service
    Et que je clique sur le bouton FranceConnect
    Et que je suis redirigé vers la page sélection du fournisseur d'identité
    Et que je clique sur le fournisseur d'identité
    Et que je suis redirigé vers la page login du fournisseur d'identité
    Et que je m'authentifie avec succès
    Et que je suis redirigé vers la page d'information
    Et que les informations demandées par le fournisseur de service correspondent au scope "identite_pivot sans alias"
    Et que l'événement "FC_DATATRANSFER_INFORMATION_IDENTITY" n'est pas journalisé
    Quand je continue sur le fournisseur de service
    Alors l'événement "FC_DATATRANSFER_INFORMATION_IDENTITY" est journalisé
    Et je suis redirigé vers la page fournisseur de service
    Et je suis connecté au fournisseur de service
    Et le fournisseur de service a accès aux informations du scope "identite_pivot sans alias"

  # Aucun FS privé sans consentement obligatoire sur integ01 et fcp-low
  @ignoreInteg01 @ignoreLow
  Scénario: Information - FS privé sans consentement obligatoire
    Etant donné que j'utilise un fournisseur de service "privé sans consentement obligatoire"
    Et le fournisseur de service requiert l'accès aux informations du scope "identite_pivot sans alias"
    Et que je navigue sur la page fournisseur de service
    Et que je clique sur le bouton FranceConnect
    Et que je suis redirigé vers la page sélection du fournisseur d'identité
    Et que je clique sur le fournisseur d'identité
    Et que je suis redirigé vers la page login du fournisseur d'identité
    Et que je m'authentifie avec succès
    Et que je suis redirigé vers la page d'information
    Et que les informations demandées par le fournisseur de service correspondent au scope "identite_pivot sans alias"
    Et que l'événement "FC_DATATRANSFER_INFORMATION_IDENTITY" n'est pas journalisé
    Quand je continue sur le fournisseur de service
    Alors l'événement "FC_DATATRANSFER_INFORMATION_IDENTITY" est journalisé
    Et je suis redirigé vers la page fournisseur de service
    Et je suis connecté au fournisseur de service
    Et le fournisseur de service a accès aux informations du scope "identite_pivot sans alias"

  Scénario: Consentement - FS privé avec consentement obligatoire
    Etant donné que j'utilise un fournisseur de service "privé avec consentement obligatoire"
    Et le fournisseur de service requiert l'accès aux informations du scope "identite_pivot sans alias"
    Et que je navigue sur la page fournisseur de service
    Et que je clique sur le bouton FranceConnect
    Et que je suis redirigé vers la page sélection du fournisseur d'identité
    Et que je clique sur le fournisseur d'identité
    Et que je suis redirigé vers la page login du fournisseur d'identité
    Et que je m'authentifie avec succès
    Et que je suis redirigé vers la page de consentement
    Et que les informations demandées par le fournisseur de service correspondent au scope "identite_pivot sans alias"
    Et que le bouton continuer sur le FS est désactivé
    Quand je consens à transmettre mes informations au fournisseur de service
    Et l'événement "FC_DATATRANSFER_CONSENT_IDENTITY" n'est pas journalisé
    Et le bouton continuer sur le FS est actif
    Et je continue sur le fournisseur de service
    Alors l'événement "FC_DATATRANSFER_CONSENT_IDENTITY" est journalisé
    Et je suis redirigé vers la page fournisseur de service
    Et je suis connecté au fournisseur de service
    Et le fournisseur de service a accès aux informations du scope "identite_pivot sans alias"

  Scénario: Information - scope anonyme avec FS public
    Etant donné que j'utilise un fournisseur de service "public"
    Et le fournisseur de service requiert l'accès aux informations du scope "anonyme"
    Et que je navigue sur la page fournisseur de service
    Et que je clique sur le bouton FranceConnect
    Et que je suis redirigé vers la page sélection du fournisseur d'identité
    Et que j'utilise un fournisseur d'identité "actif"
    Et que je clique sur le fournisseur d'identité
    Et que je suis redirigé vers la page login du fournisseur d'identité
    Et que je m'authentifie avec succès
    Et que je suis redirigé vers la page d'information
    Et que aucune information n'est demandée par le fournisseur de service pour le scope "anonyme"
    Et que l'événement "FC_DATATRANSFER_INFORMATION_ANONYMOUS" n'est pas journalisé
    Quand je continue sur le fournisseur de service
    Alors l'événement "FC_DATATRANSFER_INFORMATION_ANONYMOUS" est journalisé
    Et je suis redirigé vers la page fournisseur de service
    Et je suis connecté au fournisseur de service
    Et le fournisseur de service a accès aux informations du scope "anonyme"

  # Aucun FS privé sans consentement obligatoire sur integ01 et fcp-low
  @ignoreInteg01 @ignoreLow
  Scénario: Information - scope anonyme avec FS privé sans consentement obligatoire
    Etant donné que j'utilise un fournisseur de service "privé sans consentement obligatoire"
    Et le fournisseur de service requiert l'accès aux informations du scope "anonyme"
    Et que je navigue sur la page fournisseur de service
    Et que je clique sur le bouton FranceConnect
    Et que je suis redirigé vers la page sélection du fournisseur d'identité
    Et que j'utilise un fournisseur d'identité "actif"
    Et que je clique sur le fournisseur d'identité
    Et que je suis redirigé vers la page login du fournisseur d'identité
    Et que je m'authentifie avec succès
    Et que je suis redirigé vers la page d'information
    Et que aucune information n'est demandée par le fournisseur de service pour le scope "anonyme"
    Et que l'événement "FC_DATATRANSFER_INFORMATION_ANONYMOUS" n'est pas journalisé
    Quand je continue sur le fournisseur de service
    Alors l'événement "FC_DATATRANSFER_INFORMATION_ANONYMOUS" est journalisé
    Et je suis redirigé vers la page fournisseur de service
    Et je suis connecté au fournisseur de service
    Et le fournisseur de service a accès aux informations du scope "anonyme"

  Scénario: Information - scope anonyme avec FS privé avec consentement obligatoire
    Etant donné que j'utilise un fournisseur de service "privé avec consentement obligatoire"
    Et le fournisseur de service requiert l'accès aux informations du scope "anonyme"
    Et que je navigue sur la page fournisseur de service
    Et que je clique sur le bouton FranceConnect
    Et que je suis redirigé vers la page sélection du fournisseur d'identité
    Et que j'utilise un fournisseur d'identité "actif"
    Et que je clique sur le fournisseur d'identité
    Et que je suis redirigé vers la page login du fournisseur d'identité
    Et que je m'authentifie avec succès
    Et que je suis redirigé vers la page d'information
    Et que aucune information n'est demandée par le fournisseur de service pour le scope "anonyme"
    Et que l'événement "FC_DATATRANSFER_INFORMATION_ANONYMOUS" n'est pas journalisé
    Quand je continue sur le fournisseur de service
    Alors l'événement "FC_DATATRANSFER_INFORMATION_ANONYMOUS" est journalisé
    Et je suis redirigé vers la page fournisseur de service
    Et je suis connecté au fournisseur de service
    Et le fournisseur de service a accès aux informations du scope "anonyme"
