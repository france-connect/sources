#language:fr
@ci
Fonctionnalité: Liste mes Fournisseurs de Service
  # En tant que partenaire,
  # je veux accéder a mes FS
  # je navigue sur la page fournisseurs de service

  Scénario: Liste mes Fournisseurs de Service - Aucun fournisseur de service
    Etant donné que je me connecte à l'espace partenaires avec un utilisateur "partenaire sans fournisseur de service"
    Quand je navigue sur la page fournisseurs de service de l'espace partenaires
    Alors je suis redirigé vers la page fournisseurs de service
    Et aucun fournisseur de service n'est affiché

  Scénario: Liste mes Fournisseurs de Service - Deux fournisseurs de service
    Etant donné que je me connecte à l'espace partenaires avec un utilisateur "partenaire avec deux fournisseurs de service"
    Quand je navigue sur la page fournisseurs de service de l'espace partenaires
    Alors je suis redirigé vers la page fournisseurs de service
    Et 2 fournisseurs de service sont affichés
