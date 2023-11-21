#language: fr
@userDashboard @preferencesFISupport
Fonctionnalité: Préférences FI - Support
  # En tant que membre de l'équipe Support de FranceConnect,
  # je veux consulter les préférences de fournisseurs d'identité d'un usager
  # afin de comprendre la configuration d'un usager

  Scénario: Préférences FI - Support - usager n'ayant jamais utilisé FranceConnect
    Etant donné que j'utilise un compte usager "n'ayant jamais utilisé FranceConnect"
    Et que je navigue sur la page login du support
    Et que je me connecte au support en tant que "support"
    Quand j'effectue un redressement RNIPP pour l'usager
    Alors le numéro de ticket support est affiché
    Et les informations RNIPP de l'usager sont affichées
    Et le code retour RNIPP est "2"
    Et l'usager est inconnu de FranceConnect
    Et les préférences FI de l'usager ne sont pas affichées

  Scénario: Préférences FI - Support - sans préférences FI
    Etant donné que j'utilise un compte usager "sans préférence FI"
    Et que j'ai fait une cinématique FranceConnect
    Et que je navigue sur la page login du support
    Et que je me connecte au support en tant que "support"
    Et que je navigue vers la page redressement RNIPP
    Quand j'effectue un redressement RNIPP pour l'usager
    Alors le numéro de ticket support est affiché
    Et les informations RNIPP de l'usager sont affichées
    Et le code retour RNIPP est "2"
    Et le statut de l'usager est "actif"
    Et la date de dernière connexion est affichée
    Et les préférences FI de l'usager ne sont pas affichées

  @ci
  Scénario: Préférences FI - Support - préférences FI d'un présumé né jour et mois
    Etant donné que j'utilise un compte usager "présumé né jour et mois"
    Et que je navigue sur la page d'accueil du dashboard usager
    Et que je me connecte au dashboard usager
    Et que je suis redirigé vers la page historique du dashboard usager
    Et que je clique sur le lien vers la page gestion des accès du dashboard usager
    Et que je suis sur la page gestion des accès du dashboard usager
    Et que je réinitialise les préférences de la configuration par défaut
    Et que je décide de bloquer le fournisseur d'identité "pour le test de préférences FI"
    Et que je confirme le message "autorisation des futurs fournisseurs d'identité"
    Et que j'enregistre mes réglages d'accès
    Et que je décide d'autoriser le fournisseur d'identité "pour le test de préférences FI"
    Et que j'enregistre mes réglages d'accès
    Et que je me déconnecte du dashboard usager
    Et que je navigue sur la page login du support
    Et que je me connecte au support en tant que "support"
    Et que je navigue vers la page redressement RNIPP
    Quand j'effectue un redressement RNIPP pour l'usager "présumé né jour et mois"
    Alors le numéro de ticket support est affiché
    Et les informations RNIPP de l'usager sont affichées
    Et le code retour RNIPP est "2"
    Et les préférences FI de l'usager sont affichées
    Et le statut des futurs fournisseurs d'identité dans support est "autorisés"
    Et tous les fournisseurs d'identité dans exploitation sont "autorisés"

  Scénario: Préférences FI - Support - préférences FI d'un présumé né jour
    Etant donné que j'utilise un compte usager "présumé né jour"
    Et que je navigue sur la page d'accueil du dashboard usager
    Et que je me connecte au dashboard usager
    Et que je suis redirigé vers la page historique du dashboard usager
    Et que je clique sur le lien vers la page gestion des accès du dashboard usager
    Et que je suis sur la page gestion des accès du dashboard usager
    Et que je réinitialise les préférences de la configuration par défaut
    Et que je décide de bloquer le fournisseur d'identité "pour le test de préférences FI"
    Et que je confirme le message "autorisation des futurs fournisseurs d'identité"
    Et que j'enregistre mes réglages d'accès
    Et que je décide d'autoriser le fournisseur d'identité "pour le test de préférences FI"
    Et que j'enregistre mes réglages d'accès
    Et que je me déconnecte du dashboard usager
    Et que je navigue sur la page login du support
    Et que je me connecte au support en tant que "support"
    Et que je navigue vers la page redressement RNIPP
    Quand j'effectue un redressement RNIPP pour l'usager "présumé né jour"
    Alors le numéro de ticket support est affiché
    Et les informations RNIPP de l'usager sont affichées
    Et le code retour RNIPP est "2"
    Et les préférences FI de l'usager sont affichées
    Et le statut des futurs fournisseurs d'identité dans support est "autorisés"
    Et tous les fournisseurs d'identité dans exploitation sont "autorisés"

  Scénario: Préférences FI - Support - FI bloqué - futur FI autorisé
    Etant donné que j'utilise un compte usager "pour le test de préférences FI"
    Et que je navigue sur la page d'accueil du dashboard usager
    Et que je me connecte au dashboard usager
    Et que je suis redirigé vers la page historique du dashboard usager
    Et que je clique sur le lien vers la page gestion des accès du dashboard usager
    Et que je suis sur la page gestion des accès du dashboard usager
    Et que je réinitialise les préférences de la configuration par défaut
    Et que j'utilise le fournisseur d'identité "pour le test de préférences FI"
    Et que je décide de bloquer le fournisseur d'identité
    Et que je décide d'autoriser les futurs fournisseurs d'identité par défaut
    Et que je confirme le message "autorisation des futurs fournisseurs d'identité"
    Et que j'enregistre mes réglages d'accès
    Et que je me déconnecte du dashboard usager
    Et que je navigue sur la page login du support
    Et que je me connecte au support en tant que "support"
    Et que je navigue vers la page redressement RNIPP
    Quand j'effectue un redressement RNIPP pour l'usager "pour le test de préférences FI"
    Alors le numéro de ticket support est affiché
    Et les informations RNIPP de l'usager sont affichées
    Et le code retour RNIPP est "2"
    Et les préférences FI de l'usager sont affichées
    Et le statut des futurs fournisseurs d'identité dans support est "autorisés"
    Et le statut du fournisseur d'identité "pour le test de préférences FI" dans support est "bloqué"

  Scénario: Préférences FI - Support - FI autorisé - futur FI bloqué
    Etant donné que j'utilise un compte usager "pour le test de préférences FI"
    Et que je navigue sur la page d'accueil du dashboard usager
    Et que je me connecte au dashboard usager
    Et que je suis redirigé vers la page historique du dashboard usager
    Et que je clique sur le lien vers la page gestion des accès du dashboard usager
    Et que je suis sur la page gestion des accès du dashboard usager
    Et que j'utilise le fournisseur d'identité "pour le test de préférences FI"
    Et que je décide d'autoriser le fournisseur d'identité
    Et que je décide de bloquer les futurs fournisseurs d'identité par défaut
    Et que j'enregistre mes réglages d'accès
    Et que je me déconnecte du dashboard usager
    Et que je navigue sur la page login du support
    Et que je me connecte au support en tant que "support"
    Et que je navigue vers la page redressement RNIPP
    Quand j'effectue un redressement RNIPP pour l'usager "pour le test de préférences FI"
    Alors le numéro de ticket support est affiché
    Et les informations RNIPP de l'usager sont affichées
    Et le code retour RNIPP est "2"
    Et les préférences FI de l'usager sont affichées
    Et le statut des futurs fournisseurs d'identité dans support est "bloqués"
    Et le statut du fournisseur d'identité "pour le test de préférences FI" dans support est "autorisé"

  Scénario: Préférences FI - Support - FI autorisé - futur FI autorisé
    Etant donné que j'utilise un compte usager "pour le test de préférences FI"
    Et que je navigue sur la page d'accueil du dashboard usager
    Et que je me connecte au dashboard usager
    Et que je suis redirigé vers la page historique du dashboard usager
    Et que je clique sur le lien vers la page gestion des accès du dashboard usager
    Et que je suis sur la page gestion des accès du dashboard usager
    Et que j'utilise le fournisseur d'identité "pour le test de préférences FI"
    Et que je décide d'autoriser le fournisseur d'identité
    Et que je décide d'autoriser les futurs fournisseurs d'identité par défaut
    Et que j'enregistre mes réglages d'accès
    Et que je me déconnecte du dashboard usager
    Et que je navigue sur la page login du support
    Et que je me connecte au support en tant que "support"
    Et que je navigue vers la page redressement RNIPP
    Quand j'effectue un redressement RNIPP pour l'usager "pour le test de préférences FI"
    Alors le numéro de ticket support est affiché
    Et les informations RNIPP de l'usager sont affichées
    Et le code retour RNIPP est "2"
    Et les préférences FI de l'usager sont affichées
    Et le statut des futurs fournisseurs d'identité dans support est "autorisés"
    Et le statut du fournisseur d'identité "pour le test de préférences FI" dans support est "autorisé"
