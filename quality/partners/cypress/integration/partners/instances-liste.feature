#language:fr
@ci
Fonctionnalité: Liste mes Instances
  # En tant que partenaire,
  # je veux accéder aux instances de mon FS
  # afin de configurer mon fournisseur d'identité dans l'environnement sandbox

  Scénario: Liste mes Instances - Aucune instance
    Quand je me connecte à l'espace partenaires avec un utilisateur "partenaire sans instance"
    Alors je suis redirigé vers la page liste des instances
    Et la tuile de création d'instance est affichée
    Et aucune instance n'est affichée

  Scénario: Liste mes Instances - Une instance
    Quand je me connecte à l'espace partenaires avec un utilisateur "partenaire avec une instance"
    Alors je suis redirigé vers la page liste des instances
    Et la tuile de création d'instance n'est pas affichée
    Et 1 instance est affichée
    Et l'instance "Mon unique instance" est affichée
    Et la date de création de l'instance est affichée
    Et le "client_id" de l'instance est affiché
    Et le "client_secret" de l'instance est affiché
