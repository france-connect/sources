#language: fr
@userDashboard @preferencesFI @ignoreHigh @ignoreLow
Fonctionnalité: Préférences FI - Message d'information autorisation futurs FI

  Scénario: Préférences FI - Un usager sans préférence FI bloque un FI TA02
    Etant donné que j'utilise un compte usager "sans préférence FI"
    Et que je navigue sur la page d'accueil du dashboard usager
    Et que je me connecte au dashboard usager
    Et que je suis redirigé vers la page historique du dashboard usager
    Et que je clique sur le lien vers la page gestion des accès du dashboard usager
    Et que je suis sur la page gestion des accès du dashboard usager
    Et que les fournisseurs d'identité existants sont autorisés
    Et que les futurs fournisseurs d'identité sont autorisés
    Et que le bouton "enregistrer mes réglages" est désactivé
    Quand je décide de bloquer le fournisseur d'identité "pour le test de préférences FI"
    Alors le message d'information "autorisation des futurs fournisseurs d'identité" est affiché
    Et le bouton "enregistrer mes réglages" est désactivé
    Et je décide de bloquer les futurs fournisseurs d'identité
    Et le message d'information "autorisation des futurs fournisseurs d'identité" n'est pas affiché
    Et le bouton "enregistrer mes réglages" est actif

  Scénario: Préférences FI - Un usager avec préférences FI par défaut qui bloque un FI TA03
    Etant donné que j'utilise un compte usager "pour le test de préférences FI"
    Et que je navigue sur la page d'accueil du dashboard usager
    Et que je me connecte au dashboard usager
    Et que je suis redirigé vers la page historique du dashboard usager
    Et que je clique sur le lien vers la page gestion des accès du dashboard usager
    Et que je suis sur la page gestion des accès du dashboard usager
    Et que je réinitialise les préférences de la configuration par défaut
    Et que le bouton "enregistrer mes réglages" est désactivé
    Quand je décide de bloquer le fournisseur d'identité "pour le test de préférences FI"
    Alors le message d'information "autorisation des futurs fournisseurs d'identité" est affiché
    Et le bouton "enregistrer mes réglages" est désactivé
    Et je confirme le message "autorisation des futurs fournisseurs d'identité"
    Et le message d'information "autorisation des futurs fournisseurs d'identité" n'est pas affiché
    Et le bouton "enregistrer mes réglages" est actif
    Et j'enregistre mes réglages d'accès

  Scénario: Préférences FI - Un usager avec FI bloqué et futurs FI autorisés qui bloque un FI TA04
    Etant donné que j'utilise un compte usager "pour le test de préférences FI"
    Et que je navigue sur la page d'accueil du dashboard usager
    Et que je me connecte au dashboard usager
    Et que je suis redirigé vers la page historique du dashboard usager
    Et que je clique sur le lien vers la page gestion des accès du dashboard usager
    Et que je suis sur la page gestion des accès du dashboard usager
    Et que le fournisseur d'identité "pour le test de préférences FI" est bloqué
    Et que les futurs fournisseurs d'identité sont autorisés
    Et que le bouton "enregistrer mes réglages" est désactivé
    Quand je décide de bloquer le fournisseur d'identité "par défaut"
    Alors le message d'information "autorisation des futurs fournisseurs d'identité" n'est pas affiché
    Et le bouton "enregistrer mes réglages" est actif

  Scénario: Préférences FI - Un usager avec tous les FI autorisés et futurs FI bloqués qui bloque un FI TA05
    Etant donné que j'utilise un compte usager "pour le test de préférences FI"
    Et que je navigue sur la page d'accueil du dashboard usager
    Et que je me connecte au dashboard usager
    Et que je suis redirigé vers la page historique du dashboard usager
    Et que je clique sur le lien vers la page gestion des accès du dashboard usager
    Et que je suis sur la page gestion des accès du dashboard usager
    Et que je réinitialise les préférences de la configuration par défaut
    Et que je décide de bloquer les futurs fournisseurs d'identité
    Et que j'enregistre mes réglages d'accès
    Et que je rafraîchis la page
    Et que le bouton "enregistrer mes réglages" est désactivé
    Quand je décide de bloquer le fournisseur d'identité "pour le test de préférences FI"
    Alors le message d'information "autorisation des futurs fournisseurs d'identité" n'est pas affiché
    Et le bouton "enregistrer mes réglages" est actif

  Scénario: Préférences FI - Un usager sans préférence FI bloque puis autorise à nouveau les futurs FI et bloque un FI TA06
    Etant donné que j'utilise un compte usager "sans préférence FI"
    Et que je navigue sur la page d'accueil du dashboard usager
    Et que je me connecte au dashboard usager
    Et que je suis redirigé vers la page historique du dashboard usager
    Et que je clique sur le lien vers la page gestion des accès du dashboard usager
    Et que je suis sur la page gestion des accès du dashboard usager
    Et que les fournisseurs d'identité existants sont autorisés
    Et que les futurs fournisseurs d'identité sont autorisés
    Et que le bouton "enregistrer mes réglages" est désactivé
    Et que je décide de bloquer les futurs fournisseurs d'identité
    Et que je décide d'autoriser les futurs fournisseurs d'identité
    Et que le bouton "enregistrer mes réglages" est désactivé
    Quand je décide de bloquer le fournisseur d'identité "pour le test de préférences FI"
    Alors le message d'information "autorisation des futurs fournisseurs d'identité" n'est pas affiché
    Et le bouton "enregistrer mes réglages" est actif

  Scénario: Préférences FI - Un usager avec les préférences FI par défaut confirme le message, revient à la configuration par défaut et bloque un FI TA07
    Etant donné que j'utilise un compte usager "pour le test de préférences FI"
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
    Quand je décide de bloquer le fournisseur d'identité "pour le test de préférences FI"
    Alors le message d'information "autorisation des futurs fournisseurs d'identité" n'est pas affiché
    Et le bouton "enregistrer mes réglages" est actif

  Scénario: Préférences FI - Un usager sans préférence FI bloque les futurs FI et bloque un FI TA08
    Etant donné que j'utilise un compte usager "sans préférence FI"
    Et que je navigue sur la page d'accueil du dashboard usager
    Et que je me connecte au dashboard usager
    Et que je suis redirigé vers la page historique du dashboard usager
    Et que je clique sur le lien vers la page gestion des accès du dashboard usager
    Et que je suis sur la page gestion des accès du dashboard usager
    Et que les fournisseurs d'identité existants sont autorisés
    Et que les futurs fournisseurs d'identité sont autorisés
    Et que le bouton "enregistrer mes réglages" est désactivé
    Et que je décide de bloquer les futurs fournisseurs d'identité
    Et que le bouton "enregistrer mes réglages" est actif
    Quand je décide de bloquer le fournisseur d'identité "pour le test de préférences FI"
    Alors le message d'information "autorisation des futurs fournisseurs d'identité" n'est pas affiché
    Et le bouton "enregistrer mes réglages" est actif

  Scénario: Préférences FI - Un usager avec préférences FI par défaut fait plusieurs enregistrements pour revenir à la configuration par défaut et bloque un FI TA09
    Etant donné que j'utilise un compte usager "pour le test de préférences FI"
    Et que je navigue sur la page d'accueil du dashboard usager
    Et que je me connecte au dashboard usager
    Et que je suis redirigé vers la page historique du dashboard usager
    Et que je clique sur le lien vers la page gestion des accès du dashboard usager
    Et que je suis sur la page gestion des accès du dashboard usager
    Et que je réinitialise les préférences de la configuration par défaut
    Et que je décide de bloquer les futurs fournisseurs d'identité
    Et que j'enregistre mes réglages d'accès
    Et que je décide d'autoriser les futurs fournisseurs d'identité
    Et que j'enregistre mes réglages d'accès
    Quand je décide de bloquer le fournisseur d'identité "pour le test de préférences FI"
    Alors le message d'information "autorisation des futurs fournisseurs d'identité" n'est pas affiché
    Et le bouton "enregistrer mes réglages" est actif

  Scénario: Préférences FI - Un usager avec préférences FI par défaut fait un enregistrement et bloque un FI TA10
    Etant donné que j'utilise un compte usager "pour le test de préférences FI"
    Et que je navigue sur la page d'accueil du dashboard usager
    Et que je me connecte au dashboard usager
    Et que je suis redirigé vers la page historique du dashboard usager
    Et que je clique sur le lien vers la page gestion des accès du dashboard usager
    Et que je suis sur la page gestion des accès du dashboard usager
    Et que je réinitialise les préférences de la configuration par défaut
    Et que je décide de bloquer le fournisseur d'identité "pour le test de préférences FI"
    Et que je confirme le message "autorisation des futurs fournisseurs d'identité"
    Et que j'enregistre mes réglages d'accès
    Quand je décide de bloquer le fournisseur d'identité "par défaut"
    Alors le message d'information "autorisation des futurs fournisseurs d'identité" n'est pas affiché
    Et le bouton "enregistrer mes réglages" est actif

  Scénario: Préférences FI - Un usager sans préférence FI bloque un FI, réautorise ce FI et confirme le message TA11
    Etant donné que j'utilise un compte usager "sans préférence FI"
    Et que je navigue sur la page d'accueil du dashboard usager
    Et que je me connecte au dashboard usager
    Et que je suis redirigé vers la page historique du dashboard usager
    Et que je clique sur le lien vers la page gestion des accès du dashboard usager
    Et que je suis sur la page gestion des accès du dashboard usager
    Et que je décide de bloquer le fournisseur d'identité "pour le test de préférences FI"
    Et que le message d'information "autorisation des futurs fournisseurs d'identité" est affiché
    Et que le bouton "enregistrer mes réglages" est désactivé
    Quand je décide d'autoriser le fournisseur d'identité "pour le test de préférences FI"
    Alors le message d'information "autorisation des futurs fournisseurs d'identité" est affiché
    Et je confirme le message "autorisation des futurs fournisseurs d'identité"
    Et le message d'information "autorisation des futurs fournisseurs d'identité" n'est pas affiché
    Et le bouton "enregistrer mes réglages" est désactivé

  Scénario: Préférences FI - Retour à la configuration par défaut
    Etant donné que j'utilise un compte usager "pour le test de préférences FI"
    Et que je navigue sur la page d'accueil du dashboard usager
    Et que je me connecte au dashboard usager
    Et que je suis redirigé vers la page historique du dashboard usager
    Et que je clique sur le lien vers la page gestion des accès du dashboard usager
    Et que je suis sur la page gestion des accès du dashboard usager
    Quand je réinitialise les préférences de la configuration par défaut
    Alors je me déconnecte du dashboard usager
