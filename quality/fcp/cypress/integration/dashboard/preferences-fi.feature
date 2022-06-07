#language: fr
@userDashboard @preferencesFI @ignoreHigh @ignoreLow
Fonctionnalité: Préférences FI
  # En tant qu'usager de FranceConnect,
  # je veux gérer mes préférences de fournisseurs d'identité
  # afin de contrôler les FI utilisables avec FranceConnect

  Scénario: Préférences FI - Usager sans préférence FI
    Etant donné que j'utilise un compte usager "sans préférence FI"
    Quand je me connecte à FranceConnect Legacy
    Alors je suis connecté sur la page du fournisseur de service Legacy

  Scénario: Préférences FI - FI bloqué - futur FI autorisé
    Etant donné que j'utilise un compte usager "pour le test de préférences FI"
    Et que je navigue sur la page d'accueil du dashboard usager
    Et que je me connecte au dashboard usager
    Et que je suis redirigé vers la page historique du dashboard usager
    Et que je clique sur le lien vers la page gestion des accès du dashboard usager
    Et que je suis sur la page gestion des accès du dashboard usager
    Et que j'utilise le fournisseur d'identité "pour le test de préférences FI"
    Et que je décide de bloquer le fournisseur d'identité
    Et que je décide d'autoriser les futurs fournisseurs d'identité par défaut
    Et que j'enregistre mes réglages d'accès
    Et que je me déconnecte du dashboard usager
    Quand je me connecte au fournisseur d'identité via FranceConnect Legacy
    Alors je suis redirigé vers la page erreur technique FranceConnect Legacy
    Et le code d'erreur FranceConnect Legacy est "E000035"
    Et le message d'erreur FranceConnect Legacy est "Vous avez bloqué l'utilisation de ce fournisseur d'identité. Pour pouvoir l'utiliser, merci de vous rendre dans vos préférences FranceConnect pour l'autoriser."

  Scénario: Préférences FI - FI bloqué - futur FI bloqué
    Etant donné que j'utilise un compte usager "pour le test de préférences FI"
    Et que je navigue sur la page d'accueil du dashboard usager
    Et que je me connecte au dashboard usager
    Et que je suis redirigé vers la page historique du dashboard usager
    Et que je clique sur le lien vers la page gestion des accès du dashboard usager
    Et que je suis sur la page gestion des accès du dashboard usager
    Et que j'utilise le fournisseur d'identité "pour le test de préférences FI"
    Et que je décide de bloquer le fournisseur d'identité
    Et que je décide de bloquer les futurs fournisseurs d'identité par défaut
    Et que j'enregistre mes réglages d'accès
    Et que je me déconnecte du dashboard usager
    Quand je me connecte au fournisseur d'identité via FranceConnect Legacy
    Alors je suis redirigé vers la page erreur technique FranceConnect Legacy
    Et le code d'erreur FranceConnect Legacy est "E000035"
    Et le message d'erreur FranceConnect Legacy est "Vous avez bloqué l'utilisation de ce fournisseur d'identité. Pour pouvoir l'utiliser, merci de vous rendre dans vos préférences FranceConnect pour l'autoriser."

  Scénario: Préférences FI - FI autorisé - futur FI autorisé
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
    Quand je me connecte à FranceConnect Legacy
    Alors je suis connecté sur la page du fournisseur de service Legacy

  Scénario: Préférences FI - FI autorisé - futur FI bloqué
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
    Quand je me connecte à FranceConnect Legacy
    Alors je suis connecté sur la page du fournisseur de service Legacy

  Scénario: Préférences FI - FI ajouté - futur FI autorisé
    Etant donné que j'utilise un compte usager "pour le test de préférences FI"
    Et que je navigue sur la page d'accueil du dashboard usager
    Et que je me connecte au dashboard usager
    Et que je suis redirigé vers la page historique du dashboard usager
    Et que je clique sur le lien vers la page gestion des accès du dashboard usager
    Et que je suis sur la page gestion des accès du dashboard usager
    Et que je décide d'autoriser les futurs fournisseurs d'identité par défaut
    Et que j'enregistre mes réglages d'accès
    Et que je me déconnecte du dashboard usager
    Et que je crée le fournisseur d'identité "fip4_idp-settings" avec la configuration "fiLegacy" sur le site d'exploitation
    Et que j'utilise le dernier fournisseur d'identité créé
    Quand je me connecte à FranceConnect Legacy
    Alors je suis connecté sur la page du fournisseur de service Legacy
    Et je supprime le fournisseur d'identité "fip4_idp-settings" sur le site d'exploitation

  Scénario: Préférences FI - FI ajouté - futur FI bloqué
    Etant donné que j'utilise un compte usager "pour le test de préférences FI"
    Et que je navigue sur la page d'accueil du dashboard usager
    Et que je me connecte au dashboard usager
    Et que je suis redirigé vers la page historique du dashboard usager
    Et que je clique sur le lien vers la page gestion des accès du dashboard usager
    Et que je suis sur la page gestion des accès du dashboard usager
    Et que je décide de bloquer les futurs fournisseurs d'identité par défaut
    Et que j'enregistre mes réglages d'accès
    Et que je me déconnecte du dashboard usager
    Et que je crée le fournisseur d'identité "fip4_idp-settings" avec la configuration "fiLegacy" sur le site d'exploitation
    Et que j'utilise le dernier fournisseur d'identité créé
    Quand je me connecte au fournisseur d'identité via FranceConnect Legacy
    Alors je suis redirigé vers la page erreur technique FranceConnect Legacy
    Et le code d'erreur FranceConnect Legacy est "E000035"
    Et le message d'erreur FranceConnect Legacy est "Vous avez bloqué l'utilisation de ce fournisseur d'identité. Pour pouvoir l'utiliser, merci de vous rendre dans vos préférences FranceConnect pour l'autoriser."
    Et je supprime le fournisseur d'identité "fip4_idp-settings" sur le site d'exploitation
