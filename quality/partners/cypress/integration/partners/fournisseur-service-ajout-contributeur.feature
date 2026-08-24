#language:fr
@ci @contributeur
Fonctionnalité: Mon Fournisseur de Service - Ajout d'un contributeur
  # En tant que partenaire administrateur d'un fournisseur de service,
  # je veux ajouter un contributeur via son adresse e-mail
  # afin de lui donner accès à mon fournisseur de service

  # Si ce test est rééxécuté, ce scénario sera en erreur
  # tant que la suppression du contibuteur n'est pas effectuée
  @ignoreInteg01
  Scénario: Ajout contributeur - Cas passant
    Etant donné que je me connecte à l'espace partenaires avec un utilisateur "partenaire avec au moins un fournisseur de service"
    Et que je navigue sur la page fournisseurs de service de l'espace partenaires
    Et que je suis redirigé vers la page fournisseurs de service
    Et que je clique sur le fournisseur de service "SP4 - Fournisseur de service par défaut"
    Et que je suis redirigé vers la page détails du fournisseur de service
    Et que je clique sur le bouton "ajouter un contributeur"
    Et que je suis redirigé vers la page ajout d'un contributeur
    Et que je supprime les mails envoyés à "newcontributor@yopmail.com"
    Quand j'entre "newcontributor@yopmail.com" dans le champ "email" du formulaire d'ajout d'un contributeur
    Et je clique sur le bouton "sauvegarder" du formulaire d'ajout d'un contributeur
    Alors je suis redirigé vers la page détails du fournisseur de service
    Et le contributeur "newcontributor@yopmail.com" est présent dans le tableau des contributeurs
    Et le mail "ajout de contributeur" est envoyé à "newcontributor@yopmail.com"
    Et l'administrateur est "Hugo DUBOIS" dans le mail "ajout de contributeur"
    Et le fournisseur de service est "SP4 - Fournisseur de service par défaut" dans le mail "ajout de contributeur"

  Scénario: Ajout contributeur - Erreur email manquant
    Etant donné que je me connecte à l'espace partenaires avec un utilisateur "partenaire avec au moins un fournisseur de service"
    Et que je navigue sur la page fournisseurs de service de l'espace partenaires
    Et que je suis redirigé vers la page fournisseurs de service
    Et que je clique sur le fournisseur de service "SP4 - Fournisseur de service par défaut"
    Et que je suis redirigé vers la page détails du fournisseur de service
    Et que je clique sur le bouton "ajouter un contributeur"
    Et que je suis redirigé vers la page ajout d'un contributeur
    Quand je clique sur le bouton "sauvegarder" du formulaire d'ajout d'un contributeur
    Alors je suis sur la page du formulaire d'ajout d'un contributeur
    Et les champs suivants sont en erreur dans le formulaire d'ajout d'un contributeur
      | name  | errorMessage                                                    |
      | email | Champ obligatoire |

  Scénario: Ajout contributeur - Erreur email non valide
    Etant donné que je me connecte à l'espace partenaires avec un utilisateur "partenaire avec au moins un fournisseur de service"
    Et que je navigue sur la page fournisseurs de service de l'espace partenaires
    Et que je suis redirigé vers la page fournisseurs de service
    Et que je clique sur le fournisseur de service "SP4 - Fournisseur de service par défaut"
    Et que je suis redirigé vers la page détails du fournisseur de service
    Et que je clique sur le bouton "ajouter un contributeur"
    Et que je suis redirigé vers la page ajout d'un contributeur
    Quand j'entre "pas-un-email" dans le champ "email" du formulaire d'ajout d'un contributeur
    Et je clique sur le bouton "sauvegarder" du formulaire d'ajout d'un contributeur
    Alors je suis sur la page du formulaire d'ajout d'un contributeur
    Et les champs suivants sont en erreur dans le formulaire d'ajout d'un contributeur
      | name  | errorMessage                                                    |
      | email | Veuillez saisir une adresse e-mail valide (ex: nom@exemple.com) |

  Scénario: Ajout contributeur - Erreur email déjà contributeur
    Etant donné que je me connecte à l'espace partenaires avec un utilisateur "partenaire avec au moins un fournisseur de service"
    Et que je navigue sur la page fournisseurs de service de l'espace partenaires
    Et que je suis redirigé vers la page fournisseurs de service
    Et que je clique sur le fournisseur de service "SP4 - Fournisseur de service par défaut"
    Et que je suis redirigé vers la page détails du fournisseur de service
    Et que je clique sur le bouton "ajouter un contributeur"
    Et que je suis redirigé vers la page ajout d'un contributeur
    Quand j'entre "hdubois@yopmail.com" dans le champ "email" du formulaire d'ajout d'un contributeur
    Et je clique sur le bouton "sauvegarder" du formulaire d'ajout d'un contributeur
    Alors je suis sur la page du formulaire d'ajout d'un contributeur
    Et les champs suivants sont en erreur dans le formulaire d'ajout d'un contributeur
      | name  | errorMessage                                                    |
      | email | Cette adresse e-mail appartient déjà à une personne ayant accès à ce fournisseur de service |
