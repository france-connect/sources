#language: fr
@usager @apiToken @ignoreInteg01 @ci
Fonctionnalité: API - token

Scénario: API token - cas nominal
  Etant donné que je navigue sur la page fournisseur de service
  Et que je paramètre un intercepteur pour l'appel à la redirect_uri du fournisseur de service
  Et que je me connecte au fournisseur d'identité via AgentConnect
  Et que je suis redirigé vers la page fournisseur de service
  Et que je prépare une requête "token"
  Et que je mets le code renvoyé par AC au FS dans la propriété "code" du corps de la requête
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
  Et le corps de la réponse contient le JWT id_token pour le FS
  Et le JWT n'est pas chiffré
  Et l'entête du JWS a une propriété "alg" égale à "HS256"
  Et le payload du JWT a une propriété "sub"
  Et le payload du JWT a une propriété "acr" égale à "eidas1"
  Et le payload du JWT a une propriété "amr"
  Et le payload du JWT a une propriété "nonce"
  Et le payload du JWT a une propriété "iss" égale à "https://core-fca-low.docker.dev-franceconnect.fr/api/v2"

Scénario: API token - id_token sans nonce
  Etant donné que je navigue sur la page fournisseur de service
  Et que je paramètre un intercepteur pour l'appel à la redirect_uri du fournisseur de service
  Et que je paramètre un intercepteur pour retirer le paramètre "nonce" au prochain appel authorize à AgentConnect
  Et que je me connecte au fournisseur d'identité via AgentConnect
  Et que je suis redirigé vers la page fournisseur de service
  Et que je prépare une requête "token"
  Et que je mets le code renvoyé par AC au FS dans la propriété "code" du corps de la requête
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
  Et le corps de la réponse contient le JWT id_token pour le FS
  Et le JWT n'est pas chiffré
  Et l'entête du JWS a une propriété "alg" égale à "HS256"
  Et le payload du JWT n'a pas de propriété "nonce"
  Et le payload du JWT a une propriété "sub"
  Et le payload du JWT a une propriété "acr" égale à "eidas1"
  Et le payload du JWT a une propriété "amr"
  Et le payload du JWT a une propriété "iss" égale à "https://core-fca-low.docker.dev-franceconnect.fr/api/v2"
