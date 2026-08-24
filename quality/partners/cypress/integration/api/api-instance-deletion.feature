#language: fr
@api @apiInstanceDeletion @ci
Fonctionnalité: API - instance suppression

  Scénario: API instance suppression - suppression succès
    Etant donné que je me connecte à l'espace partenaires
    Et que je navigue sur la page liste des instances de l'espace partenaires
    Et que je suis sur la page liste des instances
    Et que je prépare une requête "instance-creation"
    Et que je lance la requête avec le csrf-token
    Et que le statut de la réponse est 201
    Et que je mémorise la propriété "payload.instanceId" du corps de la réponse
    Et que je prépare une requête "instance-deletion"
    Et que je mets la donnée mémorisée "payload.instanceId" dans le chemin "/api/instances/" de l'url de la requête
    Quand je lance la requête avec le csrf-token
    Alors le statut de la réponse est 200
    Et l'entête de la réponse a une propriété "content-type" contenant "application/json"
    Et le corps de la réponse a une propriété "type" égale à "INSTANCE"
    Et le corps de la réponse a une propriété "payload" avec 0 attribut
    Et le corps de la réponse a 2 propriétés

  Scénario: API instance suppression - erreur identifiant invalide (400)
    Etant donné que je me connecte à l'espace partenaires
    Et que je navigue sur la page liste des instances de l'espace partenaires
    Et que je suis sur la page liste des instances
    Et que je prépare une requête "instance-deletion"
    Et que je mets le chemin "/api/instances/not-a-valid-uuid" dans l'url de la requête
    Quand je lance la requête avec le csrf-token
    Alors le statut de la réponse est 400
    Et l'entête de la réponse a une propriété "content-type" contenant "application/json"
    Et le corps de la réponse a 3 propriétés
    Et le corps de la réponse a une propriété "code" égale à "P240003"
    Et le corps de la réponse a une propriété "id"
    Et le corps de la réponse a une propriété "message" égale à "AccessControl.exceptions.AccessControlInvalidEntityIdException"

  Scénario: API instance suppression - erreur instance inexistante
    Etant donné que je me connecte à l'espace partenaires
    Et que je navigue sur la page liste des instances de l'espace partenaires
    Et que je suis sur la page liste des instances
    Et que je prépare une requête "instance-deletion"
    Et que je mets le chemin "/api/instances/aaaaaaaa-aaaa-4aaa-aaaa-aaaaaaaaaaaa" dans l'url de la requête
    Quand je lance la requête avec le csrf-token
    Alors le statut de la réponse est 403
    Et l'entête de la réponse a une propriété "content-type" contenant "application/json"
    Et le corps de la réponse a 3 propriétés
    Et le corps de la réponse a une propriété "code" égale à "P000000"
    Et le corps de la réponse a une propriété "id"
    Et le corps de la réponse a une propriété "message" égale à "exceptions.default_message"

  Scénario: API instance suppression - erreur instance sans droit de suppression
    Etant donné que je me connecte à l'espace partenaires
    Et que je navigue sur la page liste des instances de l'espace partenaires
    Et que je suis sur la page liste des instances
    Et que je prépare une requête "instance-deletion"
    Et que je mets le chemin "/api/instances/50b70101-0e1f-419a-9365-81754c2de689" dans l'url de la requête
    Quand je lance la requête avec le csrf-token
    Alors le statut de la réponse est 403
    Et l'entête de la réponse a une propriété "content-type" contenant "application/json"
    Et le corps de la réponse a 3 propriétés
    Et le corps de la réponse a une propriété "code" égale à "P000000"
    Et le corps de la réponse a une propriété "id"
    Et le corps de la réponse a une propriété "message" égale à "exceptions.default_message"

  Scénario: API instance suppression - erreur csrf-token manquant
    Etant donné que je me connecte à l'espace partenaires
    Et que je navigue sur la page liste des instances de l'espace partenaires
    Et que je suis sur la page liste des instances
    Et que je prépare une requête "instance-deletion"
    Et je retire "x-csrf-token" de l'entête de la requête
    Quand je lance la requête
    Alors le statut de la réponse est 400
    Et l'entête de la réponse a une propriété "content-type" contenant "application/json"
    Et le corps de la réponse a 3 propriétés
    Et le corps de la réponse a une propriété "code" égale à "P470002"
    Et le corps de la réponse a une propriété "id"
    Et le corps de la réponse a une propriété "message" égale à "Csrf.exceptions.csrfMissingToken"

  Scénario: API instance suppression - erreur csrf-token non valide
    Etant donné que je me connecte à l'espace partenaires
    Et que je navigue sur la page liste des instances de l'espace partenaires
    Et que je suis sur la page liste des instances
    Et que je prépare une requête "instance-deletion"
    Quand je lance la requête
    Alors le statut de la réponse est 401
    Et l'entête de la réponse a une propriété "content-type" contenant "application/json"
    Et le corps de la réponse a 3 propriétés
    Et le corps de la réponse a une propriété "code" égale à "P470001"
    Et le corps de la réponse a une propriété "id"
    Et le corps de la réponse a une propriété "message" égale à "Csrf.exceptions.csrfBadToken"
