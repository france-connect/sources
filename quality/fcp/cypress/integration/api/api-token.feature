#language: fr
@usager @apiToken @ignoreInteg01 @ci
Fonctionnalité: API - token

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
    Et le corps de la réponse a une propriété "access_token"
    Et le corps de la réponse a une propriété "expires_in" égale à 60
    Et le corps de la réponse a une propriété "id_token"
    Et le corps de la réponse a une propriété "scope"
    Et le corps de la réponse a une propriété "token_type" égale à "Bearer"
    Et le corps de la réponse a 5 propriétés

  @fcpHigh
  Scénario: API token - FCP High - id_token avec chiffrement RSA-OAEP-256 et signature ES256 
    Etant donné que j'utilise un fournisseur de service "avec chiffrement RSA-OAEP-256"
    Et que je navigue sur la page fournisseur de service
    Et que je paramètre un intercepteur pour l'appel à la redirect_uri du fournisseur de service
    Et que je me connecte à FranceConnect jusqu'au consentement
    Et que je prépare une requête "token"
    Et que je mets le code renvoyé par FC au FS dans la propriété "code" du corps de la requête
    Quand je lance la requête
    Alors le statut de la réponse est 200
    Et l'entête de la réponse a une propriété "content-type" contenant "application/json"
    Et le corps de la réponse contient le JWE id_token pour le FS avec chiffrement "RSA-OAEP-256"
    Et l'entête du JWE a une propriété "alg" égale à "RSA-OAEP-256"
    Et l'entête du JWE a une propriété "enc" égale à "A256GCM"
    Et l'entête du JWE a une propriété "cty" égale à "JWT"
    Et l'entête du JWE a une propriété "kid" égale à "oidc-client:locale"
    Et l'entête du JWE a une propriété "iss" égale à "https://core-fcp-high.docker.dev-franceconnect.fr/api/v2"
    Et l'entête du JWE a une propriété "aud"
    Et l'entête du JWE a 6 propriétés
    Et l'entête du JWS a une propriété "alg" égale à "ES256"
    Et l'entête du JWS a une propriété "kid" égale à "pkcs11:hsm"
    Et l'entête du JWS a 2 propriétés
    Et le JWT id_token est signé avec la clé "ES256" de FranceConnect
    Et le payload du JWT a une propriété "sub"
    Et le payload du JWT a une propriété "acr" égale à "eidas2"
    Et le payload du JWT a une propriété "amr"
    Et le payload du JWT a une propriété "auth_time"
    Et le payload du JWT a une propriété "nonce"
    Et le payload du JWT a une propriété "aud"
    Et le payload du JWT a une propriété "exp"
    Et le payload du JWT a une propriété "iat"
    Et le payload du JWT a une propriété "iss" égale à "https://core-fcp-high.docker.dev-franceconnect.fr/api/v2"
    Et le payload du JWT a 9 propriétés

  @fcpHigh
  Scénario: API token - FCP High - id_token avec chiffrement ECDH-ES et signature ES256 
    Etant donné que j'utilise un fournisseur de service "avec chiffrement ECDH-ES"
    Et que je navigue sur la page fournisseur de service
    Et que je paramètre un intercepteur pour l'appel à la redirect_uri du fournisseur de service
    Et que je me connecte à FranceConnect jusqu'au consentement
    Et que je prépare une requête "token pour un FS avec chiffrement ECDH-ES"
    Et que je mets le code renvoyé par FC au FS dans la propriété "code" du corps de la requête
    Quand je lance la requête
    Alors le statut de la réponse est 200
    Et l'entête de la réponse a une propriété "content-type" contenant "application/json"
    Et le corps de la réponse contient le JWE id_token pour le FS avec chiffrement "ECDH-ES"
    Et l'entête du JWE a une propriété "alg" égale à "ECDH-ES"
    Et l'entête du JWE a une propriété "enc" égale à "A256GCM"
    Et l'entête du JWE a une propriété "cty" égale à "JWT"
    Et l'entête du JWE a une propriété "kid" égale à "EC"
    Et l'entête du JWE a une propriété "iss" égale à "https://core-fcp-high.docker.dev-franceconnect.fr/api/v2"
    Et l'entête du JWE a une propriété "aud"
    Et l'entête du JWE a une propriété "epk"
    Et l'entête du JWE a 7 propriétés
    Et l'entête du JWS a une propriété "alg" égale à "ES256"
    Et l'entête du JWS a une propriété "kid" égale à "pkcs11:hsm"
    Et l'entête du JWS a 2 propriétés
    Et le JWT id_token est signé avec la clé "ES256" de FranceConnect
    Et le payload du JWT a une propriété "sub"
    Et le payload du JWT a une propriété "acr" égale à "eidas2"
    Et le payload du JWT a une propriété "amr"
    Et le payload du JWT a une propriété "auth_time"
    Et le payload du JWT a une propriété "nonce"
    Et le payload du JWT a une propriété "aud"
    Et le payload du JWT a une propriété "exp"
    Et le payload du JWT a une propriété "iat"
    Et le payload du JWT a une propriété "iss" égale à "https://core-fcp-high.docker.dev-franceconnect.fr/api/v2"
    Et le payload du JWT a 9 propriétés

  @fcpLow
  Scénario: API token - FCP Low - id_token avec signature ES256
    Etant donné que j'utilise un fournisseur de service "avec signature ES256"
    Et que je navigue sur la page fournisseur de service
    Et que je paramètre un intercepteur pour l'appel à la redirect_uri du fournisseur de service
    Et que je me connecte à FranceConnect jusqu'au consentement
    Et que je prépare une requête "token"
    Et que je mets le code renvoyé par FC au FS dans la propriété "code" du corps de la requête
    Quand je lance la requête
    Alors le statut de la réponse est 200
    Et l'entête de la réponse a une propriété "content-type" contenant "application/json"
    Et le corps de la réponse contient le JWT id_token pour le FS
    Et le JWT n'est pas chiffré
    Et l'entête du JWS a une propriété "alg" égale à "ES256"
    Et l'entête du JWS a une propriété "kid" égale à "pkcs11:ES256:hsm"
    Et l'entête du JWS a 2 propriétés
    Et le JWT userinfo est signé avec la clé "ES256" de FranceConnect
    Et le payload du JWT a une propriété "sub"
    Et le payload du JWT a une propriété "acr" égale à "eidas1"
    Et le payload du JWT a une propriété "amr"
    Et le payload du JWT a une propriété "auth_time"
    Et le payload du JWT a une propriété "nonce"
    Et le payload du JWT a une propriété "aud"
    Et le payload du JWT a une propriété "exp"
    Et le payload du JWT a une propriété "iat"
    Et le payload du JWT a une propriété "iss" égale à "https://core-fcp-low.docker.dev-franceconnect.fr/api/v2"
    Et le payload du JWT a 9 propriétés

  @fcpLow
  Scénario: API token - FCP Low - id_token avec signature RS256 (sans amr)
    Etant donné que j'utilise un fournisseur de service "avec signature RS256"
    Et que je navigue sur la page fournisseur de service
    Et que le fournisseur de service ne requiert pas le claim "amr"
    Et que je paramètre un intercepteur pour l'appel à la redirect_uri du fournisseur de service
    Et que je me connecte à FranceConnect jusqu'au consentement
    Et que je prépare une requête "token pour un FS avec signature RS256"
    Et que je mets le code renvoyé par FC au FS dans la propriété "code" du corps de la requête
    Quand je lance la requête
    Alors le statut de la réponse est 200
    Et l'entête de la réponse a une propriété "content-type" contenant "application/json"
    Et le corps de la réponse contient le JWT id_token pour le FS
    Et le JWT n'est pas chiffré
    Et l'entête du JWS a une propriété "alg" égale à "RS256"
    Et l'entête du JWS a une propriété "kid" égale à "pkcs11:RS256:hsm"
    Et l'entête du JWS a 2 propriétés
    Et le JWT userinfo est signé avec la clé "RS256" de FranceConnect
    Et le payload du JWT a une propriété "sub"
    Et le payload du JWT a une propriété "acr" égale à "eidas1"
    Et le payload du JWT n'a pas de propriété "amr"
    Et le payload du JWT a une propriété "nonce"
    Et le payload du JWT a une propriété "aud"
    Et le payload du JWT a une propriété "exp"
    Et le payload du JWT a une propriété "iat"
    Et le payload du JWT a une propriété "iss" égale à "https://core-fcp-low.docker.dev-franceconnect.fr/api/v2"
    Et le payload du JWT a 8 propriétés

  @fcpLow @fcpHigh @exceptions
  Scénario: API token - erreur mauvais client_secret
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
    Et le corps de la réponse contient une erreur
    Et le corps de la réponse a une propriété "error" égale à "invalid_client"
    Et le corps de la réponse a une propriété "error_description" égale à "client authentication failed (invalid secret provided)"
    Et le corps de la réponse a une propriété "error_uri" contenant "https://docs.partenaires.franceconnect.gouv.fr/fs/fs-technique/fs-technique-erreurs/?code=Y0434A7B&id="

  @fcpLow @fcpHigh @exceptions
  Scénario: API token - erreur code manquant
    Etant donné que je navigue sur la page fournisseur de service
    Et que je me connecte au fournisseur d'identité via FranceConnect
    Et que je suis redirigé vers la page d'information
    Et que je paramètre un intercepteur pour l'appel à la redirect_uri du fournisseur de service
    Et que je continue sur le fournisseur de service
    Et que je prépare une requête "token"
    Et que je mets "" dans la propriété "code" du corps de la requête
    Quand je lance la requête
    Alors le statut de la réponse est 400
    Et l'entête de la réponse a une propriété "content-type" contenant "application/json"
    Et l'entête de la réponse n'a pas de propriété "set-cookie"
    Et le corps de la réponse contient une erreur
    Et le corps de la réponse a une propriété "error" égale à "invalid_request"
    Et le corps de la réponse a une propriété "error_description" égale à "missing required parameter 'code' (undefined)"
    Et le corps de la réponse a une propriété "error_uri" contenant "https://docs.partenaires.franceconnect.gouv.fr/fs/fs-technique/fs-technique-erreurs/?code=Y048017B&id="

  @fcpLow @fcpHigh @exceptions
  Scénario: API token - erreur code expiré ou non trouvé
    Etant donné que je prépare une requête "token"
    Quand je lance la requête
    Alors le statut de la réponse est 400
    Et l'entête de la réponse a une propriété "content-type" contenant "application/json"
    Et l'entête de la réponse n'a pas de propriété "set-cookie"
    Et le corps de la réponse contient une erreur
    Et le corps de la réponse a une propriété "error" égale à "invalid_grant"
    Et le corps de la réponse a une propriété "error_description" égale à "grant request is invalid (authorization code not found)"
    Et le corps de la réponse a une propriété "error_uri" contenant "https://docs.partenaires.franceconnect.gouv.fr/fs/fs-technique/fs-technique-erreurs/?code=Y049E20B&id="
