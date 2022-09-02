#language: fr
@userDashboard @connexionDashboard @ignoreHigh @ignoreLow
Fonctionnalité: Connexion User Dashboard
  # En tant qu'usager de FranceConnect,
  # je veux me connecter au user dashboard
  # afin de contrôler les FI utilisables avec FranceConnect

  Scénario: User Dashboard - Connexion
    Etant donné que j'utilise un compte usager "pour le test de préférences FI"
    Et que je navigue sur la page d'accueil du dashboard usager
    Quand je me connecte au dashboard usager
    Alors je suis redirigé vers la page historique du dashboard usager
    Et le nom de l'usager du user dashboard est affiché
    Et le lien de déconnexion du user dashboard est affiché
    Et je me déconnecte du dashboard usager

  Scénario: User Dashboard - Déconnexion depuis la page historique
    Etant donné que j'utilise un compte usager "pour le test de préférences FI"
    Et que je navigue sur la page d'accueil du dashboard usager
    Et que je me connecte au dashboard usager
    Et que je suis redirigé vers la page historique du dashboard usager
    Quand je me déconnecte du dashboard usager
    Alors je suis redirigé vers la page d'accueil du dashboard usager
    Et le message d'alerte "session expirée" n'est pas affiché
    Et je ne suis plus connecté au dashboard usager avec FranceConnect

  Scénario: User Dashboard - Déconnexion depuis la page gestion des accès
    Etant donné que j'utilise un compte usager "pour le test de préférences FI"
    Et que je navigue sur la page d'accueil du dashboard usager
    Et que je me connecte au dashboard usager
    Et que je clique sur le lien vers la page gestion des accès du dashboard usager
    Et que je suis sur la page gestion des accès du dashboard usager
    Quand je me déconnecte du dashboard usager
    Alors je suis redirigé vers la page d'accueil du dashboard usager
    Et le message d'alerte "session expirée" n'est pas affiché
    Et je ne suis plus connecté au dashboard usager avec FranceConnect

  Scénario: User Dashboard - Chargement de la page historique après déconnexion
    Etant donné que j'utilise un compte usager "pour le test de préférences FI"
    Et que je navigue sur la page d'accueil du dashboard usager
    Et que je me connecte au dashboard usager
    Et que je suis redirigé vers la page historique du dashboard usager
    Et que je me déconnecte du dashboard usager
    Et que je suis redirigé vers la page d'accueil du dashboard usager
    Quand je navigue directement vers la page historique du dashboard usager
    Alors je suis redirigé vers la page d'accueil du dashboard usager
    Et le message d'alerte "session expirée" n'est pas affiché
    Et je ne suis plus connecté au dashboard usager avec FranceConnect

  Scénario: User Dashboard - Chargement de la page gestion des accès après déconnexion
    Etant donné que j'utilise un compte usager "pour le test de préférences FI"
    Et que je navigue sur la page d'accueil du dashboard usager
    Et que je me connecte au dashboard usager
    Et que je suis redirigé vers la page historique du dashboard usager
    Et que je me déconnecte du dashboard usager
    Et que je suis redirigé vers la page d'accueil du dashboard usager
    Quand je navigue directement vers la page gestion des accès du dashboard usager
    Alors je suis redirigé vers la page d'accueil du dashboard usager
    Et le message d'alerte "session expirée" n'est pas affiché
    Et je ne suis plus connecté au dashboard usager avec FranceConnect

  Scénario: User Dashboard - Clic sur le lien vers la page historique après expiration de session
    Etant donné que j'utilise un compte usager "pour le test de préférences FI"
    Et que je navigue sur la page d'accueil du dashboard usager
    Et que je me connecte au dashboard usager
    Et que je clique sur le lien vers la page gestion des accès du dashboard usager
    Et que je suis sur la page gestion des accès du dashboard usager
    Et que je supprime tous les cookies
    Quand je clique sur le lien vers la page historique du dashboard usager
    Alors je suis redirigé vers la page d'accueil du dashboard usager
    Et le message d'alerte "session expirée" est affiché
    Et je ne suis plus connecté au dashboard usager avec FranceConnect

  Scénario: User Dashboard - Clic sur le lien vers la page gestion des accès après expiration de session
    Etant donné que j'utilise un compte usager "pour le test de préférences FI"
    Et que je navigue sur la page d'accueil du dashboard usager
    Et que je me connecte au dashboard usager
    Et que je suis redirigé vers la page historique du dashboard usager
    Et que je supprime tous les cookies
    Quand je clique sur le lien vers la page gestion des accès du dashboard usager
    Alors je suis redirigé vers la page d'accueil du dashboard usager
    Et le message d'alerte "session expirée" est affiché
    Et je ne suis plus connecté au dashboard usager avec FranceConnect

  Scénario: User Dashboard - Enregistre mes préférences FI après expiration de session
    Etant donné que j'utilise un compte usager "pour le test de préférences FI"
    Et que je navigue sur la page d'accueil du dashboard usager
    Et que je me connecte au dashboard usager
    Et que je suis redirigé vers la page historique du dashboard usager
    Et que je clique sur le lien vers la page gestion des accès du dashboard usager
    Et que je suis sur la page gestion des accès du dashboard usager
    Et que j'utilise le fournisseur d'identité "pour le test de préférences FI"
    Et que je décide de bloquer le fournisseur d'identité
    Et que je décide de bloquer les futurs fournisseurs d'identité par défaut
    Et que je supprime tous les cookies
    Quand je clique sur le bouton "enregistrer mes réglages"
    Alors je suis redirigé vers la page d'accueil du dashboard usager
    Et le message d'alerte "session expirée" est affiché
    Et je ne suis plus connecté au dashboard usager avec FranceConnect

  # Scénario à implémenter dans FC-1073
  @ignore 
  Scénario: User Dashboard - Déconnexion après expiration de session
    Etant donné que j'utilise un compte usager "pour le test de préférences FI"
    Et que je navigue sur la page d'accueil du dashboard usager
    Et que je me connecte au dashboard usager
    Et que je suis redirigé vers la page historique du dashboard usager
    Et que je supprime tous les cookies
    Quand je me déconnecte du dashboard usager
    Alors je suis redirigé vers la page d'accueil du dashboard usager
    Et le message d'alerte "session expirée" n'est pas affiché
    Et je ne suis plus connecté au dashboard usager avec FranceConnect

  # Scénario à implémenter dans FC-1072
  @ignore 
  Scénario: User Dashboard - Connexion après expiration de session
    Etant donné que j'utilise un compte usager "pour le test de préférences FI"
    Et que je navigue sur la page d'accueil du dashboard usager
    Et que je supprime tous les cookies
    Quand je clique sur le bouton FranceConnect du dashboard usager
    Alors je suis redirigé vers la page d'accueil du dashboard usager
    Et le message d'alerte "session expirée" n'est pas affiché
