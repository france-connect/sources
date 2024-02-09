#language: fr
@api @apiDiscovery @ignoreInteg01
Fonctionnalité: API - discovery

  @fcpLow
  Scénario: API discovery - fcp-low
    Etant donné que je prépare une requête "discovery"
    Quand je lance la requête
    Alors le statut de la réponse est 200
    Et l'entête de la réponse a une propriété "content-type" contenant "application/json"
    Et l'entête de la réponse n'a pas une propriété "set-cookie"
    Et le corps de la réponse contient une configuration openid "sans chiffrement"
    Et "acr_values_supported" contient uniquement "eidas1" dans la configuration openid
    Et "scopes_supported" contient "openid profile preferred_username idp_birthdate" dans la configuration openid
    Et "scopes_supported" ne contient pas "offline_access" dans la configuration openid
    Et "claims_supported" contient "sub given_name given_name_array amr acr" dans la configuration openid
    Et "id_token_signing_alg_values_supported" contient uniquement "HS256 ES256 RS256" dans la configuration openid
    Et "id_token_encryption_alg_values_supported" n'est pas présent dans la configuration openid
    Et "id_token_encryption_enc_values_supported" n'est pas présent dans la configuration openid
    Et "userinfo_signing_alg_values_supported" contient uniquement "HS256 ES256 RS256" dans la configuration openid
    Et "userinfo_encryption_alg_values_supported" n'est pas présent dans la configuration openid
    Et "userinfo_encryption_enc_values_supported" n'est pas présent dans la configuration openid
    Et "backchannel_logout_supported" n'est pas présent dans la configuration openid
    Et "backchannel_logout_session_supported" n'est pas présent dans la configuration openid

  @fcpHigh
  Scénario: API discovery - fcp-high
    Etant donné que je prépare une requête "discovery"
    Quand je lance la requête
    Alors le statut de la réponse est 200
    Et l'entête de la réponse a une propriété "content-type" contenant "application/json"
    Et l'entête de la réponse n'a pas une propriété "set-cookie"
    Et le corps de la réponse contient une configuration openid "avec chiffrement"
    Et "acr_values_supported" contient uniquement "eidas2 eidas3" dans la configuration openid
    Et "acr_values_supported" ne contient pas "eidas1" dans la configuration openid
    Et "scopes_supported" contient "openid profile preferred_username rnipp_birth" dans la configuration openid
    Et "scopes_supported" ne contient pas "offline_access" dans la configuration openid
    Et "claims_supported" contient "sub given_name rnipp_given_name_array amr acr" dans la configuration openid
    Et "id_token_signing_alg_values_supported" contient uniquement "ES256" dans la configuration openid
    Et "id_token_encryption_alg_values_supported" contient uniquement "ECDH-ES RSA-OAEP RSA-OAEP-256" dans la configuration openid
    Et "id_token_encryption_enc_values_supported" contient uniquement "A256GCM" dans la configuration openid
    Et "userinfo_signing_alg_values_supported" contient uniquement "ES256" dans la configuration openid
    Et "userinfo_encryption_alg_values_supported" contient uniquement "ECDH-ES RSA-OAEP RSA-OAEP-256" dans la configuration openid
    Et "userinfo_encryption_enc_values_supported" contient uniquement "A256GCM" dans la configuration openid
    Et "backchannel_logout_supported" n'est pas présent dans la configuration openid
    Et "backchannel_logout_session_supported" n'est pas présent dans la configuration openid
