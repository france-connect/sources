#language: fr
@usager @apiUserinfo @ignoreInteg01 @ci
Fonctionnalité: API - userinfo

  @fcpHigh
  Scénario: API userinfo - FCP High - userinfo avec chiffrement RSA-OAEP-256 et signature ES256
    Etant donné que j'utilise un fournisseur de service "avec chiffrement RSA-OAEP-256" 
    Et que je navigue sur la page fournisseur de service
    Et que je paramètre un intercepteur pour l'appel à la redirect_uri du fournisseur de service
    Et que je me connecte à FranceConnect jusqu'au consentement
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
    Et le corps de la réponse contient le JWE userinfo pour le FS avec chiffrement "RSA-OAEP-256"
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
    Et le JWT userinfo est signé avec la clé "ES256" de FranceConnect
    Et le payload du JWT a une propriété "sub"
    Et le payload du JWT a une propriété "given_name"
    Et le payload du JWT a une propriété "family_name"
    Et le payload du JWT a une propriété "birthdate"
    Et le payload du JWT a une propriété "gender"
    Et le payload du JWT a une propriété "preferred_username"
    Et le payload du JWT a une propriété "birthcountry"
    Et le payload du JWT a une propriété "birthplace"
    Et le payload du JWT a une propriété "email"
    Et le payload du JWT a une propriété "aud"
    Et le payload du JWT a une propriété "exp"
    Et le payload du JWT a une propriété "iat"
    Et le payload du JWT a une propriété "iss" égale à "https://core-fcp-high.docker.dev-franceconnect.fr/api/v2"
    Et le payload du JWT a 13 propriétés

  @fcpHigh
  Scénario: API userinfo - FCP High - userinfo avec chiffrement ECDH-ES et signature ES256
    Etant donné que j'utilise un fournisseur de service "avec chiffrement ECDH-ES" 
    Et que je navigue sur la page fournisseur de service
    Et que je paramètre un intercepteur pour l'appel à la redirect_uri du fournisseur de service
    Et que je me connecte à FranceConnect jusqu'au consentement
    Et que je prépare une requête "token pour un FS avec chiffrement ECDH-ES"
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
    Et le corps de la réponse contient le JWE userinfo pour le FS avec chiffrement "ECDH-ES"
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
    Et le JWT userinfo est signé avec la clé "ES256" de FranceConnect
    Et le payload du JWT a une propriété "sub"
    Et le payload du JWT a une propriété "given_name"
    Et le payload du JWT a une propriété "family_name"
    Et le payload du JWT a une propriété "birthdate"
    Et le payload du JWT a une propriété "gender"
    Et le payload du JWT a une propriété "preferred_username"
    Et le payload du JWT a une propriété "birthcountry"
    Et le payload du JWT a une propriété "birthplace"
    Et le payload du JWT a une propriété "email"
    Et le payload du JWT a une propriété "aud"
    Et le payload du JWT a une propriété "exp"
    Et le payload du JWT a une propriété "iat"
    Et le payload du JWT a une propriété "iss" égale à "https://core-fcp-high.docker.dev-franceconnect.fr/api/v2"
    Et le payload du JWT a 13 propriétés

  @fcpLow
  Scénario: API userinfo - FCP Low - userinfo avec signature ES256
    Etant donné que j'utilise un fournisseur de service "avec signature ES256"
    Et que je navigue sur la page fournisseur de service
    Et que je paramètre un intercepteur pour l'appel à la redirect_uri du fournisseur de service
    Et que je me connecte à FranceConnect jusqu'au consentement
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
    Et l'entête du JWS a une propriété "alg" égale à "ES256"
    Et l'entête du JWS a une propriété "kid" égale à "pkcs11:ES256:hsm"
    Et l'entête du JWS a 2 propriétés
    Et le JWT userinfo est signé avec la clé "ES256" de FranceConnect
    Et le payload du JWT a une propriété "sub"
    Et le payload du JWT a une propriété "given_name"
    Et le payload du JWT a une propriété "given_name_array"
    Et le payload du JWT a une propriété "family_name"
    Et le payload du JWT a une propriété "birthdate"
    Et le payload du JWT a une propriété "idp_birthdate"
    Et le payload du JWT a une propriété "gender"
    Et le payload du JWT a une propriété "preferred_username"
    Et le payload du JWT a une propriété "birthcountry"
    Et le payload du JWT a une propriété "birthplace"
    Et le payload du JWT a une propriété "email"
    Et le payload du JWT a une propriété "aud"
    Et le payload du JWT a une propriété "exp"
    Et le payload du JWT a une propriété "iat"
    Et le payload du JWT a une propriété "iss" égale à "https://core-fcp-low.docker.dev-franceconnect.fr/api/v2"
    Et le payload du JWT a 15 propriétés

  @fcpLow
  Scénario: API userinfo - FCP Low - userinfo avec signature RS256
    Etant donné que j'utilise un fournisseur de service "avec signature RS256"
    Et que je navigue sur la page fournisseur de service
    Et que je paramètre un intercepteur pour l'appel à la redirect_uri du fournisseur de service
    Et que je me connecte à FranceConnect jusqu'au consentement
    Et que je prépare une requête "token pour un FS avec signature RS256"
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
    Et l'entête du JWS a une propriété "alg" égale à "RS256"
    Et l'entête du JWS a une propriété "kid" égale à "pkcs11:RS256:hsm"
    Et l'entête du JWS a 2 propriétés
    Et le JWT userinfo est signé avec la clé "RS256" de FranceConnect
    Et le payload du JWT a une propriété "sub"
    Et le payload du JWT a une propriété "given_name"
    Et le payload du JWT a une propriété "given_name_array"
    Et le payload du JWT a une propriété "family_name"
    Et le payload du JWT a une propriété "birthdate"
    Et le payload du JWT a une propriété "idp_birthdate"
    Et le payload du JWT a une propriété "gender"
    Et le payload du JWT a une propriété "preferred_username"
    Et le payload du JWT a une propriété "birthcountry"
    Et le payload du JWT a une propriété "birthplace"
    Et le payload du JWT a une propriété "email"
    Et le payload du JWT a une propriété "aud"
    Et le payload du JWT a une propriété "exp"
    Et le payload du JWT a une propriété "iat"
    Et le payload du JWT a une propriété "iss" égale à "https://core-fcp-low.docker.dev-franceconnect.fr/api/v2"
    Et le payload du JWT a 15 propriétés

  @fcpLow @fcpHigh @exceptions
  Scénario: API userinfo - erreur token expiré ou non trouvé
    Etant donné que je prépare une requête "userinfo"
    Quand je lance la requête
    Alors le statut de la réponse est 401
    Et l'entête de la réponse a une propriété "content-type" contenant "application/json"
    Et l'entête de la réponse n'a pas de propriété "set-cookie"
    Et le corps de la réponse contient une erreur
    Et le corps de la réponse a une propriété "error" égale à "invalid_token"
    Et le corps de la réponse a une propriété "error_description" égale à "invalid token provided (access token not found)"
    Et le corps de la réponse a une propriété "error_uri" contenant "https://docs.partenaires.franceconnect.gouv.fr/fs/fs-technique/fs-technique-erreurs/?code=Y040001&id="

  @fcpLow @fcpHigh @exceptions
  Scénario: API userinfo - erreur access_token manquant
    Etant donné que je prépare une requête "userinfo"
    Et que je retire "authorization" de l'entête de la requête
    Quand je lance la requête
    Alors le statut de la réponse est 401
    Et l'entête de la réponse a une propriété "content-type" contenant "application/json"
    Et l'entête de la réponse n'a pas de propriété "set-cookie"
    Et le corps de la réponse contient une erreur
    Et le corps de la réponse a une propriété "error" égale à "invalid_token"
    Et le corps de la réponse a une propriété "error_description" égale à "no access token provided (no access token provided)"
    Et le corps de la réponse a une propriété "error_uri" contenant "https://docs.partenaires.franceconnect.gouv.fr/fs/fs-technique/fs-technique-erreurs/?code=Y04146A2&id="
