#language: fr
@api @apiServiceProviderInstanceCreation @ci
Fonctionnalité: API - création d'instance depuis un fournisseur de service

  Scénario: API service-provider instance création - création succès
    Etant donné que je me connecte à l'espace partenaires
    Et que je navigue sur la page liste des instances de l'espace partenaires
    Et que je suis sur la page liste des instances
    Et que je prépare une requête "service-provider-instance-creation"
    Quand je lance la requête avec le csrf-token
    Alors le statut de la réponse est 201
    Et l'entête de la réponse a une propriété "content-type" contenant "application/json"
    Et le corps de la réponse a 2 propriétés
    Et le corps de la réponse a une propriété "type" égale à "INSTANCE"
    Et le corps de la réponse a une propriété "payload" avec 2 attributs
    Et le corps de la réponse a une propriété "payload.instanceId"
    Et le corps de la réponse a une propriété "payload.versionId"

  Scénario: API service-provider instance création - erreur csrf-token manquant
    Etant donné que je me connecte à l'espace partenaires
    Et que je navigue sur la page liste des instances de l'espace partenaires
    Et que je suis sur la page liste des instances
    Et que je prépare une requête "service-provider-instance-creation"
    Et je retire "x-csrf-token" de l'entête de la requête
    Quand je lance la requête
    Alors le statut de la réponse est 400
    Et l'entête de la réponse a une propriété "content-type" contenant "application/json"
    Et le corps de la réponse a 3 propriétés
    Et le corps de la réponse a une propriété "code" égale à "P470002"
    Et le corps de la réponse a une propriété "id"
    Et le corps de la réponse a une propriété "message" égale à "Csrf.exceptions.csrfMissingToken"

  Scénario: API service-provider instance création - erreur csrf-token non valide
    Etant donné que je me connecte à l'espace partenaires
    Et que je navigue sur la page liste des instances de l'espace partenaires
    Et que je suis sur la page liste des instances
    Et que je prépare une requête "service-provider-instance-creation"
    Quand je lance la requête
    Alors le statut de la réponse est 401
    Et l'entête de la réponse a une propriété "content-type" contenant "application/json"
    Et le corps de la réponse a 3 propriétés
    Et le corps de la réponse a une propriété "code" égale à "P470004"
    Et le corps de la réponse a une propriété "id"
    Et le corps de la réponse a une propriété "message" égale à "Csrf.exceptions.csrfConsumedSessionToken"

  Scénario: API service-provider instance création - erreur champ obligatoire manquant
    Etant donné que je me connecte à l'espace partenaires
    Et que je navigue sur la page liste des instances de l'espace partenaires
    Et que je suis sur la page liste des instances
    Et que je prépare une requête "service-provider-instance-creation"
    Et je retire "name" du corps de la requête
    Quand je lance la requête avec le csrf-token
    Alors le statut de la réponse est 422
    Et l'entête de la réponse a une propriété "content-type" contenant "application/json"
    Et le corps de la réponse a 4 propriétés
    Et le corps de la réponse a une propriété "code" égale à "P480003"
    Et le corps de la réponse a une propriété "id"
    Et le corps de la réponse a une propriété "message" égale à "Dto2form.exceptions.dto2formValidationError"
    Et le corps de la réponse a une propriété "payload" avec 1 attribut
    Et le corps de la réponse a une propriété "payload.name" avec 1 élément
    Et le corps de la réponse a une propriété "payload.name[0]" avec 3 attributs
    Et le corps de la réponse a une propriété "payload.name[0].content" égale à "Veuillez saisir le nom de votre instance"
    Et le corps de la réponse a une propriété "payload.name[0].level" égale à "error"
    Et le corps de la réponse a une propriété "payload.name[0].priority" égale à 50

  Scénario: API service-provider instance création - erreur identifiant invalide (400)
    Etant donné que je me connecte à l'espace partenaires
    Et que je navigue sur la page liste des instances de l'espace partenaires
    Et que je suis sur la page liste des instances
    Et que je prépare une requête "service-provider-instance-creation"
    Et que je mets le chemin "/api/service-providers/not-a-valid-uuid/instances" dans l'url de la requête
    Quand je lance la requête avec le csrf-token
    Alors le statut de la réponse est 400
    Et l'entête de la réponse a une propriété "content-type" contenant "application/json"
    Et le corps de la réponse a une propriété "code" égale à "P240003"
    Et le corps de la réponse a une propriété "message" égale à "AccessControl.exceptions.AccessControlInvalidEntityIdException"
    Et le corps de la réponse a une propriété "id"
    Et le corps de la réponse a 3 propriétés

  Scénario: API service-provider instance création - erreur utilisateur sans permission (403)
    Etant donné que je me connecte à l'espace partenaires
    Et que je navigue sur la page liste des instances de l'espace partenaires
    Et que je suis sur la page liste des instances
    Et que je prépare une requête "service-provider-instance-creation"
    Et que je mets le chemin "/api/service-providers/aaaaaaaa-aaaa-4aaa-aaaa-aaaaaaaaaaaa/instances" dans l'url de la requête
    Quand je lance la requête avec le csrf-token
    Alors le statut de la réponse est 403
    Et l'entête de la réponse a une propriété "content-type" contenant "application/json"
    Et le corps de la réponse a une propriété "code" égale à "P000000"
    Et le corps de la réponse a une propriété "message" égale à "exceptions.default_message"
    Et le corps de la réponse a une propriété "id"
    Et le corps de la réponse a 3 propriétés

  Scénario: API service-provider instance création - erreur fournisseur de service inexistant (403)
    Etant donné que je me connecte à l'espace partenaires
    Et que je navigue sur la page liste des instances de l'espace partenaires
    Et que je suis sur la page liste des instances
    Et que je prépare une requête "service-provider-instance-creation"
    Et que je mets le chemin "/api/service-providers/99999999-9999-4999-9999-999999999999/instances" dans l'url de la requête
    Quand je lance la requête avec le csrf-token
    Alors le statut de la réponse est 403
    Et l'entête de la réponse a une propriété "content-type" contenant "application/json"
    Et le corps de la réponse a une propriété "code"
    Et le corps de la réponse a une propriété "message"
    Et le corps de la réponse a une propriété "id"
    Et le corps de la réponse a 3 propriétés
