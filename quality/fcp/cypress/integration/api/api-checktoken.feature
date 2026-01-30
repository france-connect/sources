#language: fr
@api @apiChecktoken @ignoreInteg01 @ci
Fonctionnalité: API - checktoken

  @fcpLow
  Scénario: API checktoken - FCP Low - token d'introspection avec chiffrement RSA-OAEP-256 et signature ES256
    Etant donné que je prépare une requête "checktoken"
    Quand je lance la requête
    Alors le statut de la réponse est 200
    Et l'entête de la réponse a une propriété "content-type" égale à "application/token-introspection+jwt"
    Et l'entête de la réponse n'a pas de propriété "set-cookie"
    Et le corps de la réponse contient un JWT d'introspection avec chiffrement "RSA-OAEP-256"
    Et l'entête du JWE a une propriété "alg" égale à "RSA-OAEP-256"
    Et l'entête du JWE a une propriété "enc" égale à "A256GCM"
    Et l'entête du JWE a 2 propriétés
    Et l'entête du JWS a une propriété "alg" égale à "ES256"
    Et l'entête du JWS a une propriété "kid" égale à "pkcs11:ES256:hsm"
    Et l'entête du JWS a 2 propriétés
    Et le JWT d'introspection est signé avec la clé "ES256" de FranceConnect
    Et le payload du JWT a une propriété "token_introspection"
    Et le payload du JWT a une propriété "aud"
    Et le payload du JWT a une propriété "iat"
    Et le payload du JWT a une propriété "iss" égale à "https://core-fcp-low.docker.dev-franceconnect.fr/api/v2"
    Et le payload du JWT a 4 propriétés

  @fcpLow
  Scénario: API checktoken - FCP Low - token d'introspection avec chiffrement ECDH-ES et signature RS256
    Etant donné que je prépare une requête "checktoken pour un FD avec signature RS256"
    Quand je lance la requête
    Alors le statut de la réponse est 200
    Et l'entête de la réponse a une propriété "content-type" égale à "application/token-introspection+jwt"
    Et l'entête de la réponse n'a pas de propriété "set-cookie"
    Et le corps de la réponse contient un JWT d'introspection avec chiffrement "ECDH-ES"
    Et l'entête du JWE a une propriété "alg" égale à "ECDH-ES"
    Et l'entête du JWE a une propriété "enc" égale à "A256GCM"
    Et l'entête du JWE a une propriété "epk"
    Et l'entête du JWE a 3 propriétés
    Et l'entête du JWS a une propriété "alg" égale à "RS256"
    Et l'entête du JWS a une propriété "kid" égale à "pkcs11:RS256:hsm"
    Et l'entête du JWS a 2 propriétés
    Et le JWT d'introspection est signé avec la clé "RS256" de FranceConnect
    Et le payload du JWT a une propriété "token_introspection"
    Et le payload du JWT a une propriété "aud"
    Et le payload du JWT a une propriété "iat"
    Et le payload du JWT a une propriété "iss" égale à "https://core-fcp-low.docker.dev-franceconnect.fr/api/v2"
    Et le payload du JWT a 4 propriétés

  # Scénario ignoré car la signature des tokens d'introspection ne fonctionne plus sur FC+ depuis release-376RC1
  @fcpHigh @ignoreHigh
  Scénario: API checktoken - FCP High - token d'introspection avec chiffrement RSA-OAEP-256 et signature ES256
    Etant donné que je prépare une requête "checktoken"
    Quand je lance la requête
    Alors le statut de la réponse est 200
    Et l'entête de la réponse a une propriété "content-type" égale à "application/token-introspection+jwt"
    Et l'entête de la réponse n'a pas de propriété "set-cookie"
    Et le corps de la réponse contient un JWT d'introspection avec chiffrement "ECDH-ES"
    Et l'entête du JWE a une propriété "alg" égale à "RSA-OAEP-256"
    Et l'entête du JWE a une propriété "enc" égale à "A256GCM"
    Et l'entête du JWE a 2 propriétés
    Et l'entête du JWS a une propriété "alg" égale à "ES256"
    Et l'entête du JWS a une propriété "kid" égale à "pkcs11:hsm"
    Et l'entête du JWS a 2 propriétés
    Et le JWT d'introspection est signé avec la clé "ES256" de FranceConnect
    Et le payload du JWT a une propriété "token_introspection"
    Et le payload du JWT a une propriété "aud"
    Et le payload du JWT a une propriété "iat"
    Et le payload du JWT a une propriété "iss" égale à "https://core-fcp-high.docker.dev-franceconnect.fr/api/v2"
    Et le payload du JWT a 4 propriétés

  # Scénario ignoré car la signature des tokens d'introspection ne fonctionne plus sur FC+ depuis release-376RC1
  @fcpHigh @ignoreHigh
  Scénario: API checktoken - FCP High - token d'introspection avec chiffrement ECDH-ES et signature ES256
    Etant donné que je prépare une requête "checktoken pour un FD avec chiffrement ECDH-ES"
    Quand je lance la requête
    Alors le statut de la réponse est 200
    Et l'entête de la réponse a une propriété "content-type" égale à "application/token-introspection+jwt"
    Et l'entête de la réponse n'a pas de propriété "set-cookie"
    Et le corps de la réponse contient un JWT d'introspection avec chiffrement "ECDH-ES"
    Et l'entête du JWE a une propriété "alg" égale à "ECDH-ES"
    Et l'entête du JWE a une propriété "enc" égale à "A256GCM"
    Et l'entête du JWE a une propriété "epk"
    Et l'entête du JWE a 3 propriétés
    Et l'entête du JWS a une propriété "alg" égale à "ES256"
    Et l'entête du JWS a une propriété "kid" égale à "pkcs11:hsm"
    Et l'entête du JWS a 2 propriétés
    Et le JWT d'introspection est signé avec la clé "ES256" de FranceConnect
    Et le payload du JWT a une propriété "token_introspection"
    Et le payload du JWT a une propriété "aud"
    Et le payload du JWT a une propriété "iat"
    Et le payload du JWT a une propriété "iss" égale à "https://core-fcp-high.docker.dev-franceconnect.fr/api/v2"
    Et le payload du JWT a 4 propriétés

  @fcpLow @fcpHigh @exceptions
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

  @fcpLow @fcpHigh @exceptions
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

  @fcpLow @fcpHigh @exceptions
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

  @fcpLow @fcpHigh @exceptions
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

  @fcpLow @fcpHigh @exceptions
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
