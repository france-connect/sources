#language: fr
@validationVisuelle @userDashboard @ignoreLow @ignoreHigh
Fonctionnalité: Validation Visuelle - User Dashboard

  Plan du Scénario: Validation Visuelle - Historique des connexions sur <device>
    Etant donné que j'utilise un compte usager "pour les tests de traces"
    Et que j'utilise un navigateur web sur "<device>"
    Et que les traces FranceConnect+ contiennent "différents types de traces"
    Et que les traces FranceConnect contiennent "différents types de traces"
    Et que je navigue sur la page d'accueil du dashboard usager
    Et que la copie d'écran "udHome" correspond à la page actuelle sur "<device>"
    Quand je me connecte au dashboard usager
    Alors je suis redirigé vers la page historique du dashboard usager
    Et les 3 traces de FranceConnect+ sont affichées
    Et les 7 traces de FranceConnect de moins de 6 mois sont affichées
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
    Et que je navigue sur la page d'accueil du dashboard usager
    Et que je me connecte au dashboard usager
    Et que je suis redirigé vers la page historique du dashboard usager
    Quand je navigue directement vers la page gestion des accès du dashboard usager
    Alors la copie d'écran "udPreferences" correspond à la page actuelle sur "<device>"

    Exemples:
      | device           |
      | mobile           |
      | tablet portrait  |
      | tablet landscape |
      | desktop          |
