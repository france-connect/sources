#language: fr
@usager @apiToken @ignoreInteg01 @ci
Fonctionnalité: API - token

  @fcpLow @fcpHigh @exceptions
  Scénario: API token - cas non passant
    Etant donné que je navigue sur la page fournisseur de service
    Et que je me connecte au fournisseur d'identité via FranceConnect
    Et que je suis redirigé vers la page d'information
    Et que je paramètre un intercepteur pour l'appel à la redirect_uri du fournisseur de service
    Et que je continue sur le fournisseur de service
    Et que je prépare une requête "token"
    Et que je mets "wrong-client-secret" dans la propriété "client_secret" du corps de la requête
    Et que je mets le code renvoyé par FC au FS dans la propriété "code" du corps de la requête
    Quand je lance la requête
    Alors le statut de la réponse est 401
    Et l'entête de la réponse a une propriété "content-type" contenant "application/json"
    Et l'entête de la réponse n'a pas de propriété "set-cookie"
    Et le corps de la réponse n'a pas de propriété "id_token"
    Et le corps de la réponse a une propriété "error" égale à "invalid_client"
    Et le corps de la réponse a une propriété "error_description" égale à "client authentication failed (invalid secret provided)"
    Et le corps de la réponse a une propriété "error_uri"

  @fcpLow @fcpHigh
  Scénario: API token - cas nominal
    Etant donné que je navigue sur la page fournisseur de service
    Et que je me connecte au fournisseur d'identité via FranceConnect
    Et que je suis redirigé vers la page d'information
    Et que je paramètre un intercepteur pour l'appel à la redirect_uri du fournisseur de service
    Et que je continue sur le fournisseur de service
    Et que je prépare une requête "token"
    Et que je mets le code renvoyé par FC au FS dans la propriété "code" du corps de la requête
    Quand je lance la requête
    Alors le statut de la réponse est 200
    Et l'entête de la réponse a une propriété "content-type" contenant "application/json"
    Et l'entête de la réponse n'a pas de propriété "set-cookie"
    Et le corps de la réponse a 5 propriétés
    Et le corps de la réponse a une propriété "access_token"
    Et le corps de la réponse a une propriété "expires_in" égale à 60
    Et le corps de la réponse a une propriété "id_token"
    Et le corps de la réponse a une propriété "scope"
    Et le corps de la réponse a une propriété "token_type" égale à "Bearer"

  @fcpHigh
  Scénario: API token - id_token - FCP High
    Etant donné que je navigue sur la page fournisseur de service
    Et que je me connecte au fournisseur d'identité via FranceConnect
    Et que je suis redirigé vers la page d'information
    Et que je paramètre un intercepteur pour l'appel à la redirect_uri du fournisseur de service
    Et que je continue sur le fournisseur de service
    Et que je prépare une requête "token"
    Et que je mets le code renvoyé par FC au FS dans la propriété "code" du corps de la requête
    Quand je lance la requête
    Alors le statut de la réponse est 200
    Et l'entête de la réponse a une propriété "content-type" contenant "application/json"
    Et le corps de la réponse contient le JWE id_token pour le FS
    Et l'entête du JWE a une propriété "alg" égale à "RSA-OAEP"
    Et l'entête du JWE a une propriété "iss" égale à "https://core-fcp-high.docker.dev-franceconnect.fr/api/v2"
    Et l'entête du JWS a une propriété "alg" égale à "ES256"
    Et le payload du JWT a une propriété "sub"
    Et le payload du JWT a une propriété "acr" égale à "eidas2"
    Et le payload du JWT a une propriété "amr"
    Et le payload du JWT a une propriété "nonce"
    Et le payload du JWT a une propriété "iss" égale à "https://core-fcp-high.docker.dev-franceconnect.fr/api/v2"

  @fcpLow
  Scénario: API token - id_token - FCP Low
    Etant donné que je navigue sur la page fournisseur de service
    Et que je me connecte au fournisseur d'identité via FranceConnect
    Et que je suis redirigé vers la page d'information
    Et que je paramètre un intercepteur pour l'appel à la redirect_uri du fournisseur de service
    Et que je continue sur le fournisseur de service
    Et que je prépare une requête "token"
    Et que je mets le code renvoyé par FC au FS dans la propriété "code" du corps de la requête
    Quand je lance la requête
    Alors le statut de la réponse est 200
    Et l'entête de la réponse a une propriété "content-type" contenant "application/json"
    Et le corps de la réponse contient le JWT id_token pour le FS
    Et le JWT n'est pas chiffré
    Et l'entête du JWS a une propriété "alg" égale à "HS256"
    Et le payload du JWT a une propriété "sub"
    Et le payload du JWT a une propriété "acr" égale à "eidas1"
    Et le payload du JWT a une propriété "amr"
    Et le payload du JWT a une propriété "nonce"
    Et le payload du JWT a une propriété "iss" égale à "https://core-fcp-low.docker.dev-franceconnect.fr/api/v2"
