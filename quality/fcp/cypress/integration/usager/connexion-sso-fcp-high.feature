#language: fr
@usager @fcpHigh @connexionSSO @ci
Fonctionnalité: Connexion Usager - SSO - FCP High
  # En tant qu'agent,
  # je souhaite bénéficier d'une authentification unique sur FranceConnect+
  # afin de naviguer sur différents FS sans avoir à me ré-authentifier

  Scénario: Connexion SSO - FCP High - deux FS avec accès au même FI - identité substantiel renvoyée par FI
    Etant donné que j'utilise un fournisseur de service "par défaut"
    Et que j'utilise le fournisseur d'identité "par défaut"
    Et que je navigue sur la page fournisseur de service
    Et que je clique sur le bouton FranceConnect
    Et que je suis redirigé vers la page sélection du fournisseur d'identité
    Et que je clique sur le fournisseur d'identité
    Et que je suis redirigé vers la page login du fournisseur d'identité
    Et que le fournisseur d'identité garantit un niveau de sécurité "eidas2"
    Et que je m'authentifie avec succès
    Et que je continue sur le fournisseur de service
    Et que je suis connecté au fournisseur de service
    Quand j'utilise un fournisseur de service "privé avec consentement obligatoire"
    Et le fournisseur de service requiert l'accès aux informations du scope "anonyme"
    Et je navigue sur la page fournisseur de service
    Et je clique sur le bouton FranceConnect
    Alors je suis redirigé vers la page d'information
    Et je continue sur le fournisseur de service
    Et je suis connecté au fournisseur de service
    Et la cinématique a utilisé le niveau de sécurité "eidas2"

  Scénario: Connexion SSO - FCP High - deux FS avec accès au même FI - identité élevé renvoyée par FI
    Etant donné que j'utilise un fournisseur de service "par défaut"
    Et que j'utilise le fournisseur d'identité "par défaut"
    Et que je navigue sur la page fournisseur de service
    Et que je clique sur le bouton FranceConnect
    Et que je suis redirigé vers la page sélection du fournisseur d'identité
    Et que je clique sur le fournisseur d'identité
    Et que je suis redirigé vers la page login du fournisseur d'identité
    Et que le fournisseur d'identité garantit un niveau de sécurité "eidas3"
    Et que je m'authentifie avec succès
    Et que je continue sur le fournisseur de service
    Et que je suis connecté au fournisseur de service
    Quand j'utilise un fournisseur de service "privé avec consentement obligatoire"
    Et le fournisseur de service requiert l'accès aux informations du scope "anonyme"
    Et je navigue sur la page fournisseur de service
    Et je clique sur le bouton FranceConnect
    Alors je suis redirigé vers la page d'information
    Et je continue sur le fournisseur de service
    Et je suis connecté au fournisseur de service
    Et la cinématique a utilisé le niveau de sécurité "eidas2"

  Scénario: Connexion SSO - FCP High - 1er FS demande de l'élevé et 2ème FS demande du subtantiel - identité élevé renvoyée par FI
    Etant donné que j'utilise un fournisseur de service "privé avec consentement obligatoire"
    Et que le fournisseur de service requiert un niveau de sécurité "eidas3"
    Et que le fournisseur de service requiert l'accès aux informations du scope "anonyme"
    Et que j'utilise le fournisseur d'identité "par défaut"
    Et que je navigue sur la page fournisseur de service
    Et que je clique sur le bouton FranceConnect
    Et que je suis redirigé vers la page sélection du fournisseur d'identité
    Et que j'utilise un fournisseur d'identité avec niveau de sécurité "eidas3"
    Et que je clique sur le fournisseur d'identité
    Et que je suis redirigé vers la page login du fournisseur d'identité
    Et que le fournisseur d'identité garantit un niveau de sécurité "eidas3"
    Et que je m'authentifie avec succès
    Et que je continue sur le fournisseur de service
    Et que je suis connecté au fournisseur de service
    Et que l'événement "FC_SSO_INITIATED" n'est pas journalisé
    Quand j'utilise un fournisseur de service "par défaut"
    Et je navigue sur la page fournisseur de service
    Et je clique sur le bouton FranceConnect
    Alors je suis redirigé vers la page d'information
    Et je continue sur le fournisseur de service
    Et je suis connecté au fournisseur de service
    Et la cinématique a utilisé le niveau de sécurité "eidas2"

  Scénario: Connexion SSO - FCP High - déconnexion d'un FS seulement et SSO terminé
    Etant donné que j'utilise un fournisseur de service "par défaut"
    Et que j'utilise le fournisseur d'identité "par défaut"
    Et que je navigue sur la page fournisseur de service
    Et que je me connecte à FranceConnect
    Et que je suis redirigé vers la page fournisseur de service
    Et que je suis connecté au fournisseur de service
    Et que j'utilise un fournisseur de service "privé avec consentement obligatoire"
    Et que le fournisseur de service requiert l'accès aux informations du scope "anonyme"
    Et que je navigue sur la page fournisseur de service
    Et que je clique sur le bouton FranceConnect
    Et que je suis redirigé vers la page d'information
    Et que je continue sur le fournisseur de service
    Et que je suis connecté au fournisseur de service
    Et que j'utilise un fournisseur de service "par défaut"
    Et que je navigue sur la page fournisseur de service
    Et que je suis connecté au fournisseur de service
    Quand je me déconnecte du fournisseur de service et du fournisseur d'identité
    Alors je suis déconnecté du fournisseur de service
    Et je clique sur le bouton FranceConnect
    Et je suis redirigé vers la page sélection du fournisseur d'identité
    Et j'utilise un fournisseur de service "privé avec consentement obligatoire"
    Et je navigue sur la page fournisseur de service
    Et je suis connecté au fournisseur de service

  @ignoreInteg01
  Scénario: Connexion SSO - FCP High - blacklist d'un FI et SSO terminé
    Etant donné que j'utilise un fournisseur de service "par défaut"
    Et que j'utilise le fournisseur d'identité "blacklisté"
    Et que je navigue sur la page fournisseur de service
    Et que je me connecte à FranceConnect
    Et que je suis redirigé vers la page fournisseur de service
    Et que je suis connecté au fournisseur de service
    Quand j'utilise un fournisseur de service "privé avec consentement obligatoire"
    Et le fournisseur de service requiert l'accès aux informations du scope "anonyme"
    Et je navigue sur la page fournisseur de service
    Et je clique sur le bouton FranceConnect
    Alors je suis redirigé vers la page sélection du fournisseur d'identité

  Scénario: Connexion SSO - FCP High - deux FS de niveau élevé avec accès au même FI - SSO terminé
    Etant donné que j'utilise un fournisseur de service "par défaut"
    Et que j'utilise le fournisseur d'identité "par défaut"
    Et que le fournisseur de service requiert un niveau de sécurité "eidas3"
    Et que je navigue sur la page fournisseur de service
    Et que je me connecte à FranceConnect
    Et que je suis connecté au fournisseur de service
    Quand j'utilise un fournisseur de service "privé avec consentement obligatoire"
    Et le fournisseur de service requiert un niveau de sécurité "eidas3"
    Et le fournisseur de service requiert l'accès aux informations du scope "anonyme"
    Et je navigue sur la page fournisseur de service
    Et je clique sur le bouton FranceConnect
    Alors je suis redirigé vers la page sélection du fournisseur d'identité

  Scénario: Connexion SSO - FCP High - 1er FS de niveau substantiel et 2eme FS demande de l'élevé avec accès au même FI - SSO terminé
    Etant donné que j'utilise un fournisseur de service "par défaut"
    Et que j'utilise le fournisseur d'identité "par défaut"
    Et que je navigue sur la page fournisseur de service
    Et que je me connecte à FranceConnect
    Et que je suis connecté au fournisseur de service
    Quand j'utilise un fournisseur de service "privé avec consentement obligatoire"
    Et le fournisseur de service requiert un niveau de sécurité "eidas3"
    Et le fournisseur de service requiert l'accès aux informations du scope "anonyme"
    Et je navigue sur la page fournisseur de service
    Et je clique sur le bouton FranceConnect
    Alors je suis redirigé vers la page sélection du fournisseur d'identité
