#language: fr
@userDashboard @historiqueConnexion @ignoreInteg01 @ignoreHigh @ignoreLow
Fonctionnalité: Historique Connexion FC Legacy et FC+ (docker)
  # En tant qu'usager de FranceConnect,
  # je veux me connecter au user-dashboard
  # afin de consulter mon historique de connexion FC Legacy et FC+

  Scénario: Historique Connexion - FC Legacy et FC+ - connexions de moins de 6 mois sont affichées
    Etant donné que j'utilise un compte usager "pour les tests de traces"
    Et que les traces "FranceConnect et FranceConnect+" contiennent "des connexions récentes et anciennes de plus de 6 mois"
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

  Plan du Scénario: Historique Connexion - <platform> - pagination avec une page
    Etant donné que j'utilise un compte usager "pour les tests de traces"
    Et que les traces "<platform>" contiennent "<tracksType>"
    Et que je navigue sur la page d'accueil du dashboard usager
    Quand je me connecte au dashboard usager
    Alors je suis redirigé vers la page historique du dashboard usager
    Et la page 1 est sélectionnée dans la pagination de l'historique
    Et <pageEventCount> évènements "<platform>" sont affichés
    Et les évènements sont affichés par ordre décroissant
    Et les navigations désactivées dans la pagination de l'historique sont "première page, page précédente, page suivante, dernière page"

    Exemples:
      | platform                        | tracksType    | pageEventCount |
      | FranceConnect+                  | 2 connexions  | 2              |
      | FranceConnect                   | 6 connexions  | 6              |
      | FranceConnect et FranceConnect+ | 10 connexions | 10             |

  Plan du Scénario: Historique Connexion - <platform> - pagination avec plusieurs pages
    Etant donné que j'utilise un compte usager "pour les tests de traces"
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
      | platform                        | tracksType    | lastPage | lastPageEventCount |
      | FranceConnect+                  | 26 connexions | 3        | 6                  |
      | FranceConnect                   | 30 connexions | 3        | 10                 |
      | FranceConnect et FranceConnect+ | 32 connexions | 4        | 2                  |

  Scénario: Historique Connexion - pagination avec plus de 100 connexions
    Etant donné que j'utilise un compte usager "pour les tests de traces"
    Et que les traces "FranceConnect et FranceConnect+" contiennent "124 connexions"
    Et que je navigue sur la page d'accueil du dashboard usager
    Quand je me connecte au dashboard usager
    Alors je suis redirigé vers la page historique du dashboard usager
    Et la page 1 est sélectionnée dans la pagination de l'historique
    Et je navigue vers la dernière page de l'historique
    Et la page 13 est sélectionnée dans la pagination de l'historique
    Et 4 évènements "FranceConnect et FranceConnect+" sont affichés
    Et les évènements sont affichés par ordre décroissant
