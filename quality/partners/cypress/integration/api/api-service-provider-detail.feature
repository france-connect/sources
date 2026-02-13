#language: fr
@api @apiServiceProviderDetail @ci @ignoreInteg01
Fonctionnalité: API - Service Provider détail

  Scénario: API service-provider - détail succès utilisateur authentifié
    Etant donné que je me connecte à l'espace partenaires
    Et que je suis sur la page liste des instances
    Et que je prépare une requête "service-provider-get"
    Quand je lance la requête
    Alors le statut de la réponse est 200
    Et l'entête de la réponse a une propriété "content-type" contenant "application/json"
    Et le corps de la réponse a une propriété "type" égale à "SERVICE_PROVIDER"
    Et le corps de la réponse a une propriété "payload"
    Et le corps de la réponse a une propriété "payload.id" égale à "25c4e41c-a97d-4bc9-8e05-e353c91eaef5"
    Et le corps de la réponse a une propriété "payload.name" égale à "Service Provider 2"
    Et le corps de la réponse a une propriété "payload.organizationName" égale à "Ministère de l'Intérieur"
    Et le corps de la réponse a une propriété "payload.datapassRequestId" égale à "13245"
    Et le corps de la réponse a une propriété "payload.datapassScopes"
    Et le corps de la réponse a une propriété "payload.datapassScopes[0]" égale à "Identifiant technique"
    Et le corps de la réponse a une propriété "payload.datapassScopes[1]" égale à "Prénoms"
    Et le corps de la réponse a une propriété "payload.datapassScopes[2]" égale à "Nom de naissance"
    Et le corps de la réponse a une propriété "payload.datapassScopes[3]" égale à "Adresse électronique"
    Et le corps de la réponse a une propriété "payload.datapassScopes[4]" égale à "Sexe"
    Et le corps de la réponse a une propriété "payload.datapassScopes[5]" égale à "Date de naissance"
    Et le corps de la réponse a une propriété "payload.datapassScopes[6]" égale à "Ville de naissance"
    Et le corps de la réponse a une propriété "payload.datapassScopes[7]" égale à "Pays de naissance"
    Et le corps de la réponse a une propriété "payload.datapassScopes[8]" égale à "Nom d'usage"
    Et le corps de la réponse a une propriété "payload.datapassScopes" avec 9 éléments
    Et le corps de la réponse a une propriété "payload.fcScopes"
    Et le corps de la réponse a une propriété "payload.fcScopes[0]" égale à "profile"
    Et le corps de la réponse a une propriété "payload.fcScopes[1]" égale à "birth"
    Et le corps de la réponse a une propriété "payload.fcScopes[2]" égale à "identite_pivot"
    Et le corps de la réponse a une propriété "payload.fcScopes[3]" égale à "openid"
    Et le corps de la réponse a une propriété "payload.fcScopes[4]" égale à "gender"
    Et le corps de la réponse a une propriété "payload.fcScopes[5]" égale à "birthdate"
    Et le corps de la réponse a une propriété "payload.fcScopes[6]" égale à "birthcountry"
    Et le corps de la réponse a une propriété "payload.fcScopes[7]" égale à "birthplace"
    Et le corps de la réponse a une propriété "payload.fcScopes[8]" égale à "given_name"
    Et le corps de la réponse a une propriété "payload.fcScopes[9]" égale à "family_name"
    Et le corps de la réponse a une propriété "payload.fcScopes[10]" égale à "email"
    Et le corps de la réponse a une propriété "payload.fcScopes[11]" égale à "preferred_username"
    Et le corps de la réponse a une propriété "payload.fcScopes" avec 12 éléments
    Et le corps de la réponse a une propriété "payload.createdAt"
    Et le corps de la réponse a une propriété "payload.updatedAt"
    Et le corps de la réponse a 2 propriétés
    Et le corps de la réponse a une propriété "payload" avec 8 attributs

  Scénario: API service-provider - erreur utilisateur non authentifié (401)
    Etant donné que je prépare une requête "service-provider-get"
    Quand je lance la requête
    Alors le statut de la réponse est 401

  Scénario: API service-provider - erreur utilisateur sans permission (403)
    Etant donné que je me connecte à l'espace partenaires
    Et que je suis sur la page liste des instances
    Et que je prépare une requête "service-provider-get"
    Et que je mets le chemin "/api/service-providers/aaaaaaaa-aaaa-4aaa-aaaa-aaaaaaaaaaaa" dans l'url de la requête
    Quand je lance la requête
    Alors le statut de la réponse est 403
    Et l'entête de la réponse a une propriété "content-type" contenant "application/json"
    Et le corps de la réponse a une propriété "code" égale à "P000000"
    Et le corps de la réponse a une propriété "message" égale à "exceptions.default_message"
    Et le corps de la réponse a une propriété "id"
    Et le corps de la réponse a 3 propriétés

  Scénario: API service-provider - erreur service provider inexistant (403)
    Etant donné que je me connecte à l'espace partenaires
    Et que je suis sur la page liste des instances
    Et que je prépare une requête "service-provider-get"
    Et que je mets le chemin "/api/service-providers/99999999-9999-4999-9999-999999999999" dans l'url de la requête
    Quand je lance la requête
    Alors le statut de la réponse est 403
    Et l'entête de la réponse a une propriété "content-type" contenant "application/json"
    Et le corps de la réponse a une propriété "code"
    Et le corps de la réponse a une propriété "message"
    Et le corps de la réponse a une propriété "id"
    Et le corps de la réponse a 3 propriétés

