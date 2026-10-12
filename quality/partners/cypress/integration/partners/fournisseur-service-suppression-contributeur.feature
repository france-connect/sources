#language:fr
@ci @contributeur
Fonctionnalité: Mon Fournisseur de Service - Suppression d'un contributeur
  # En tant que partenaire administrateur d'un fournisseur de service,
  # je veux supprimer l'accès d'un contributeur via la modale de confirmation
  # afin de lui retirer l'accès à mon fournisseur de service

  Scénario: Suppression contributeur - Cas passant
    # Prérequis : on ajoute un contributeur dédié à la suppression pour rendre
    # le scénario autonome et rejouable (aucune dépendance aux données injectées)
    Etant donné que je me connecte à l'espace partenaires avec un utilisateur "partenaire avec au moins un fournisseur de service"
    Et que je navigue sur la page fournisseurs de service de l'espace partenaires
    Et que je suis redirigé vers la page fournisseurs de service
    Et que je clique sur le fournisseur de service "SP4 - Fournisseur de service par défaut"
    Et que je suis redirigé vers la page détails du fournisseur de service
    Et que je clique sur le bouton "ajouter un contributeur"
    Et que je suis redirigé vers la page ajout d'un contributeur
    Et que j'entre "contributeur-a-supprimer@yopmail.com" dans le champ "email" du formulaire d'ajout d'un contributeur
    Et que je clique sur le bouton "sauvegarder" du formulaire d'ajout d'un contributeur
    Et que je suis redirigé vers la page détails du fournisseur de service
    Et que le contributeur "contributeur-a-supprimer@yopmail.com" est présent dans le tableau des contributeurs
    # Suppression via la modale de confirmation
    Quand je clique sur le bouton de suppression du contributeur "contributeur-a-supprimer@yopmail.com"
    Et je confirme la suppression du contributeur dans la modale
    Alors l'alerte de succès de suppression de contributeur est affichée
    Et le contributeur "contributeur-a-supprimer@yopmail.com" n'est pas présent dans le tableau des contributeurs

  Scénario: Suppression contributeur - Un contributeur ne peut pas supprimer d'accès
    Etant donné que je me connecte à l'espace partenaires avec un utilisateur "contributeur d'un fournisseur de service"
    Et que je navigue sur la page fournisseurs de service de l'espace partenaires
    Et que je suis redirigé vers la page fournisseurs de service
    Quand je clique sur le fournisseur de service "SP2 - Fournisseur de service de test avec 1 instance"
    Et que je suis redirigé vers la page détails du fournisseur de service
    Alors le contributeur "nlaurent@yopmail.com" est présent dans le tableau des contributeurs
    Et le bouton "ajouter un contributeur" n'est pas affiché
    Et aucun bouton de suppression n'est pas affiché dans le tableau des contributeurs
