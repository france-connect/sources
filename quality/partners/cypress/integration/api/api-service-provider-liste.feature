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
    Et le corps de la réponse a une propriété "payload[0].datapassScopes"
    Et le corps de la réponse a une propriété "payload[0].datapassScopes[0]" égale à "Identifiant technique"
    Et le corps de la réponse a une propriété "payload[0].datapassScopes[1]" égale à "Prénoms"
    Et le corps de la réponse a une propriété "payload[0].datapassScopes[2]" égale à "Nom de naissance"
    Et le corps de la réponse a une propriété "payload[0].datapassScopes[3]" égale à "Adresse électronique"
    Et le corps de la réponse a une propriété "payload[0].datapassScopes[4]" égale à "Sexe"
    Et le corps de la réponse a une propriété "payload[0].datapassScopes[5]" égale à "Date de naissance"
    Et le corps de la réponse a une propriété "payload[0].datapassScopes[6]" égale à "Ville de naissance"
    Et le corps de la réponse a une propriété "payload[0].datapassScopes[7]" égale à "Pays de naissance"
    Et le corps de la réponse a une propriété "payload[0].datapassScopes[8]" égale à "Nom d'usage"
    Et le corps de la réponse a une propriété "payload[0].datapassScopes" avec 9 éléments
    Et le corps de la réponse a une propriété "payload[0].createdAt"
    Et le corps de la réponse a une propriété "payload[0].updatedAt"
    Et le corps de la réponse a 2 propriétés

  Scénario: API service-providers - erreur utilisateur non authentifié (401)
    Etant donné que je prépare une requête "service-providers-list"
    Quand je lance la requête
    Alors le statut de la réponse est 401
