#language: fr
@userDashboard @historiqueConnexion @ignoreInteg01
Fonctionnalité: Historique Connexion FC Legacy et FC+ (docker)
  # En tant qu'usager de FranceConnect,
  # je veux me connecter au user-dashboard
  # afin de consulter mon historique de connexion FC Legacy et FC+

  Scénario: Historique Connexion - FC Legacy et FC+ - connexions de moins de 6 mois sont affichées
    Etant donné que j'utilise un compte usager "pour les tests de traces"
    Et que les traces "FranceConnect(CL) et FranceConnect+" contiennent "des connexions récentes et anciennes de plus de 6 mois"
    Et que je navigue sur la page d'accueil du dashboard usager
    Quand je me connecte au dashboard usager
    Alors je suis redirigé vers la page historique du dashboard usager
    Et 3 évènements "FranceConnect+" sont affichés
    Et 7 évènements "FranceConnect" sont affichés
    Et les évènements "FranceConnect+" ont moins de 6 mois
    Et les évènements "FranceConnect" ont moins de 6 mois
    Et les évènements sont affichés par ordre décroissant
    Et la page 1 est sélectionnée dans la pagination de l'historique
    Et les navigations désactivées dans la pagination de l'historique sont "première page, page précédente, page suivante, dernière page"

  Plan du Scénario: Historique Connexion - <platform> - pagination avec une page <device>
    Etant donné que j'utilise un navigateur web sur "<device>"
    Et que j'utilise un compte usager "pour les tests de traces"
    Et que les traces "<platform>" contiennent "<tracksType>"
    Et que je navigue sur la page d'accueil du dashboard usager
    Quand je me connecte au dashboard usager
    Alors je suis redirigé vers la page historique du dashboard usager
    Et la page 1 est sélectionnée dans la pagination de l'historique
    Et <pageEventCount> évènements "<platform>" sont affichés
    Et les évènements sont affichés par ordre décroissant
    Et les navigations désactivées dans la pagination de l'historique sont "première page, page précédente, page suivante, dernière page"

    Exemples:
      | platform                            | tracksType    | pageEventCount | device           |
      | FranceConnect+                      | 2 connexions  | 2              | tablet portrait  |
      | FranceConnect(CL)                   | 6 connexions  | 6              | tablet landscape |
      | FranceConnect(CL) et FranceConnect+ | 10 connexions | 10             | desktop          |
      | FranceConnect+                      | 2 connexions  | 2              | mobile           |

  Plan du Scénario: Historique Connexion - <platform> - pagination en mode desktop avec plusieurs pages sur <device>
    Etant donné que j'utilise un navigateur web sur "<device>"
    Et que j'utilise un compte usager "pour les tests de traces"
    Et que les traces "<platform>" contiennent "<tracksType>"
    Et que je navigue sur la page d'accueil du dashboard usager
    Quand je me connecte au dashboard usager
    Alors je suis redirigé vers la page historique du dashboard usager
    Et la page 1 est sélectionnée dans la pagination de l'historique
    Et 10 évènements "<platform>" sont affichés
    Et les évènements sont affichés par ordre décroissant
    Et les navigations autorisées dans la pagination de l'historique sont "page suivante, dernière page"
    Et je navigue vers la page suivante de l'historique
    Et la page 2 est sélectionnée dans la pagination de l'historique
    Et 10 évènements "<platform>" sont affichés
    Et les évènements sont affichés par ordre décroissant
    Et les navigations autorisées dans la pagination de l'historique sont "première page, page précédente, page suivante, dernière page"
    Et je navigue vers la dernière page de l'historique
    Et la page <lastPage> est sélectionnée dans la pagination de l'historique
    Et <lastPageEventCount> évènements "<platform>" sont affichés
    Et les évènements sont affichés par ordre décroissant
    Et les navigations autorisées dans la pagination de l'historique sont "première page, page précédente"
    Et je navigue vers la première page de l'historique
    Et la page 1 est sélectionnée dans la pagination de l'historique
    Et 10 évènements "<platform>" sont affichés
    Et les navigations autorisées dans la pagination de l'historique sont "page suivante, dernière page"
    Et je navigue vers la page 2 de l'historique
    Et la page 2 est sélectionnée dans la pagination de l'historique
    Et 10 évènements "<platform>" sont affichés
    Et les navigations autorisées dans la pagination de l'historique sont "première page, page précédente, page suivante, dernière page"
    Et je navigue vers la page précédente de l'historique
    Et la page 1 est sélectionnée dans la pagination de l'historique
    Et 10 évènements "<platform>" sont affichés
    Et les navigations autorisées dans la pagination de l'historique sont "page suivante, dernière page"

    Exemples:
      | platform                            | tracksType    | lastPage | lastPageEventCount | device           |
      | FranceConnect+                      | 26 connexions | 3        | 6                  | tablet portrait  |
      | FranceConnect(CL)                   | 30 connexions | 3        | 10                 | tablet landscape |
      | FranceConnect(CL) et FranceConnect+ | 32 connexions | 4        | 2                  | desktop          |

  Scénario: Historique Connexion - pagination en mode mobile avec plusieurs pages sur <device>
    Etant donné que j'utilise un navigateur web sur "mobile"
    Et que j'utilise un compte usager "pour les tests de traces"
    Et que les traces "FranceConnect(CL) et FranceConnect+" contiennent "124 connexions"
    Et que je navigue sur la page d'accueil du dashboard usager
    Quand je me connecte au dashboard usager
    Alors je suis redirigé vers la page historique du dashboard usager
    Et la page 1 est sélectionnée dans la pagination de l'historique
    Et le bouton page 2 de l'historique est affiché
    Et le bouton page 13 de l'historique est affiché
    Et les navigations autorisées dans la pagination de l'historique sont "page suivante, dernière page"
    Et je navigue vers la page 2 de l'historique
    Et le haut de la page est affiché
    Et le bouton page 1 de l'historique est affiché
    Et la page 2 est sélectionnée dans la pagination de l'historique
    Et le bouton page 13 de l'historique est affiché
    Et les navigations autorisées dans la pagination de l'historique sont "première page, page précédente, page suivante, dernière page"
    Et je navigue vers la page suivante de l'historique
    Et le bouton page 2 de l'historique est affiché
    Et la page 3 est sélectionnée dans la pagination de l'historique
    Et le bouton page 13 de l'historique est affiché
    Et les navigations autorisées dans la pagination de l'historique sont "première page, page précédente, page suivante, dernière page"
    Et je navigue vers la page suivante de l'historique
    Et le bouton page 3 de l'historique est affiché
    Et la page 4 est sélectionnée dans la pagination de l'historique
    Et le bouton page 13 de l'historique est affiché
    Et les navigations autorisées dans la pagination de l'historique sont "première page, page précédente, page suivante, dernière page"
    Et je navigue vers la page 13 de l'historique
    Et le bouton page 11 de l'historique est affiché
    Et le bouton page 12 de l'historique est affiché
    Et la page 13 est sélectionnée dans la pagination de l'historique
    Et les navigations autorisées dans la pagination de l'historique sont "première page, page précédente"
    Et je navigue vers la première page de l'historique
    Et la page 1 est sélectionnée dans la pagination de l'historique
    Et je navigue vers la dernière page de l'historique
    Et la page 13 est sélectionnée dans la pagination de l'historique

  Plan du Scénario: Historique Connexion - pagination avec plus de 100 connexions - <device>
    Etant donné que j'utilise un navigateur web sur "<device>"
    Et que j'utilise un compte usager "pour les tests de traces"
    Et que les traces "FranceConnect(CL) et FranceConnect+" contiennent "124 connexions"
    Et que je navigue sur la page d'accueil du dashboard usager
    Quand je me connecte au dashboard usager
    Alors je suis redirigé vers la page historique du dashboard usager
    Et la page 1 est sélectionnée dans la pagination de l'historique
    Et je navigue vers la dernière page de l'historique
    Et la page 13 est sélectionnée dans la pagination de l'historique
    Et 4 évènements "FranceConnect et FranceConnect+" sont affichés
    Et les évènements sont affichés par ordre décroissant

    Exemples:
      | device  |
      | desktop |
      | mobile  |


