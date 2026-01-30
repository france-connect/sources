#language: fr
@api @apiServiceProviderListe @ci @ignoreInteg01
Fonctionnalité: API - Service Provider liste

  Scénario: API service-providers - liste succès
    Etant donné que je me connecte à l'espace partenaires
    Et que je suis sur la page liste des instances
    Et que je prépare une requête "service-providers-list"
    Quand je lance la requête
    Alors le statut de la réponse est 200
    Et l'entête de la réponse a une propriété "content-type" contenant "application/json"
    Et le corps de la réponse a une propriété "type" égale à "SERVICE_PROVIDER"
    Et le corps de la réponse a une propriété "payload"
    Et le corps de la réponse a une propriété "payload[0].id"
    Et le corps de la réponse a une propriété "payload[0].name"
    Et le corps de la réponse a une propriété "payload[0].organizationName"
    Et le corps de la réponse a une propriété "payload[0].datapassRequestId"
    Et le corps de la réponse a une propriété "payload[0].authorizedScopes"
    Et le corps de la réponse a une propriété "payload[0].createdAt"
    Et le corps de la réponse a une propriété "payload[0].updatedAt"
    Et le corps de la réponse a 2 propriétés

  Scénario: API service-providers - erreur utilisateur non authentifié (401)
    Etant donné que je prépare une requête "service-providers-list"
    Quand je lance la requête
    Alors le statut de la réponse est 401
