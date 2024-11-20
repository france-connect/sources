#language: fr
@api @apiChecktoken @fcpLow @fcpHigh @ignoreInteg01 @ci
Fonctionnalité: API - checktoken

  Scénario: API checktoken - Cas nominal
    Etant donné que je prépare une requête "checktoken"
    Quand je lance la requête
    Alors le statut de la réponse est 200
    Et l'entête de la réponse a une propriété "content-type" égale à "application/token-introspection+jwt"
    Et l'entête de la réponse n'a pas de propriété "set-cookie"
    Et le corps de la réponse contient un JWT d'introspection
    Et l'entête du JWE a une propriété "alg" égale à "ECDH-ES"
    Et l'entête du JWS a une propriété "alg" égale à "ES256"
    Et le payload du JWT a 4 propriétés
    Et le payload du JWT a une propriété "token_introspection"
    Et le payload du JWT a une propriété "aud"
    Et le payload du JWT a une propriété "iat"
    Et le payload du JWT a une propriété "iss"

  @exceptions
  Scénario: API checktoken - client_id manquant
    Etant donné que je prépare une requête "checktoken"
    Et que je retire "client_id" du corps de la requête
    Quand je lance la requête
    Alors le statut de la réponse est 400
    Et l'entête de la réponse a une propriété "content-type" contenant "application/json"
    Et l'entête de la réponse n'a pas de propriété "set-cookie"
    Et le corps de la réponse contient une erreur
    Et le corps de la réponse a une propriété "error" égale à "invalid_request"
    Et le corps de la réponse a une propriété "error_description" égale à "Required parameter missing or invalid."

  @exceptions
  Scénario: API checktoken - client_secret manquant
    Etant donné que je prépare une requête "checktoken"
    Et que je retire "client_secret" du corps de la requête
    Quand je lance la requête
    Alors le statut de la réponse est 400
    Et l'entête de la réponse a une propriété "content-type" contenant "application/json"
    Et l'entête de la réponse n'a pas de propriété "set-cookie"
    Et le corps de la réponse contient une erreur
    Et le corps de la réponse a une propriété "error" égale à "invalid_request"
    Et le corps de la réponse a une propriété "error_description" égale à "Required parameter missing or invalid."

  @exceptions
  Scénario: API checktoken - token manquant
    Etant donné que je prépare une requête "checktoken"
    Et que je retire "token" du corps de la requête
    Quand je lance la requête
    Alors le statut de la réponse est 400
    Et l'entête de la réponse a une propriété "content-type" contenant "application/json"
    Et l'entête de la réponse n'a pas de propriété "set-cookie"
    Et le corps de la réponse contient une erreur
    Et le corps de la réponse a une propriété "error" égale à "invalid_request"
    Et le corps de la réponse a une propriété "error_description" égale à "Required parameter missing or invalid."

  @exceptions
  Scénario: API checktoken - Authentification client_secret invalide
    Etant donné que je prépare une requête "checktoken"
    Et que je mets "invalidclientsecret" dans la propriété "client_secret" du corps de la requête
    Quand je lance la requête
    Alors le statut de la réponse est 401
    Et l'entête de la réponse a une propriété "content-type" contenant "application/json"
    Et l'entête de la réponse n'a pas de propriété "set-cookie"
    Et le corps de la réponse contient une erreur
    Et le corps de la réponse a une propriété "error" égale à "invalid_client"
    Et le corps de la réponse a une propriété "error_description" égale à "Client authentication failed."

  @exceptions
  Scénario: API checktoken - Authentification client_id invalide
    Etant donné que je prépare une requête "checktoken"
    Et que je mets "invalidclientid" dans la propriété "client_id" du corps de la requête
    Quand je lance la requête
    Alors le statut de la réponse est 401
    Et l'entête de la réponse a une propriété "content-type" contenant "application/json"
    Et l'entête de la réponse n'a pas de propriété "set-cookie"
    Et le corps de la réponse contient une erreur
    Et le corps de la réponse a une propriété "error" égale à "invalid_client"
    Et le corps de la réponse a une propriété "error_description" égale à "Client authentication failed."
