#language:fr
@ci
Fonctionnalité: Liaison des instances à un fournisseur de service

  Scénario: Liaison des instances - Bouton non affiché en absence d'instance éligible à la liaison
    Etant donné que je me connecte à l'espace partenaires avec un utilisateur "partenaire avec deux fournisseurs de service"
    Et que je navigue sur la page fournisseurs de service de l'espace partenaires
    Et que je suis redirigé vers la page fournisseurs de service
    Quand je clique sur le fournisseur de service "SP2 - Fournisseur de service de test avec 1 instance"
    Alors je suis redirigé vers la page détails du fournisseur de service
    Et le titre du fournisseur de service "SP2 - Fournisseur de service de test avec 1 instance" est affiché
    Et le bouton "relier les instances" n'est pas affiché

  Scénario: Liaison des instances - Instance sélectionnée si même numéro de demande Datapass
    Etant donné que je me connecte à l'espace partenaires avec un utilisateur "partenaire avec au moins un fournisseur de service"
    Et que je navigue sur la page liste des instances de l'espace partenaires
    Et que je crée une instance "pour le test de liaison des instances" avec le nom "instance à ne pas lier à SP5" et demande Datapass "12345"
    Et que je crée une instance "pour le test de liaison des instances" avec le nom "instance à lier à SP5" et demande Datapass "9900005"
    Et que je navigue sur la page fournisseurs de service de l'espace partenaires
    Et que je suis redirigé vers la page fournisseurs de service
    Et que je clique sur le fournisseur de service "SP5 - FS pour lier les instances"
    Et que je suis redirigé vers la page détails du fournisseur de service
    Et que le bouton "relier les instances" est affiché
    Quand je clique sur le bouton "relier les instances"
    Alors je suis redirigé vers la page de liaison des instances
    Et l'instance "instance à ne pas lier à SP5" n'est pas sélectionnée
    Et l'instance "instance à lier à SP5" est sélectionnée
    Et le bouton "confirmer la liaison des instances" est actif

  Scénario: Liaison des instances - Sélectionner/désélectionner toutes les instances
    Etant donné que je me connecte à l'espace partenaires avec un utilisateur "partenaire avec au moins un fournisseur de service"
    Et que je navigue sur la page fournisseurs de service de l'espace partenaires
    Et que je suis redirigé vers la page fournisseurs de service
    Et que je clique sur le fournisseur de service "SP5 - FS pour lier les instances"
    Et que je suis redirigé vers la page détails du fournisseur de service
    Et que je clique sur le bouton "relier les instances"
    Et que je suis redirigé vers la page de liaison des instances
    Quand je clique sur la case à cocher "sélectionner toutes les instances"
    Et toutes les instances sont sélectionnées
    Et le bouton "confirmer la liaison des instances" est actif
    Et je clique sur la case à cocher "sélectionner toutes les instances"
    Alors aucune instance n'est sélectionnée
    Et le bouton "confirmer la liaison des instances" est désactivé

  Scénario: Liaison des instances - Annuler la liaison des instances
    Etant donné que je me connecte à l'espace partenaires avec un utilisateur "partenaire avec au moins un fournisseur de service"
    Et que je navigue sur la page fournisseurs de service de l'espace partenaires
    Et que je suis redirigé vers la page fournisseurs de service
    Et que je clique sur le fournisseur de service "SP5 - FS pour lier les instances"
    Et que je suis redirigé vers la page détails du fournisseur de service
    Et que le titre du fournisseur de service "SP5 - FS pour lier les instances" est affiché
    Et que je clique sur le bouton "relier les instances"
    Et que je suis redirigé vers la page de liaison des instances
    Quand j'annule la liaison des instances
    Alors je suis redirigé vers la page détails du fournisseur de service
    Et le titre du fournisseur de service "SP5 - FS pour lier les instances" est affiché

  Scénario: Liaison des instances - Lier une instance à un fournisseur de service et propager les scopes FC
    Etant donné que je me connecte à l'espace partenaires avec un utilisateur "partenaire avec au moins un fournisseur de service"
    Et que je navigue sur la page fournisseurs de service de l'espace partenaires
    Et que je suis redirigé vers la page fournisseurs de service
    Et que je clique sur le fournisseur de service "SP5 - FS pour lier les instances"
    Et que je suis redirigé vers la page détails du fournisseur de service
    Et que je clique sur le bouton "relier les instances"
    Et que je suis redirigé vers la page de liaison des instances
    Et que je clique sur la case à cocher "sélectionner toutes les instances"
    Et que je clique sur la case à cocher "sélectionner toutes les instances"
    Et que aucune instance n'est sélectionnée
    Quand je clique sur la case à cocher de l'instance "instance à lier à SP5"
    Et je confirme la liaison des instances
    Alors je suis redirigé vers la page détails du fournisseur de service
    Et le titre du fournisseur de service "SP5 - FS pour lier les instances" est affiché
    Et l'alerte de succès de liaison des instances est affichée
    Et l'instance "instance à lier à SP5" est présente dans le tableau des accès au bac à sable
    Et l'instance "instance à ne pas lier à SP5" n'est pas présente dans le tableau des accès au bac à sable
    Et l'instance liée au fournisseur de service est à jour avec les informations Datapass
