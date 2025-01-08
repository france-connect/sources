#language:fr
@ci
Fonctionnalité: Liste mes Instances
  # En tant que partenaire,
  # je veux accéder aux instances de mon FS
  # afin de configurer mon fournisseur d'identité dans l'environnement sandbox

  Scénario: Liste mes Instances - Aucune instance
    Etant donné que je suis un utilisateur "partenaire sans instance"
    Quand je me connecte à l'espace partenaires
    Alors je suis redirigé vers la page liste des instances
    Et la tuile de création d'instance est affichée
    Et aucune instance n'est affichée

  Scénario: Liste mes Instances - Une instance
    Etant donné que je suis un utilisateur "partenaire avec une instance"
    Quand je me connecte à l'espace partenaires
    Alors je suis redirigé vers la page liste des instances
    Et la tuile de création d'instance n'est pas affichée
    Et 1 instance est affichée
