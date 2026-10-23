#language: fr
@validationVisuelle @nexus @ignoreInteg01
Fonctionnalité: Validation Visuelle - Nexus

  Plan du Scénario: Validation Visuelle - Page Accueil sur <device>
    Etant donné que j'utilise un navigateur web sur "<device>"
    Quand je navigue sur la page d'accueil de Nexus
    Alors la page affiche "OK"
    Et que je réduis les animations de la page
    Et la copie d'écran "homepage" correspond à la page actuelle sur "<device>"

    Exemples:
      | device  |
      | desktop |

  Plan du Scénario: Validation Visuelle - Page Non Trouvée sur <device>
    Etant donné que j'utilise un navigateur web sur "<device>"
    Quand je navigue sur une page inexistante de Nexus
    Alors la page affiche "Page non trouvée"
    Et que je réduis les animations de la page
    Et la copie d'écran "not-found" correspond à la page actuelle sur "<device>"

    Exemples:
      | device  |
      | desktop |
