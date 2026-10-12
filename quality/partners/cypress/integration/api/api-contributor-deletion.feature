#language: fr
@api @apiContributorDeletion @ci
Fonctionnalité: API - suppression de contributeur

  @ignoreInteg01
  Scénario: API contributeur suppression - suppression succès
    Etant donné que je me connecte à l'espace partenaires avec un utilisateur "partenaire avec au moins un fournisseur de service"
    Et que je navigue sur la page liste des instances de l'espace partenaires
    Et que je suis sur la page liste des instances
    Et que je prépare une requête "contributor-deletion"
    Quand je lance la requête avec le csrf-token
    Alors le statut de la réponse est 200
    Et l'entête de la réponse a une propriété "content-type" contenant "application/json"
    Et le corps de la réponse a une propriété "type" égale à "CONTRIBUTOR"
    Et le corps de la réponse a une propriété "payload" avec 0 attribut
    Et le corps de la réponse a 2 propriétés

  Scénario: API contributeur suppression - erreur identifiant de compte invalide (400)
    Etant donné que je me connecte à l'espace partenaires avec un utilisateur "partenaire avec au moins un fournisseur de service"
    Et que je navigue sur la page liste des instances de l'espace partenaires
    Et que je suis sur la page liste des instances
    Et que je prépare une requête "contributor-deletion"
    Et que je mets "not-a-valid-uuid" dans la propriété "accountIds" du corps de la requête
    Quand je lance la requête avec le csrf-token
    Alors le statut de la réponse est 400

  Scénario: API contributeur suppression - erreur utilisateur sans permission sur le fournisseur de service (403)
    Etant donné que je me connecte à l'espace partenaires avec un utilisateur "partenaire avec deux fournisseurs de service"
    Et que je navigue sur la page liste des instances de l'espace partenaires
    Et que je suis sur la page liste des instances
    Et que je prépare une requête "contributor-deletion"
    Quand je lance la requête avec le csrf-token
    Alors le statut de la réponse est 403
    Et l'entête de la réponse a une propriété "content-type" contenant "application/json"
    Et le corps de la réponse a 3 propriétés
    Et le corps de la réponse a une propriété "code" égale à "P000000"
    Et le corps de la réponse a une propriété "id"
    Et le corps de la réponse a une propriété "message" égale à "exceptions.default_message"

  Scénario: API contributeur suppression - erreur csrf-token manquant
    Etant donné que je me connecte à l'espace partenaires avec un utilisateur "partenaire avec au moins un fournisseur de service"
    Et que je navigue sur la page liste des instances de l'espace partenaires
    Et que je suis sur la page liste des instances
    Et que je prépare une requête "contributor-deletion"
    Et je retire "x-csrf-token" de l'entête de la requête
    Quand je lance la requête
    Alors le statut de la réponse est 400
    Et l'entête de la réponse a une propriété "content-type" contenant "application/json"
    Et le corps de la réponse a 3 propriétés
    Et le corps de la réponse a une propriété "code" égale à "P470002"
    Et le corps de la réponse a une propriété "id"
    Et le corps de la réponse a une propriété "message" égale à "Csrf.exceptions.csrfMissingToken"

  Scénario: API contributeur suppression - erreur csrf-token non valide
    Etant donné que je me connecte à l'espace partenaires avec un utilisateur "partenaire avec au moins un fournisseur de service"
    Et que je navigue sur la page liste des instances de l'espace partenaires
    Et que je suis sur la page liste des instances
    Et que je renouvelle le csrf-token de la session
    Et que je prépare une requête "contributor-deletion"
    Quand je lance la requête
    Alors le statut de la réponse est 401
    Et l'entête de la réponse a une propriété "content-type" contenant "application/json"
    Et le corps de la réponse a 3 propriétés
    Et le corps de la réponse a une propriété "code" égale à "P470001"
    Et le corps de la réponse a une propriété "id"
    Et le corps de la réponse a une propriété "message" égale à "Csrf.exceptions.csrfBadToken"
