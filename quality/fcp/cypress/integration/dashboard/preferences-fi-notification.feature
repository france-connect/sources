#language: fr
@userDashboard @preferencesFI @ignoreHigh @ignoreLow @ignoreInteg01
Fonctionnalité: Préférences FI - Notification
  # En tant qu'usager de FranceConnect,
  # je veux recevoir une notification quand mes préférences FI sont changées
  # afin d'être averti d'une éventuelle modification à mon insu

  Scénario: Préférences FI - Notification - 1 FI bloqué (1 modification listée)
    Etant donné que j'utilise un compte usager "pour le test de préférences FI"
    Et que je supprime les mails envoyés à l'usager
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
    Quand je clique sur le bouton "enregistrer mes réglages"
    Alors le message "notification de modifications envoyée" est affiché
    Et le mail "modification de préférences FI" est envoyé
    Et la date et heure est correcte dans le mail "modification de préférences FI"
    Et 1 modification est listée dans le mail "modification de préférences FI"
    Et le fournisseur d'identité est bloqué dans le mail "modification de préférences FI"

  Scénario: Préférences FI - Notification - 1 FI autorisé (1 modification listée)
    Etant donné que j'utilise un compte usager "pour le test de préférences FI"
    Et que je navigue sur la page d'accueil du dashboard usager
    Et que je me connecte au dashboard usager
    Et que je suis redirigé vers la page historique du dashboard usager
    Et que je clique sur le lien vers la page gestion des accès du dashboard usager
    Et que je suis sur la page gestion des accès du dashboard usager
    Et que j'utilise le fournisseur d'identité "pour le test de préférences FI"
    Et que je décide d'autoriser le fournisseur d'identité
    Et que je décide d'autoriser les futurs fournisseurs d'identité par défaut
    Quand je clique sur le bouton "enregistrer mes réglages"
    Alors le message "notification de modifications envoyée" est affiché
    Et le mail "modification de préférences FI" est envoyé
    Et la date et heure est correcte dans le mail "modification de préférences FI"
    Et 1 modification est listée dans le mail "modification de préférences FI"
    Et le fournisseur d'identité est autorisé dans le mail "modification de préférences FI"

  Scénario: Préférences FI - Notification - 1 FI bloqué - futur FI bloqué (2 modifications listées)
    Etant donné que j'utilise un compte usager "pour le test de préférences FI"
    Et que je navigue sur la page d'accueil du dashboard usager
    Et que je me connecte au dashboard usager
    Et que je suis redirigé vers la page historique du dashboard usager
    Et que je clique sur le lien vers la page gestion des accès du dashboard usager
    Et que je suis sur la page gestion des accès du dashboard usager
    Et que j'utilise le fournisseur d'identité "pour le test de préférences FI"
    Et que je décide de bloquer le fournisseur d'identité
    Et que je décide de bloquer les futurs fournisseurs d'identité par défaut
    Quand je clique sur le bouton "enregistrer mes réglages"
    Alors le message "notification de modifications envoyée" est affiché
    Et le mail "modification de préférences FI" est envoyé
    Et la date et heure est correcte dans le mail "modification de préférences FI"
    Et 2 modifications sont listées dans le mail "modification de préférences FI"
    Et le fournisseur d'identité est bloqué dans le mail "modification de préférences FI"
    Et les futurs fournisseurs d'identité sont bloqués dans le mail "modification de préférences FI"

  Scénario: Préférences FI - Notification - 1 FI autorisé - futur FI autorisé (2 modifications listées)
    Etant donné que j'utilise un compte usager "pour le test de préférences FI"
    Et que je navigue sur la page d'accueil du dashboard usager
    Et que je me connecte au dashboard usager
    Et que je suis redirigé vers la page historique du dashboard usager
    Et que je clique sur le lien vers la page gestion des accès du dashboard usager
    Et que je suis sur la page gestion des accès du dashboard usager
    Et que j'utilise le fournisseur d'identité "pour le test de préférences FI"
    Et que je décide d'autoriser le fournisseur d'identité
    Et que je décide d'autoriser les futurs fournisseurs d'identité par défaut
    Quand je clique sur le bouton "enregistrer mes réglages"
    Alors le message "notification de modifications envoyée" est affiché
    Et le mail "modification de préférences FI" est envoyé
    Et la date et heure est correcte dans le mail "modification de préférences FI"
    Et 2 modifications sont listées dans le mail "modification de préférences FI"
    Et le fournisseur d'identité est autorisé dans le mail "modification de préférences FI"
    Et les futurs fournisseurs d'identité sont autorisés dans le mail "modification de préférences FI"
