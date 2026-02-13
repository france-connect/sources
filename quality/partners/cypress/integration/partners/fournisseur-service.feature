#language:fr
@ci @ignoreInteg01
Fonctionnalité: Mon Fournisseur de Service
  # En tant que partenaire,
  # je veux accéder a un de mes FS

  Scénario: Mon Fournisseur de Service - Détails d'un FS - Affichage des données autorisées
    Etant donné que je me connecte à l'espace partenaires avec un utilisateur "partenaire avec au moins un fournisseur de service"
    Et que je navigue sur la page fournisseurs de service de l'espace partenaires
    Et que je suis redirigé vers la page fournisseurs de service
    Quand je clique sur le fournisseur de service "Service Provider 2"
    Alors je suis redirigé vers la page détails du fournisseur de service
    Et je suis redirigé vers l'onglet données autorisées
    Et le titre du fournisseur de service "Service Provider 2" est affiché
    Et le nom de l'organisation "Ministère de l'Intérieur" est affiché
    Et le numéro de la demande Datapass "13245" est affiché
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

  Scénario: Mon Fournisseur de Service - Détails d'un FS - Affichage des scopes autorisés
    Etant donné que je me connecte à l'espace partenaires avec un utilisateur "partenaire avec au moins un fournisseur de service"
    Et que je navigue sur la page fournisseurs de service de l'espace partenaires
    Et que je suis redirigé vers la page fournisseurs de service
    Et que je clique sur le fournisseur de service "Service Provider 2"
    Et que je suis redirigé vers la page détails du fournisseur de service
    Quand je clique sur l'onglet scopes autorisés
    Alors je suis redirigé vers l'onglet scopes autorisés
    Et le titre du fournisseur de service "Service Provider 2" est affiché
    Et le nom de l'organisation "Ministère de l'Intérieur" est affiché
    Et le numéro de la demande Datapass "13245" est affiché
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
