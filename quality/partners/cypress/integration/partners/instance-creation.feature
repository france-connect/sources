#language:fr
@ci
Fonctionnalité: Instance - Création
  # En tant que partenaire,
  # je veux créer une instance
  # afin de configurer mon fournisseur d'identité dans l'environnement sandbox

  Scénario: Instance Création - Formulaire affiché depuis tuile de création
    Etant donné que je me connecte à l'espace partenaires avec un utilisateur "partenaire sans instance"
    Et que je suis sur la page liste des instances
    Quand je clique sur la tuile de création d'instance
    Alors je suis redirigé vers la page création d'instance

  Scénario: Instance Création - Formulaire affiché depuis le lien ajouter
    Etant donné que je me connecte à l'espace partenaires avec un utilisateur "partenaire avec une instance"
    Et que je suis sur la page liste des instances
    Quand je clique sur le lien d'ajout d'une instance
    Alors je suis redirigé vers la page création d'instance

  Scénario: Instance Création - Création réussie
    Etant donné que je me connecte à l'espace partenaires
    Et que je suis sur la page liste des instances
    Et que je clique sur le lien d'ajout d'une instance
    Et que j'utilise l'instance de FS "avec entityId"
    Quand j'entre les valeurs par défaut pour mon instance
    Et j'entre un nom aléatoire dans le champ "name" du formulaire de création d'instance
    Et je valide le formulaire de création d'instance
    Alors je suis redirigé vers la page liste des instances
    Et la confirmation de création de l'instance est affichée
    Et l'instance créée est affichée
    Et le nom de l'instance est affiché
    Et la date de création de l'instance est affichée
    Et le "client_id" de l'instance est affiché
    Et le "client_secret" de l'instance est affiché
    Et je masque la confirmation de création de l'instance
    Et la confirmation de création de l'instance n'est pas affichée
