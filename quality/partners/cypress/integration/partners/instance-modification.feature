#language:fr
@ci
Fonctionnalité: Instance - Modification
  # En tant que partenaire,
  # je veux modifier une instance
  # afin de configurer mon fournisseur d'identité dans l'environnement sandbox

  Scénario: Instance Modification - Formulaire affiché
    Etant donné que je me connecte à l'espace partenaires
    Et que je suis sur la page liste des instances
    Quand je clique sur la première instance
    Alors je suis redirigé vers la page modification d'instance

  Scénario: Instance Modification - Modification du nom de l'instance
    Etant donné que je me connecte à l'espace partenaires
    Et que je suis sur la page liste des instances
    Et que je clique sur la première instance
    Et que je suis sur la page modification d'instance
    Quand j'entre un nom aléatoire dans le champ "instance_name" du formulaire de modification d'instance
    Et je valide le formulaire de modification d'instance
    Alors je suis redirigé vers la page liste des instances
    Et la confirmation de modification de l'instance est affichée
    Et l'instance modifiée est affichée
    Et le nom de l'instance est affiché
    Et la date de création de l'instance est affichée
    Et je masque la confirmation de modification de l'instance
    Et la confirmation de modification de l'instance n'est pas affichée