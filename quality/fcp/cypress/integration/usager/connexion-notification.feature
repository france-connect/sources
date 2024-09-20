#language: fr
@usager @connexionNotification @ignoreInteg01 @ci
Fonctionnalité: Connexion Notification
  # En tant qu'usager d'un fournisseur de service,
  # je veux recevoir une notification de connexion
  # afin d'être averti d'une connexion inhabituelle

  # Explication des priorités de règle d'envoi de notification
  # 1. notification envoyée systématiquement si context suspect (header x-suspicious)
  # 2. notification non envoyée si SSO avec même FS
  # 3. notification non envoyée si situation habituelle "trusted" (appareil connu, identité connue et appareil non partagé )
  # 4. notification envoyée par défaut
  @fcpLow @fcpHigh
  Scénario: Connexion Notification - pas de notification si une seule identité connue
    Etant donné que je supprime les mails envoyés à l'usager
    Et que j'utilise un fournisseur de service "public"
    Et que je navigue sur la page fournisseur de service
    Et que je me connecte à FranceConnect
    Et que je suis redirigé vers la page fournisseur de service
    Et que je suis connecté au fournisseur de service
    Et que le mail "notification de connexion" est envoyé
    Et que l'événement "FC_DATATRANSFER_INFORMATION_IDENTITY" est journalisé avec "deviceIsSuspicious" "false" et "deviceKnown" "false" et "deviceNewIdentity" "true" et "deviceAccountCount" "int:1" et "deviceBecameTrusted" "true" et "deviceBecameShared" "false"
    Et que j'utilise un fournisseur de service "privé avec consentement obligatoire"
    # Et que le fournisseur de service requiert l'accès aux informations des scopes "profile sans preferred_username"
    Et que je navigue sur la page fournisseur de service
    Et que je supprime les mails envoyés à l'usager
    Quand je me connecte à FranceConnect en SSO
    Alors je suis redirigé vers la page fournisseur de service
    Et je suis connecté au fournisseur de service
    Et le mail "notification de connexion" n'est pas envoyé

  @fcpLow @fcpHigh
  Scénario: Connexion Notification - plusieurs identités
    Etant donné que je supprime les mails envoyés à l'usager
    Et que j'utilise un compte usager "première identité"
    Et que je navigue sur la page fournisseur de service
    Et que je me connecte à FranceConnect
    Et que je suis redirigé vers la page fournisseur de service
    Et que je suis connecté au fournisseur de service
    # notification envoyée car appareil inconnu
    Et que le mail "notification de connexion" est envoyé
    Et que l'événement "FC_DATATRANSFER_INFORMATION_IDENTITY" est journalisé avec "deviceIsSuspicious" "false" et "deviceKnown" "false" et "deviceNewIdentity" "true" et "deviceAccountCount" "int:1" et "deviceBecameTrusted" "true" et "deviceBecameShared" "false"
    Et que je navigue sur la page fournisseur de service
    Et que je me déconnecte du fournisseur de service
    Et que j'utilise un compte usager "deuxième identité"
    Et que je me connecte à FranceConnect
    Et que je suis redirigé vers la page fournisseur de service
    Et que je suis connecté au fournisseur de service
    # notification envoyée car appareil connu mais nouvelle identité
    Et que le mail "notification de connexion" est envoyé
    Et que l'événement "FC_DATATRANSFER_INFORMATION_IDENTITY" est journalisé avec "deviceIsSuspicious" "false" et "deviceKnown" "true" et "deviceNewIdentity" "true" et "deviceAccountCount" "int:2" et "deviceBecameTrusted" "false" et "deviceBecameShared" "false"
    Et que je navigue sur la page fournisseur de service
    Et que je me déconnecte du fournisseur de service
    Et que j'utilise un compte usager "troisième identité"
    Et que je me connecte à FranceConnect
    Et que je suis redirigé vers la page fournisseur de service
    Et que je suis connecté au fournisseur de service
    # notification envoyée car nouvelle identité sur appareil partagé
    Et que le mail "notification de connexion" est envoyé
    Et que l'événement "FC_DATATRANSFER_INFORMATION_IDENTITY" est journalisé avec "deviceIsSuspicious" "false" et "deviceKnown" "true" et "deviceNewIdentity" "true" et "deviceAccountCount" "int:3" et "deviceBecameTrusted" "false" et "deviceBecameShared" "true"
    Et que je navigue sur la page fournisseur de service
    Et que je me déconnecte du fournisseur de service
    Et que j'utilise un compte usager "quatrième identité"
    Et que je me connecte à FranceConnect
    Et que je suis redirigé vers la page fournisseur de service
    Et que je suis connecté au fournisseur de service
    # notification envoyée car appareil partagé (nombre d'identité max atteint)
    Et que le mail "notification de connexion" est envoyé
    Et que l'événement "FC_DATATRANSFER_INFORMATION_IDENTITY" est journalisé avec "deviceIsSuspicious" "false" et "deviceKnown" "true" et "deviceNewIdentity" "true" et "deviceAccountCount" "int:3" et "deviceBecameTrusted" "false" et "deviceBecameShared" "false"
    Et que je navigue sur la page fournisseur de service
    Et que je me déconnecte du fournisseur de service
    Et que je me connecte à FranceConnect
    Et que je suis redirigé vers la page fournisseur de service
    Et que je suis connecté au fournisseur de service
    # notification envoyée car appareil partagé (première identité retirée)
    Et que le mail "notification de connexion" est envoyé
    Et que l'événement "FC_DATATRANSFER_INFORMATION_IDENTITY" est journalisé avec "deviceIsSuspicious" "false" et "deviceKnown" "true" et "deviceNewIdentity" "false" et "deviceAccountCount" "int:3" et "deviceBecameTrusted" "false" et "deviceBecameShared" "false"
    Et que je supprime les mails envoyés à l'usager
    Et que je supprime les cookies du FS Mock
    Et que je navigue sur la page fournisseur de service
    Quand je clique sur le bouton FranceConnect
    Alors je suis redirigé vers la page d'information
    Et je continue sur le fournisseur de service
    Et je suis connecté au fournisseur de service
    # notification non envoyée car déjà envoyée pour le même FS dans la session actuelle
    Et le mail "notification de connexion" n'est pas envoyé
    Et l'événement "FC_DATATRANSFER_INFORMATION_IDENTITY" est journalisé avec "deviceIsSuspicious" "false" et "deviceKnown" "true" et "deviceNewIdentity" "false" et "deviceAccountCount" "int:3" et "deviceBecameTrusted" "false" et "deviceBecameShared" "false"

  @fcpLow
  Scénario: Connexion Notification - notification si contexte suspect (même si SSO)
    Etant donné que je supprime les mails envoyés à l'usager
    Et que je navigue sur la page fournisseur de service
    Et que je clique sur le bouton FranceConnect
    Et que je suis redirigé vers la page sélection du fournisseur d'identité
    Et que j'utilise un fournisseur d'identité avec niveau de sécurité "eidas3"
    Et que je clique sur le fournisseur d'identité
    Et que je suis redirigé vers la page login du fournisseur d'identité
    Et que le fournisseur d'identité garantit un niveau de sécurité "eidas3"
    Et que je m'authentifie avec succès
    Et que je suis redirigé vers la page confirmation de connexion
    Et que je continue sur le fournisseur de service
    Et que je suis redirigé vers la page fournisseur de service
    Et que je suis connecté au fournisseur de service
    Et que l'événement "FC_DATATRANSFER_INFORMATION_IDENTITY" est journalisé avec "deviceIsSuspicious" "false" et "deviceKnown" "false" et "deviceNewIdentity" "true" et "deviceAccountCount" "int:1" et "deviceBecameTrusted" "true" et "deviceBecameShared" "false"
    Et que je supprime les mails envoyés à l'usager
    Et que j'utilise un fournisseur de service "avec accès au FI par défaut (deuxième FS)"
    Et que je navigue sur la page fournisseur de service
    Quand j'initie une connexion suspecte à FranceConnect low
    Alors je suis redirigé vers la page confirmation de connexion
    Et je continue sur le fournisseur de service
    Et je suis redirigé vers la page fournisseur de service
    Et le mail "notification de connexion" est envoyé
    Et l'événement "FC_DATATRANSFER_INFORMATION_IDENTITY" est journalisé avec "deviceIsSuspicious" "true" et "deviceKnown" "true" et "deviceNewIdentity" "false" et "deviceAccountCount" "int:1" et "deviceBecameTrusted" "false" et "deviceBecameShared" "false"
