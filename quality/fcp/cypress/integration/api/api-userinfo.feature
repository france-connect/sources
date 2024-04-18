#language: fr
@usager @apiUserinfo @ignoreInteg01 @ci
Fonctionnalité: API - userinfo

  @fcpHigh
  Scénario: API userinfo - cas nominal - FCP High
    Etant donné que je navigue sur la page fournisseur de service
    Et que je me connecte au fournisseur d'identité via FranceConnect
    Et que je suis redirigé vers la page d'information
    Et que je paramètre un intercepteur pour l'appel à la redirect_uri du fournisseur de service
    Et que je continue sur le fournisseur de service
    Et que je prépare une requête "token"
    Et que je mets le code renvoyé par FC au FS dans la propriété "code" du corps de la requête
    Et que je lance la requête
    Et que le statut de la réponse est 200
    Et que le corps de la réponse a une propriété "access_token"
    Et que je prépare une requête "userinfo"
    Et que je mets l'access token fourni par FC dans le paramètre "authorization" de l'entête de la requête
    Quand je lance la requête
    Alors le statut de la réponse est 200
    Et l'entête de la réponse a une propriété "content-type" contenant "application/jwt"
    Et l'entête de la réponse n'a pas de propriété "set-cookie"
    Et le corps de la réponse contient le JWT userinfo pour le FS
    Et l'entête du JWE a une propriété "alg" égale à "RSA-OAEP"
    Et l'entête du JWE a une propriété "iss" égale à "https://core-fcp-high.docker.dev-franceconnect.fr/api/v2"
    Et l'entête du JWS a une propriété "alg" égale à "ES256"
    Et le payload du JWT a une propriété "sub"
    Et le payload du JWT n'a pas de propriété "acr"
    Et le payload du JWT n'a pas de propriété "amr"
    Et le payload du JWT n'a pas de propriété "nonce"
    Et le payload du JWT a une propriété "given_name"
    Et le payload du JWT a une propriété "family_name"
    Et le payload du JWT a une propriété "birthdate"
    Et le payload du JWT a une propriété "gender"
    Et le payload du JWT a une propriété "preferred_username"
    Et le payload du JWT a une propriété "birthcountry"
    Et le payload du JWT a une propriété "birthplace"
    Et le payload du JWT a une propriété "email"
    Et le payload du JWT a une propriété "iss" égale à "https://core-fcp-high.docker.dev-franceconnect.fr/api/v2"

  @fcpLow
  Scénario: API userinfo - cas nominal - FCP Low
    Etant donné que je navigue sur la page fournisseur de service
    Et que je me connecte au fournisseur d'identité via FranceConnect
    Et que je suis redirigé vers la page d'information
    Et que je paramètre un intercepteur pour l'appel à la redirect_uri du fournisseur de service
    Et que je continue sur le fournisseur de service
    Et que je prépare une requête "token"
    Et que je mets le code renvoyé par FC au FS dans la propriété "code" du corps de la requête
    Et que je lance la requête
    Et que le statut de la réponse est 200
    Et que le corps de la réponse a une propriété "access_token"
    Et que je prépare une requête "userinfo"
    Et que je mets l'access token fourni par FC dans le paramètre "authorization" de l'entête de la requête
    Quand je lance la requête
    Alors le statut de la réponse est 200
    Et l'entête de la réponse a une propriété "content-type" contenant "application/jwt"
    Et l'entête de la réponse n'a pas de propriété "set-cookie"
    Et le corps de la réponse contient le JWT userinfo pour le FS
    Et le JWT n'est pas chiffré
    Et l'entête du JWS a une propriété "alg" égale à "HS256"
    Et le payload du JWT a une propriété "sub"
    Et le payload du JWT n'a pas de propriété "acr"
    Et le payload du JWT n'a pas de propriété "amr"
    Et le payload du JWT n'a pas de propriété "nonce"
    Et le payload du JWT a une propriété "given_name"
    Et le payload du JWT a une propriété "family_name"
    Et le payload du JWT a une propriété "birthdate"
    Et le payload du JWT a une propriété "gender"
    Et le payload du JWT a une propriété "preferred_username"
    Et le payload du JWT a une propriété "birthcountry"
    Et le payload du JWT a une propriété "birthplace"
    Et le payload du JWT a une propriété "email"
    Et le payload du JWT a une propriété "iss" égale à "https://core-fcp-low.docker.dev-franceconnect.fr/api/v2"
