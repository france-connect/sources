#language:fr
@ci
Fonctionnalité: Mon Fournisseur de Service
  # En tant que partenaire,
  # je veux accéder a un de mes FS
  # afin de consulter les données/scopes autorisées et les accès au bac à sable correspondants

  Scénario: Mon Fournisseur de Service - Affichage des données autorisées
    Etant donné que je me connecte à l'espace partenaires avec un utilisateur "partenaire avec deux fournisseurs de service"
    Et que je navigue sur la page fournisseurs de service de l'espace partenaires
    Et que je suis redirigé vers la page fournisseurs de service
    Quand je clique sur le fournisseur de service "SP2 - Fournisseur de service de test avec 1 instance"
    Alors je suis redirigé vers la page détails du fournisseur de service
    Et je suis redirigé vers l'onglet données autorisées
    Et le titre du fournisseur de service "SP2 - Fournisseur de service de test avec 1 instance" est affiché
    Et le nom de l'organisation "DIRECTION INTERMINISTERIELLE DU NUMERIQUE" est affiché
    Et le numéro de la demande Datapass "9900002" est affiché
    Et les scopes Datapass suivants sont affichés:
      | Identifiant technique |
      | Prénoms               |
      | Nom de naissance      |
      | Adresse électronique  |
      | Sexe                  |
      | Date de naissance     |
      | Ville de naissance    |
      | Pays de naissance     |
      | Nom d'usage           |

  Scénario: Mon Fournisseur de Service - Affichage des scopes autorisés
    Etant donné que je me connecte à l'espace partenaires avec un utilisateur "partenaire avec deux fournisseurs de service"
    Et que je navigue sur la page fournisseurs de service de l'espace partenaires
    Et que je suis redirigé vers la page fournisseurs de service
    Et que je clique sur le fournisseur de service "SP2 - Fournisseur de service de test avec 1 instance"
    Et que je suis redirigé vers la page détails du fournisseur de service
    Quand je clique sur l'onglet scopes autorisés
    Alors je suis redirigé vers l'onglet scopes autorisés
    Et le titre du fournisseur de service "SP2 - Fournisseur de service de test avec 1 instance" est affiché
    Et le nom de l'organisation "DIRECTION INTERMINISTERIELLE DU NUMERIQUE" est affiché
    Et le numéro de la demande Datapass "9900002" est affiché
    Et les scopes FranceConnect suivants sont affichés:
      | profile            |
      | birth              |
      | identite_pivot     |
      | openid             |
      | gender             |
      | birthdate          |
      | birthcountry       |
      | birthplace         |
      | given_name         |
      | family_name        |
      | email              |
      | preferred_username |

  Scénario: Mon Fournisseur de Service - Absence d'accès au bac à sable
    Etant donné que je me connecte à l'espace partenaires avec un utilisateur "partenaire avec deux fournisseurs de service"
    Et que je navigue sur la page fournisseurs de service de l'espace partenaires
    Et que je suis redirigé vers la page fournisseurs de service
    Quand je clique sur le fournisseur de service "SP3 - Fournisseur de service de test sans instance"
    Alors je suis redirigé vers la page détails du fournisseur de service
    Et le bouton "créer une instance" est affiché
    Et l'alerte d'absence de bac à sable est affichée
    Et le tableau des accès au bac à sable n'est pas affiché

  Scénario: Mon Fournisseur de Service - Présence d'accès au bac à sable
    Etant donné que je me connecte à l'espace partenaires avec un utilisateur "partenaire avec deux fournisseurs de service"
    Et que je navigue sur la page fournisseurs de service de l'espace partenaires
    Et que je suis redirigé vers la page fournisseurs de service
    Quand je clique sur le fournisseur de service "SP2 - Fournisseur de service de test avec 1 instance"
    Alors je suis redirigé vers la page détails du fournisseur de service
    Et le bouton "créer une instance" est affiché
    Et l'alerte d'absence de bac à sable n'est pas affichée
    Et le tableau des accès au bac à sable est affiché