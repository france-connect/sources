#language: fr
@validationVisuelleProduction
Fonctionnalité: Validation Visuelle - Production

  # ------------------------------------------------------------------
  #
  # Looking for updating the "identity providers selection as in production" screen ?
  # Take a look into the README.md file
  #
  # ------------------------------------------------------------------

  @fcpHigh
  Plan du Scénario: Validation Visuelle - Affichage de la mire fcp-high comme en production sur <device>
    Etant donné que j'utilise un navigateur web sur "<device>"
    Et que j'utilise un fournisseur de service "public"
    Et que le fournisseur de service requiert l'accès aux informations du scope "identite_pivot sans alias"
    Et que je navigue sur la page fournisseur de service
    Quand je clique sur le bouton FranceConnect
    Alors je suis redirigé vers la page sélection du fournisseur d'identité
    Et la copie d'écran "selectionFIHighAsInProd" correspond à la page actuelle sur "<device>"

    Exemples:
      | device           |
      | mobile           |
      | tablet portrait  |
      | tablet landscape |
      | desktop          |

  @fcpLow
  Plan du Scénario: Validation Visuelle - Affichage de la mire fcp-low comme en production sur <device>
    Etant donné que j'utilise un navigateur web sur "<device>"
    Et que j'utilise un fournisseur de service "public"
    Et que le fournisseur de service requiert l'accès aux informations du scope "identite_pivot sans alias"
    Et que je navigue sur la page fournisseur de service
    Quand je clique sur le bouton FranceConnect
    Alors je suis redirigé vers la page sélection du fournisseur d'identité
    Et la copie d'écran "selectionFILowAsInProd" correspond à la page actuelle sur "<device>"

    Exemples:
      | device           |
      | mobile           |
      | tablet portrait  |
      | tablet landscape |
      | desktop          |
  
  @userDashboard
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
      | mobile           |
      | tablet portrait  |
      | tablet landscape |
      | desktop          |
