#language: fr
@api @apiLinkableInstances @ci
Fonctionnalité: API - instances liables

  Scénario: API linkable-instances - erreur identifiant invalide (400)
    Etant donné que je me connecte à l'espace partenaires
    Et que je navigue sur la page liste des instances de l'espace partenaires
    Et que je suis sur la page liste des instances
    Et que je prépare une requête "linkable-instances-get"
    Et que je mets le chemin "/api/linkable-instances/not-a-valid-uuid" dans l'url de la requête
    Quand je lance la requête
    Alors le statut de la réponse est 400
    Et l'entête de la réponse a une propriété "content-type" contenant "application/json"
    Et le corps de la réponse a une propriété "code" égale à "P240003"
    Et le corps de la réponse a une propriété "message" égale à "AccessControl.exceptions.AccessControlInvalidEntityIdException"
    Et le corps de la réponse a une propriété "id"
    Et le corps de la réponse a 3 propriétés
