#language: fr
@usager @sessionAbsente @ci
Fonctionnalité: Connexion Usager - session absente
  # En tant qu'usager,
  # je veux être informer quand il y a un problème avec ma session
  # afin de pouvoir réessayer ma connexion

  Scénario: Connexion OK - vérification des cookies FranceConnect après l'appel authorize
    Etant donné que je navigue sur la page fournisseur de service
    Quand je clique sur le bouton FranceConnect
    Alors je suis redirigé vers la page sélection du fournisseur d'identité
    Et les cookies FranceConnect sont présents

  Scénario: Connexion OK - session inconnue lors de l'appel authorize
    Etant donné que je force un sessionId inexistant dans le cookie de session FranceConnect
    Et que je navigue sur la page fournisseur de service
    Quand je clique sur le bouton FranceConnect
    Alors je suis redirigé vers la page sélection du fournisseur d'identité

  Scénario: Connexion OK - rafraîchissement sur page de consentement
    Etant donné que je navigue sur la page fournisseur de service
    Et que je clique sur le bouton FranceConnect
    Et que je suis redirigé vers la page sélection du fournisseur d'identité
    Et que je clique sur le fournisseur d'identité
    Et que je suis redirigé vers la page login du fournisseur d'identité
    Et que je m'authentifie avec succès
    Et que je suis redirigé vers la page confirmation de connexion
    Quand je rafraîchis la page
    Alors je suis redirigé vers la page confirmation de connexion

  Scénario: Connexion OK - retour sur la mire après sélection du fournisseur d'identité
    Etant donné que je navigue sur la page fournisseur de service
    Et que je clique sur le bouton FranceConnect
    Et que je suis redirigé vers la page sélection du fournisseur d'identité
    Et que je clique sur le fournisseur d'identité
    Et que je suis redirigé vers la page login du fournisseur d'identité
    Quand je reviens en arrière
    Alors je suis redirigé vers la page sélection du fournisseur d'identité
    Et je clique sur le fournisseur d'identité
    Et je suis redirigé vers la page login du fournisseur d'identité
    Et je m'authentifie avec succès
    Et je suis redirigé vers la page confirmation de connexion

  Scénario: Connexion erreur - session absente sur page sélection du fournisseur d'identité
    Etant donné que je navigue sur la page fournisseur de service
    Et que je clique sur le bouton FranceConnect
    Et que je suis redirigé vers la page sélection du fournisseur d'identité
    Quand je supprime les cookies FranceConnect
    Et je rafraîchis la page
    Alors je suis redirigé vers la page erreur technique FranceConnect
    Et le code d'erreur FranceConnect est "Y190001"
    Et le message d'erreur FranceConnect est "Votre session a expiré ou est invalide, fermez l’onglet de votre navigateur et reconnectez-vous."

  Scénario: Connexion erreur - session absente au retour du FI
    Etant donné que je navigue sur la page fournisseur de service
    Et que je clique sur le bouton FranceConnect
    Et que je suis redirigé vers la page sélection du fournisseur d'identité
    Et que je clique sur le fournisseur d'identité
    Et que je suis redirigé vers la page login du fournisseur d'identité
    Et que je supprime les cookies FranceConnect
    Quand je m'authentifie avec succès
    Alors je suis redirigé vers la page erreur technique FranceConnect
    # @todo #1481 Déclencher erreur "Y190001" (SessionNotFoundException au lieu de UndefinedStepRouteException)
    # @see https://gitlab.dev-franceconnect.fr/france-connect/fc/-/issues/1481
    Et le code d'erreur FranceConnect est "Y420002"
    Et le message d'erreur FranceConnect est "Nous vous invitons à fermer tous les onglets de votre navigateur et à vous authentifier de nouveau en suivant les étapes de connexion."

  Scénario: Connexion erreur - session absente sur page de consentement
    Etant donné que je navigue sur la page fournisseur de service
    Et que je clique sur le bouton FranceConnect
    Et que je suis redirigé vers la page sélection du fournisseur d'identité
    Et que je clique sur le fournisseur d'identité
    Et que je suis redirigé vers la page login du fournisseur d'identité
    Et que je m'authentifie avec succès
    Et que je suis redirigé vers la page confirmation de connexion
    Quand je supprime les cookies FranceConnect
    Et je rafraîchis la page
    Alors je suis redirigé vers la page erreur technique FranceConnect
    Et le code d'erreur FranceConnect est "Y190001"
    Et le message d'erreur FranceConnect est "Votre session a expiré ou est invalide, fermez l’onglet de votre navigateur et reconnectez-vous."

  Scénario: Connexion erreur - session absente lors du consentement
    Etant donné que je navigue sur la page fournisseur de service
    Et que je clique sur le bouton FranceConnect
    Et que je suis redirigé vers la page sélection du fournisseur d'identité
    Et que je clique sur le fournisseur d'identité
    Et que je suis redirigé vers la page login du fournisseur d'identité
    Et que je m'authentifie avec succès
    Et que je suis redirigé vers la page confirmation de connexion
    Quand je supprime les cookies FranceConnect
    Et je continue sur le fournisseur de service
    Alors je suis redirigé vers la page erreur technique FranceConnect
    Et le code d'erreur FranceConnect est "Y470001"
    Et le message d'erreur FranceConnect est "Votre session a expiré ou est invalide, fermez l’onglet de votre navigateur et reconnectez-vous."

  Scénario: Connexion erreur - session inconnue sur page sélection du fournisseur d'identité
    Etant donné que je navigue sur la page fournisseur de service
    Et que je clique sur le bouton FranceConnect
    Et que je suis redirigé vers la page sélection du fournisseur d'identité
    Quand je force un sessionId inexistant dans le cookie de session FranceConnect
    Et je rafraîchis la page
    Alors je suis redirigé vers la page erreur technique FranceConnect
    Et le code d'erreur FranceConnect est "Y190001"
    Et le message d'erreur FranceConnect est "Votre session a expiré ou est invalide, fermez l’onglet de votre navigateur et reconnectez-vous."

  Scénario: Connexion erreur - session inconnue sur page de consentement
    Etant donné que je navigue sur la page fournisseur de service
    Et que je clique sur le bouton FranceConnect
    Et que je suis redirigé vers la page sélection du fournisseur d'identité
    Et que je clique sur le fournisseur d'identité
    Et que je suis redirigé vers la page login du fournisseur d'identité
    Et que je m'authentifie avec succès
    Et que je suis redirigé vers la page confirmation de connexion
    Quand je force un sessionId inexistant dans le cookie de session FranceConnect
    Et je rafraîchis la page
    Alors je suis redirigé vers la page erreur technique FranceConnect
    Et le code d'erreur FranceConnect est "Y190001"
    Et le message d'erreur FranceConnect est "Votre session a expiré ou est invalide, fermez l’onglet de votre navigateur et reconnectez-vous."
