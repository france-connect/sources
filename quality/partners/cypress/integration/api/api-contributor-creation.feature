#language: fr
@api @apiContributorCreation @ci
Fonctionnalité: API - ajout de contributeur

  @ignoreInteg01
  Scénario: API contributeur ajout - succès et accès à la liste des fournisseurs de service
    Etant donné que je me connecte à l'espace partenaires avec un utilisateur "partenaire avec au moins un fournisseur de service"
    Et que je navigue sur la page liste des instances de l'espace partenaires
    Et que je suis sur la page liste des instances
    Et que je prépare une requête "contributor-creation-success"
    Quand je lance la requête avec le csrf-token
    Alors le statut de la réponse est 201
    Et je me connecte à l'espace partenaires avec un utilisateur "contributeur ajouté par e-mail"
    Et je navigue sur la page fournisseurs de service de l'espace partenaires
    Et je suis redirigé vers la page fournisseurs de service
    Et je clique sur le fournisseur de service "SP7 - FS dédié à l’ajout de contributeur"
    Et je suis redirigé vers la page détails du fournisseur de service

  Scénario: API contributeur ajout - erreur csrf-token manquant
    Etant donné que je me connecte à l'espace partenaires avec un utilisateur "partenaire avec deux fournisseurs de service"
    Et que je navigue sur la page liste des instances de l'espace partenaires
    Et que je suis sur la page liste des instances
    Et que je prépare une requête "contributor-creation"
    Et je retire "x-csrf-token" de l'entête de la requête
    Quand je lance la requête
    Alors le statut de la réponse est 400
    Et l'entête de la réponse a une propriété "content-type" contenant "application/json"
    Et le corps de la réponse a une propriété "code" égale à "P470002"
    Et le corps de la réponse a une propriété "id"
    Et le corps de la réponse a une propriété "message" égale à "Csrf.exceptions.csrfMissingToken"
    Et le corps de la réponse a 3 propriétés

  Scénario: API contributeur ajout - erreur csrf-token non valide
    Etant donné que je me connecte à l'espace partenaires avec un utilisateur "partenaire avec deux fournisseurs de service"
    Et que je navigue sur la page liste des instances de l'espace partenaires
    Et que je suis sur la page liste des instances
    Et que je prépare une requête "contributor-creation"
    Quand je lance la requête
    Alors le statut de la réponse est 401
    Et l'entête de la réponse a une propriété "content-type" contenant "application/json"
    Et le corps de la réponse a une propriété "code" égale à "P190001"
    Et le corps de la réponse a une propriété "id"
    Et le corps de la réponse a une propriété "message" égale à "Session.exceptions.sessionNotFound"
    Et le corps de la réponse a 3 propriétés

  Scénario: API contributeur ajout - erreur email déjà contributeur du fournisseur de service (422)
    Etant donné que je me connecte à l'espace partenaires avec un utilisateur "partenaire avec deux fournisseurs de service"
    Et que je navigue sur la page liste des instances de l'espace partenaires
    Et que je suis sur la page liste des instances
    Et que je prépare une requête "contributor-creation"
    Et je mets "tbernard@yopmail.com" dans la propriété "email" du corps de la requête
    Quand je lance la requête avec le csrf-token
    Alors le statut de la réponse est 422
    Et le corps de la réponse a une propriété "code" égale à "P480003"
    Et le corps de la réponse a une propriété "message" égale à "Dto2form.exceptions.dto2formValidationError"
    Et le corps de la réponse a une propriété "payload" avec 1 attribut
    Et le corps de la réponse a une propriété "payload.email[0].content" égale à "Cette adresse e-mail appartient déjà à une personne ayant accès à ce fournisseur de service"

  Scénario: API contributeur ajout - erreur email déjà administrateur du fournisseur de service (422)
    Etant donné que je me connecte à l'espace partenaires avec un utilisateur "partenaire avec deux fournisseurs de service"
    Et que je navigue sur la page liste des instances de l'espace partenaires
    Et que je suis sur la page liste des instances
    Et que je prépare une requête "contributor-creation"
    Et je mets "aloupe@yopmail.com" dans la propriété "email" du corps de la requête
    Quand je lance la requête avec le csrf-token
    Alors le statut de la réponse est 422
    Et le corps de la réponse a une propriété "code" égale à "P480003"
    Et le corps de la réponse a une propriété "message" égale à "Dto2form.exceptions.dto2formValidationError"
    Et le corps de la réponse a une propriété "payload" avec 1 attribut
    Et le corps de la réponse a une propriété "payload.email[0].content" égale à "Cette adresse e-mail appartient déjà à une personne ayant accès à ce fournisseur de service"

  Scénario: API contributeur ajout - erreur email manquant (422)
    Etant donné que je me connecte à l'espace partenaires avec un utilisateur "partenaire avec deux fournisseurs de service"
    Et que je navigue sur la page liste des instances de l'espace partenaires
    Et que je suis sur la page liste des instances
    Et que je prépare une requête "contributor-creation"
    Et je retire "email" du corps de la requête
    Quand je lance la requête avec le csrf-token
    Alors le statut de la réponse est 422
    Et l'entête de la réponse a une propriété "content-type" contenant "application/json"
    Et le corps de la réponse a une propriété "code" égale à "P480003"
    Et le corps de la réponse a une propriété "id"
    Et le corps de la réponse a une propriété "message" égale à "Dto2form.exceptions.dto2formValidationError"
    Et le corps de la réponse a une propriété "payload" avec 1 attribut
    Et le corps de la réponse a une propriété "payload.email[0]" avec 3 attributs
    Et le corps de la réponse a une propriété "payload.email[0].content" égale à "Champ obligatoire"
    Et le corps de la réponse a une propriété "payload.email[0].level" égale à "error"
    Et le corps de la réponse a 4 propriétés

  Scénario: API contributeur ajout - erreur email non valide (422)
    Etant donné que je me connecte à l'espace partenaires avec un utilisateur "partenaire avec deux fournisseurs de service"
    Et que je navigue sur la page liste des instances de l'espace partenaires
    Et que je suis sur la page liste des instances
    Et que je prépare une requête "contributor-creation"
    Et je mets "pas-un-email" dans la propriété "email" du corps de la requête
    Quand je lance la requête avec le csrf-token
    Alors le statut de la réponse est 422
    Et le corps de la réponse a une propriété "code" égale à "P480003"
    Et le corps de la réponse a une propriété "message" égale à "Dto2form.exceptions.dto2formValidationError"
    Et le corps de la réponse a une propriété "payload" avec 1 attribut
    Et le corps de la réponse a une propriété "payload.email[0].content" égale à "Veuillez saisir une adresse e-mail valide (ex: nom@exemple.com)"

  Scénario: API contributeur ajout - erreur utilisateur sans permission sur le fournisseur de service (403)
    Etant donné que je me connecte à l'espace partenaires
    Et que je navigue sur la page liste des instances de l'espace partenaires
    Et que je suis sur la page liste des instances
    Et que je prépare une requête "contributor-creation"
    Quand je lance la requête avec le csrf-token
    Alors le statut de la réponse est 403
    Et l'entête de la réponse a une propriété "content-type" contenant "application/json"
    Et le corps de la réponse a une propriété "code" égale à "P000000"
    Et le corps de la réponse a une propriété "message" égale à "exceptions.default_message"
    Et le corps de la réponse a une propriété "id"
    Et le corps de la réponse a 3 propriétés

  Scénario: API contributeur ajout - erreur utilisateur non authentifié (401)
    Etant donné que je prépare une requête "contributor-creation"
    Quand je lance la requête
    Alors le statut de la réponse est 401

  Scénario: API contributeur - métadonnées du formulaire succès
    Etant donné que je me connecte à l'espace partenaires
    Et que je navigue sur la page liste des instances de l'espace partenaires
    Et que je suis sur la page liste des instances
    Et que je prépare une requête "contributor-form-metadata"
    Quand je lance la requête
    Alors le statut de la réponse est 200
    Et l'entête de la réponse a une propriété "content-type" contenant "application/json"
    Et le corps de la réponse a une propriété "0.name" égale à "email"
    Et le corps de la réponse a une propriété "0.label" égale à "E-mail de la personne à ajouter"
    Et le corps de la réponse a une propriété "0.hint"
    Et le corps de la réponse a une propriété "0.validators"
