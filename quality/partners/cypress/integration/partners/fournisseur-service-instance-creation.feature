#language:fr
@ci
Fonctionnalité: Mon Fournisseur de Service - Création d'un accès au bac à sable
  # En tant que partenaire,
  # je veux créer un accès au bac à sable pour mon fournisseur de service
  # afin de le créer directement lié à mon fournisseur de service

  Scénario: Instance Création - Cas passant
    Etant donné que je me connecte à l'espace partenaires avec un utilisateur "partenaire avec au moins un fournisseur de service"
    Et que je navigue sur la page fournisseurs de service de l'espace partenaires
    Et que je suis redirigé vers la page fournisseurs de service
    Et que je clique sur le fournisseur de service "SP6 - FS pour créer des instances"
    Et que je suis redirigé vers la page détails du fournisseur de service
    Et que je clique sur le bouton "créer une instance"
    Et que je suis redirigé vers la page création d'instance depuis un fournisseur de service
    Et que j'utilise l'instance de FS "depuis un fournisseur de service"
    Quand j'entre les valeurs par défaut pour mon instance
    Et j'entre un nom aléatoire dans le champ "name" du formulaire de création d'instance
    Et je valide le formulaire de création d'instance
    Alors je suis redirigé vers la page détails du fournisseur de service
    Et l'alerte de succès de création d'accès au bac à sable est affichée
    Et l'instance créée est présente dans le tableau des accès au bac à sable
    Et l'instance liée au fournisseur de service est à jour avec les informations Datapass

  Scénario: Instance Création - Erreur champs obligatoires
    Etant donné que je me connecte à l'espace partenaires avec un utilisateur "partenaire avec au moins un fournisseur de service"
    Et que je navigue sur la page fournisseurs de service de l'espace partenaires
    Et que je suis redirigé vers la page fournisseurs de service
    Et que je clique sur le fournisseur de service "SP6 - FS pour créer des instances"
    Et que je suis redirigé vers la page détails du fournisseur de service
    Et que je clique sur le bouton "créer une instance"
    Et que je suis redirigé vers la page création d'instance depuis un fournisseur de service
    Quand je valide le formulaire de création d'instance
    Alors je suis sur la page création d'instance depuis un fournisseur de service
    Et les champs suivants sont en erreur dans le formulaire de création d'instance
      | name                         | errorMessage                                             |
      | name                         | Veuillez saisir le nom de votre instance                 |
      | redirect_uris[0]             | Veuillez saisir votre url de connexion (url de callback) |
      | post_logout_redirect_uris[0] | Veuillez saisir votre url de déconnexion (url de logout) |
      | id_token_signed_response_alg | Ce champ est obligatoire                                 |
    Et les champs suivants ne sont pas en erreur dans le formulaire de création d'instance
      | name                          |
      | site[0]                       |
      | IPServerAddressesAndRanges[0] |
      | entityId                      |
