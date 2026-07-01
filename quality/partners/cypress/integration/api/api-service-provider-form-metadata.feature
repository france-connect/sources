#language: fr
@api @apiServiceProviderInstanceFormMetadata @ci
Fonctionnalité: API - métadonnées du formulaire d'instance depuis un fournisseur de service

  Scénario: API service-provider-instance-form-metadata - succès utilisateur authentifié
    Etant donné que je me connecte à l'espace partenaires avec un utilisateur "partenaire avec au moins un fournisseur de service"
    Et que je navigue sur la page liste des instances de l'espace partenaires
    Et que je suis sur la page liste des instances
    Et que je prépare une requête "service-provider-instance-form-metadata"
    Quand je lance la requête
    Alors le statut de la réponse est 200
    Et l'entête de la réponse a une propriété "content-type" contenant "application/json"
    Et le corps de la réponse est un tableau
    Et le corps de la réponse est un tableau avec 11 éléments
    Et le corps de la réponse contient un champ de formulaire "name"
    Et le corps de la réponse contient un champ de formulaire "redirect_uris"
    Et le corps de la réponse contient un champ de formulaire "post_logout_redirect_uris"
    Et le corps de la réponse contient un champ de formulaire "id_token_signed_response_alg"
    Et le corps de la réponse contient un champ de formulaire "entityId"
    Et le corps de la réponse ne contient pas de champ de formulaire "signupId"
    Et le corps de la réponse ne contient pas de champ de formulaire "platform"

  Scénario: API service-provider-instance-form-metadata - erreur utilisateur non authentifié (401)
    Etant donné que je prépare une requête "service-provider-instance-form-metadata"
    Quand je lance la requête
    Alors le statut de la réponse est 401

  Scénario: API service-provider-instance-form-metadata - erreur identifiant invalide (400)
    Etant donné que je me connecte à l'espace partenaires
    Et que je navigue sur la page liste des instances de l'espace partenaires
    Et que je suis sur la page liste des instances
    Et que je prépare une requête "service-provider-instance-form-metadata"
    Et que je mets le chemin "/api/service-providers/not-a-valid-uuid/versions/form-metadata" dans l'url de la requête
    Quand je lance la requête
    Alors le statut de la réponse est 400
    Et l'entête de la réponse a une propriété "content-type" contenant "application/json"
    Et le corps de la réponse a une propriété "code" égale à "P240003"
    Et le corps de la réponse a une propriété "message" égale à "AccessControl.exceptions.AccessControlInvalidEntityIdException"
    Et le corps de la réponse a une propriété "id"
    Et le corps de la réponse a 3 propriétés

  Scénario: API service-provider-instance-form-metadata - erreur utilisateur sans permission (403)
    Etant donné que je me connecte à l'espace partenaires
    Et que je navigue sur la page liste des instances de l'espace partenaires
    Et que je suis sur la page liste des instances
    Et que je prépare une requête "service-provider-instance-form-metadata"
    Et que je mets le chemin "/api/service-providers/aaaaaaaa-aaaa-4aaa-aaaa-aaaaaaaaaaaa/versions/form-metadata" dans l'url de la requête
    Quand je lance la requête
    Alors le statut de la réponse est 403
    Et l'entête de la réponse a une propriété "content-type" contenant "application/json"
    Et le corps de la réponse a une propriété "code" égale à "P000000"
    Et le corps de la réponse a une propriété "message" égale à "exceptions.default_message"
    Et le corps de la réponse a une propriété "id"
    Et le corps de la réponse a 3 propriétés

  Scénario: API service-provider-instance-form-metadata - erreur fournisseur de service inexistant (403)
    Etant donné que je me connecte à l'espace partenaires
    Et que je navigue sur la page liste des instances de l'espace partenaires
    Et que je suis sur la page liste des instances
    Et que je prépare une requête "service-provider-instance-form-metadata"
    Et que je mets le chemin "/api/service-providers/99999999-9999-4999-9999-999999999999/versions/form-metadata" dans l'url de la requête
    Quand je lance la requête
    Alors le statut de la réponse est 403
    Et l'entête de la réponse a une propriété "content-type" contenant "application/json"
    Et le corps de la réponse a une propriété "code"
    Et le corps de la réponse a une propriété "message"
    Et le corps de la réponse a une propriété "id"
    Et le corps de la réponse a 3 propriétés
