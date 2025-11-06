#language: fr
@validationVisuelle
Fonctionnalité: Validation Visuelle - Espace Partenaires - Fournisseurs de Service

  Plan du Scénario: Validation Visuelle - Liste des fournisseurs de service vide sur <device>
    Etant donné que j'utilise un navigateur web sur "<device>"
    Et que je me connecte à l'espace partenaires avec un utilisateur "partenaire sans fournisseur de service"
    Quand je navigue sur la page fournisseurs de service de l'espace partenaires
    Alors je suis redirigé vers la page fournisseurs de service
    Et la copie d'écran "fournisseurs-de-service" correspond à la page actuelle sur "<device>"

    Exemples:
      | device           |
      | desktop          |

  Plan du Scénario: Validation Visuelle - Liste des fournisseurs de service sur <device>
    Etant donné que j'utilise un navigateur web sur "<device>"
    Et que je me connecte à l'espace partenaires avec un utilisateur "partenaire avec au moins un fournisseur de service"
    Quand je navigue sur la page fournisseurs de service de l'espace partenaires
    Alors je suis redirigé vers la page fournisseurs de service
    Et la copie d'écran "fournisseurs-de-service" correspond à la page actuelle sur "<device>"

    Exemples:
      | device           |
      | desktop          |
