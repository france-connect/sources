#language: fr
@usager @sessionAbsente @ci
Fonctionnalité: Connexion Usager - session absente
  # En tant qu'usagère,
  # je veux être informée quand il y a un problème avec ma session
  # afin de pouvoir réessayer ma connexion

  Scénario: Connexion OK - vérification des cookies AgentConnect après l'appel authorize
    Etant donné que je navigue sur la page fournisseur de service
    Quand je clique sur le bouton AgentConnect
    Alors je suis redirigé vers la page interaction
    Et les cookies AgentConnect sont présents

  Scénario: Connexion OK - session inconnue lors de l'appel authorize
    Etant donné que je force un sessionId inexistant dans le cookie de session AgentConnect
    Et que je navigue sur la page fournisseur de service
    Quand je clique sur le bouton AgentConnect
    Alors je suis redirigé vers la page interaction

  Scénario: Connexion OK - retour sur la mire après sélection du fournisseur d'identité
    Etant donné que je navigue sur la page fournisseur de service
    Et que je clique sur le bouton AgentConnect
    Et que je suis redirigé vers la page interaction
    Et que j'entre l'email "test@fia1.fr"
    Et que je clique sur le bouton de connexion
    Et que je suis redirigé vers la page login du fournisseur d'identité
    Quand je reviens en arrière
    Et je suis redirigé vers la page interaction
    Et j'entre l'email "test@fia1.fr"
    Et je clique sur le bouton de connexion
    Et je suis redirigé vers la page login du fournisseur d'identité
    Alors je m'authentifie avec succès
    Et je suis redirigé vers la page fournisseur de service

  Scénario: Erreur lors de la connexion - session absente sur page interaction
    Etant donné que je navigue sur la page fournisseur de service
    Et que je clique sur le bouton AgentConnect
    Et que je suis redirigé vers la page interaction
    Quand je supprime les cookies AgentConnect
    Et je rafraîchis la page
    Alors je suis redirigé vers la page erreur technique
    Et le code d'erreur est "Y190001"
    Et le message d'erreur est "Votre session a expiré ou est invalide, fermez l’onglet de votre navigateur et reconnectez-vous."

  Scénario: Erreur lors de la connexion - session absente au retour du FI
    Etant donné que je navigue sur la page fournisseur de service
    Et que je clique sur le bouton AgentConnect
    Et que je suis redirigé vers la page interaction
    Et que j'entre l'email "test@fia1.fr"
    Et que je clique sur le bouton de connexion
    Et que je suis redirigé vers la page login du fournisseur d'identité
    Et que je supprime les cookies AgentConnect
    Quand je m'authentifie avec succès
    Alors je suis redirigé vers la page erreur technique
    # @todo #1481 Déclencher erreur "Y190001" (SessionNotFoundException au lieu de UndefinedStepRouteException)
    # @see https://gitlab.dev-franceconnect.fr/france-connect/fc/-/issues/1481
    Et le code d'erreur est "Y420002"
    Et le message d'erreur est "Nous vous invitons à fermer tous les onglets de votre navigateur et à vous authentifier de nouveau en suivant les étapes de connexion."

  Scénario: Erreur lors de la connexion - session absente sur la page multi FI
    Etant donné que je navigue sur la page fournisseur de service
    Et que je clique sur le bouton AgentConnect
    Et que je suis redirigé vers la page interaction
    Et que j'entre l'email "test@polyfi.fr"
    Et que je clique sur le bouton de connexion
    Quand je supprime les cookies AgentConnect
    Et je rafraîchis la page
    Alors je suis redirigé vers la page erreur technique
    Et le code d'erreur est "Y190001"
    Et le message d'erreur est "Votre session a expiré ou est invalide, fermez l’onglet de votre navigateur et reconnectez-vous."
