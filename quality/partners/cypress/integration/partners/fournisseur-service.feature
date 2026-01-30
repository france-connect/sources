#language:fr
@ci @ignoreInteg01
Fonctionnalité: Mon Fournisseur de Service
  # En tant que partenaire,
  # je veux accéder a un de mes FS

  Scénario: Mon Fournisseur de Service - Afficher les détails d'un FS
    Etant donné que je me connecte à l'espace partenaires avec un utilisateur "partenaire avec au moins un fournisseur de service"
    Et que je navigue sur la page fournisseurs de service de l'espace partenaires
    Et que je suis redirigé vers la page fournisseurs de service
    Quand je clique sur le fournisseur de service "Service Provider 2"
    Alors je suis redirigé vers la page détails du fournisseur de service
    Et le titre du fournisseur de service "Service Provider 2" est affiché
