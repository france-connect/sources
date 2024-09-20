#language: fr
@validationVisuelle
Fonctionnalité: Validation Visuelle - Espace Partenaires

  Scénario: Validation Visuelle - Page Accueil
    Etant donné que j'utilise un navigateur web sur "<device>"
    Quand je navigue sur la page d'accueil de l'espace partenaires
    Alors je suis redirigé vers la page login de l'espace partenaires
    Et la copie d'écran "homepage" correspond à la page actuelle sur "<device>"

    Exemples:
      | device           |
      | mobile           |
      | tablet portrait  |
      | tablet landscape |
      | desktop          |
