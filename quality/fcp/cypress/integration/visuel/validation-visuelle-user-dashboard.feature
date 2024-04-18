#language: fr
@validationVisuelle @userDashboard
Fonctionnalité: Validation Visuelle - User Dashboard

  Scénario: Validation Visuelle - Réinitialiser les Préférences FI
    Etant donné que j'utilise un compte usager "pour le test de préférences FI"
    Et que je navigue sur la page d'accueil du tableau de bord usager
    Et que je me connecte au tableau de bord usager
    Et que je suis redirigé vers la page historique du tableau de bord usager
    Et que je navigue directement vers la page gestion des accès du tableau de bord usager
    Et que je suis sur la page gestion des accès du tableau de bord usager
    Quand je réinitialise les préférences de la configuration par défaut

  Plan du Scénario: Validation Visuelle - Historique des connexions sur <device>
    Etant donné que j'utilise un compte usager "pour les tests de traces"
    Et que j'utilise un navigateur web sur "<device>"
    Et que les traces "FranceConnect(CL) et FranceConnect+" contiennent "des connexions récentes et anciennes de plus de 6 mois"
    Et que je navigue sur la page d'accueil du tableau de bord usager
    Et que la copie d'écran "udHome" correspond à la page actuelle sur "<device>"
    Quand je me connecte au tableau de bord usager
    Alors je suis redirigé vers la page historique du tableau de bord usager
    Et 3 évènements "FranceConnect+" sont affichés
    Et 7 évènements "FranceConnect" sont affichés
    Et les évènements "FranceConnect+" ont moins de 6 mois
    Et les évènements "FranceConnect" ont moins de 6 mois
    Et la copie d'écran "udHistory" correspond à la page actuelle sur "<device>"
    Et j'affiche le détail de tous les évènements
    Et la copie d'écran "udHistoryDetail" correspond à la page actuelle sur "<device>"

    Exemples:
      | device           |
      | mobile           |
      | tablet portrait  |
      | tablet landscape |
      | desktop          |

  Plan du Scénario: Validation Visuelle - Préférences FI sur <device>
    Etant donné que j'utilise un compte usager "pour le test de préférences FI"
    Et que j'utilise un navigateur web sur "<device>"
    Et que je navigue sur la page d'accueil du tableau de bord usager
    Et que je me connecte au tableau de bord usager
    Et que je suis redirigé vers la page historique du tableau de bord usager
    Quand je navigue directement vers la page gestion des accès du tableau de bord usager
    Alors la copie d'écran "udPreferences" correspond à la page actuelle sur "<device>"

    Exemples:
      | device           |
      | tablet portrait  |
      | tablet landscape |
      | desktop          |

  Scénario: Validation Visuelle - Préférences FI sur mobile
    Etant donné que j'utilise un compte usager "pour le test de préférences FI"
    Et que j'utilise un navigateur web sur "mobile"
    Et que je navigue sur la page d'accueil du tableau de bord usager
    Et que je me connecte au tableau de bord usager
    Et que je suis redirigé vers la page historique du tableau de bord usager
    Quand j'ouvre le menu de navigation mobile du tableau de bord usager
    Et la copie d'écran "udNavMobile" correspond à la page actuelle sur "mobile"
    Et je clique sur le lien gérer mes accés dans le menu de navigation mobile
    Alors je suis redirigé vers la page gestion des accès du tableau de bord usager
    Et la copie d'écran "udPreferences" correspond à la page actuelle sur "mobile"

  Plan du Scénario: Validation Visuelle - Mail de modification des Préférences FI sur <device>
    Etant donné que j'utilise un compte usager "pour le test de préférences FI"
    Et que j'utilise un navigateur web sur "<device>"
    Et que je navigue sur la page d'accueil du tableau de bord usager
    Et que je me connecte au tableau de bord usager
    Et que je suis redirigé vers la page historique du tableau de bord usager
    Et que je navigue directement vers la page gestion des accès du tableau de bord usager
    Et que je suis sur la page gestion des accès du tableau de bord usager
    Et que je réinitialise les préférences de la configuration par défaut
    Et que je supprime les mails envoyés à l'usager
    Et que j'utilise le fournisseur d'identité "pour le test de préférences FI"
    Et que je décide de bloquer le fournisseur d'identité
    Et que je décide d'autoriser les futurs fournisseurs d'identité par défaut
    Et que je confirme le message "autorisation des futurs fournisseurs d'identité"
    Quand je clique sur le bouton "enregistrer mes réglages"
    Alors le message "notification de modifications envoyée" est affiché
    Et le mail "modification de préférences FI" est envoyé
    Et la copie d'écran "udPreferencesMail" correspond à la page actuelle sur "<device>"

    Exemples:
      | device           |
      | mobile           |
      | tablet portrait  |
      | tablet landscape |
      | desktop          |
