#language: fr
@userDashboard @preferencesFI
Fonctionnalité: Préférences FI
  # En tant qu'usager de FranceConnect,
  # je veux gérer mes préférences de fournisseurs d'identité
  # afin de contrôler les FI utilisables avec FranceConnect

  @ci
  Scénario: Préférences FI - Connexion d'un usager sans préférence FI
    Etant donné que j'utilise un compte usager "sans préférence FI"
    Quand je me connecte à FranceConnect
    Alors je suis connecté au fournisseur de service

  Scénario: Préférences FI - Configuration par défaut pour un usager sans préférences FI
    Etant donné que j'utilise un compte usager "sans préférence FI"
    Et que je navigue sur la page d'accueil du tableau de bord usager
    Et que je me connecte au tableau de bord usager
    Et que je suis redirigé vers la page historique du tableau de bord usager
    Quand je clique sur le lien vers la page gestion des accès du tableau de bord usager
    Alors je suis sur la page gestion des accès du tableau de bord usager
    Et les fournisseurs d'identité existants sont autorisés
    Et le fournisseur d'identité "par défaut" n'est pas blocable
    Et les futurs fournisseurs d'identité sont autorisés
    Et le bouton "enregistrer mes réglages" est désactivé
    Et le message d'information "autorisation des futurs fournisseurs d'identité" n'est pas affiché

  @ci
  Scénario: Préférences FI - FI bloqué - futur FI autorisé
    Etant donné que j'utilise un compte usager "pour le test de préférences FI"
    Et que je navigue sur la page d'accueil du tableau de bord usager
    Et que je me connecte au tableau de bord usager
    Et que je suis redirigé vers la page historique du tableau de bord usager
    Et que je clique sur le lien vers la page gestion des accès du tableau de bord usager
    Et que je suis sur la page gestion des accès du tableau de bord usager
    Et que je réinitialise les préférences de la configuration par défaut
    Et que j'utilise le fournisseur d'identité "pour le test de préférences FI"
    Et que je décide de bloquer le fournisseur d'identité
    Et que je décide d'autoriser les futurs fournisseurs d'identité par défaut
    Et que je confirme le message "autorisation des futurs fournisseurs d'identité"
    Et que je clique sur le bouton "enregistrer mes réglages"
    Et que le message "notification de modifications envoyée" est affiché
    Et que je me déconnecte du tableau de bord usager
    Quand je me connecte au fournisseur d'identité via FranceConnect
    Alors je suis redirigé vers la page erreur technique FranceConnect
    Et le code d'erreur FranceConnect est "E000035"
    Et le message d'erreur FranceConnect est "Vous avez bloqué l'utilisation de ce fournisseur d'identité. Pour pouvoir l'utiliser, merci de vous rendre dans vos préférences FranceConnect pour l'autoriser."

  Scénario: Préférences FI - FI bloqué - futur FI bloqué
    Etant donné que j'utilise un compte usager "pour le test de préférences FI"
    Et que je navigue sur la page d'accueil du tableau de bord usager
    Et que je me connecte au tableau de bord usager
    Et que je suis redirigé vers la page historique du tableau de bord usager
    Et que je clique sur le lien vers la page gestion des accès du tableau de bord usager
    Et que je suis sur la page gestion des accès du tableau de bord usager
    Et que j'utilise le fournisseur d'identité "pour le test de préférences FI"
    Et que je décide de bloquer le fournisseur d'identité
    Et que je décide de bloquer les futurs fournisseurs d'identité par défaut
    Et que j'enregistre mes réglages d'accès
    Et que je me déconnecte du tableau de bord usager
    Quand je me connecte au fournisseur d'identité via FranceConnect
    Alors je suis redirigé vers la page erreur technique FranceConnect
    Et le code d'erreur FranceConnect est "E000035"
    Et le message d'erreur FranceConnect est "Vous avez bloqué l'utilisation de ce fournisseur d'identité. Pour pouvoir l'utiliser, merci de vous rendre dans vos préférences FranceConnect pour l'autoriser."

  @ci
  Scénario: Préférences FI - FI autorisé - futur FI autorisé
    Etant donné que j'utilise un compte usager "pour le test de préférences FI"
    Et que je navigue sur la page d'accueil du tableau de bord usager
    Et que je me connecte au tableau de bord usager
    Et que je suis redirigé vers la page historique du tableau de bord usager
    Et que je clique sur le lien vers la page gestion des accès du tableau de bord usager
    Et que je suis sur la page gestion des accès du tableau de bord usager
    Et que j'utilise le fournisseur d'identité "pour le test de préférences FI"
    Et que je décide d'autoriser le fournisseur d'identité
    Et que je décide d'autoriser les futurs fournisseurs d'identité par défaut
    Et que j'enregistre mes réglages d'accès
    Et que je me déconnecte du tableau de bord usager
    Quand je me connecte à FranceConnect
    Alors je suis connecté au fournisseur de service

  Scénario: Préférences FI - FI autorisé - futur FI bloqué
    Etant donné que j'utilise un compte usager "pour le test de préférences FI"
    Et que je navigue sur la page d'accueil du tableau de bord usager
    Et que je me connecte au tableau de bord usager
    Et que je suis redirigé vers la page historique du tableau de bord usager
    Et que je clique sur le lien vers la page gestion des accès du tableau de bord usager
    Et que je suis sur la page gestion des accès du tableau de bord usager
    Et que j'utilise le fournisseur d'identité "pour le test de préférences FI"
    Et que je décide d'autoriser le fournisseur d'identité
    Et que je décide de bloquer les futurs fournisseurs d'identité par défaut
    Et que j'enregistre mes réglages d'accès
    Et que je me déconnecte du tableau de bord usager
    Quand je me connecte à FranceConnect
    Alors je suis connecté au fournisseur de service

  Scénario: Préférences FI - FI ajouté - futur FI autorisé
    Etant donné que j'utilise un compte usager "pour le test de préférences FI"
    Et que je navigue sur la page d'accueil du tableau de bord usager
    Et que je me connecte au tableau de bord usager
    Et que je suis redirigé vers la page historique du tableau de bord usager
    Et que je clique sur le lien vers la page gestion des accès du tableau de bord usager
    Et que je suis sur la page gestion des accès du tableau de bord usager
    Et que je décide d'autoriser les futurs fournisseurs d'identité par défaut
    Et que j'enregistre mes réglages d'accès
    Et que je me déconnecte du tableau de bord usager
    Et que je crée le fournisseur d'identité "bdd-idp-fip1-future" avec la configuration "fiLegacy" sur le site d'exploitation
    Et que j'utilise le dernier fournisseur d'identité créé
    Quand je me connecte à FranceConnect
    Alors je suis connecté au fournisseur de service
    Et je supprime le fournisseur d'identité "bdd-idp-fip1-future" sur le site d'exploitation

  Scénario: Préférences FI - FI ajouté - futur FI bloqué
    Etant donné que j'utilise un compte usager "pour le test de préférences FI"
    Et que je navigue sur la page d'accueil du tableau de bord usager
    Et que je me connecte au tableau de bord usager
    Et que je suis redirigé vers la page historique du tableau de bord usager
    Et que je clique sur le lien vers la page gestion des accès du tableau de bord usager
    Et que je suis sur la page gestion des accès du tableau de bord usager
    Et que je décide de bloquer les futurs fournisseurs d'identité par défaut
    Et que j'enregistre mes réglages d'accès
    Et que je me déconnecte du tableau de bord usager
    Et que je crée le fournisseur d'identité "bdd-idp-fip1-future" avec la configuration "fiLegacy" sur le site d'exploitation
    Et que j'utilise le dernier fournisseur d'identité créé
    Quand je me connecte au fournisseur d'identité via FranceConnect
    Alors je suis redirigé vers la page erreur technique FranceConnect
    Et le code d'erreur FranceConnect est "E000035"
    Et le message d'erreur FranceConnect est "Vous avez bloqué l'utilisation de ce fournisseur d'identité. Pour pouvoir l'utiliser, merci de vous rendre dans vos préférences FranceConnect pour l'autoriser."
    Et je supprime le fournisseur d'identité "bdd-idp-fip1-future" sur le site d'exploitation

  Scénario: Préférences FI - FI utilisé pour la connexion au user-dashboard ne peut être bloqué
    Etant donné que j'utilise un compte usager "pour le test de préférences FI"
    Et que j'utilise le fournisseur d'identité "par défaut"
    Et que je navigue sur la page d'accueil du tableau de bord usager
    Et que je me connecte au tableau de bord usager
    Et que je suis redirigé vers la page historique du tableau de bord usager
    Quand je clique sur le lien vers la page gestion des accès du tableau de bord usager
    Alors je suis sur la page gestion des accès du tableau de bord usager
    Et le fournisseur d'identité "par défaut" n'est pas blocable

  Scénario: Préférences FI - Impossible de bloquer le FI utilisé en forçant l'UI
    Etant donné que j'utilise un compte usager "pour le test de préférences FI"
    Et que j'utilise le fournisseur d'identité "par défaut"
    Et que je navigue sur la page d'accueil du tableau de bord usager
    Et que je me connecte au tableau de bord usager
    Et que je suis redirigé vers la page historique du tableau de bord usager
    Et que je clique sur le lien vers la page gestion des accès du tableau de bord usager
    Et que je suis sur la page gestion des accès du tableau de bord usager
    Et que le fournisseur d'identité "par défaut" n'est pas blocable
    Quand je force le statut du fournisseur d'identité "par défaut" à l'état bloqué
    Et je clique sur le bouton "enregistrer mes réglages"
    Alors je suis redirigé vers la page d'erreur du tableau de bord usager
    Et l'erreur "accès interdit" est affichée

  Scénario: Préférences FI - Aidants Connect ne doit pas être configurable
    Etant donné que j'utilise un compte usager "pour le test de préférences FI"
    Et que je navigue sur la page d'accueil du tableau de bord usager
    Et que je me connecte au tableau de bord usager
    Et que je suis redirigé vers la page historique du tableau de bord usager
    Quand je clique sur le lien vers la page gestion des accès du tableau de bord usager
    Alors je suis sur la page gestion des accès du tableau de bord usager
    Et le fournisseur d'identité "Aidants Connect" n'est pas présent dans la liste
    Et je réinitialise les préférences de la configuration par défaut
    Et je me déconnecte du tableau de bord usager

  @ignoreInteg01
  Scénario: Préférences FI - Aidants Connect bloqué quand les futurs FI sont bloqués
    Etant donné que j'utilise un compte usager "pour le test de préférences FI"
    Et que je navigue sur la page d'accueil du tableau de bord usager
    Et que je me connecte au tableau de bord usager
    Et que je suis redirigé vers la page historique du tableau de bord usager
    Et que je clique sur le lien vers la page gestion des accès du tableau de bord usager
    Et que je suis sur la page gestion des accès du tableau de bord usager
    Et que je décide de bloquer les futurs fournisseurs d'identité par défaut
    Et que j'enregistre mes réglages d'accès
    Et que je me déconnecte du tableau de bord usager
    Et que j'utilise le fournisseur d'identité "Aidants Connect"
    Quand je me connecte au fournisseur d'identité via FranceConnect
    Alors je suis redirigé vers la page erreur technique FranceConnect
    Et le code d'erreur FranceConnect est "E000035"
    Et le message d'erreur FranceConnect est "Vous avez bloqué l'utilisation de ce fournisseur d'identité. Pour pouvoir l'utiliser, merci de vous rendre dans vos préférences FranceConnect pour l'autoriser."

  @ignoreInteg01
  Scénario: Préférences FI - Aidants Connect autorisé quand les futurs FI sont autorisés
    Etant donné que j'utilise un compte usager "pour le test de préférences FI"
    Et que je navigue sur la page d'accueil du tableau de bord usager
    Et que je me connecte au tableau de bord usager
    Et que je suis redirigé vers la page historique du tableau de bord usager
    Et que je clique sur le lien vers la page gestion des accès du tableau de bord usager
    Et que je suis sur la page gestion des accès du tableau de bord usager
    Et que je décide d'autoriser les futurs fournisseurs d'identité par défaut
    Et que j'enregistre mes réglages d'accès
    Et que je me déconnecte du tableau de bord usager
    Et que j'utilise le fournisseur d'identité "Aidants Connect"
    Quand je me connecte à FranceConnect
    Alors je suis connecté au fournisseur de service
