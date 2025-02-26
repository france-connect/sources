#language: fr
@usager @apiRedirectToSp @ci @ignoreInteg01
Fonctionnalité: API - redirect-to-sp

  Plan du Scénario: API redirect-to-sp - Redirect with error
    Etant donné que je prépare une requête "redirect-to-sp-with-error"
    Et je mets "<responseType>" dans le paramètre "response_type" de la requête
    Et je configure la requête pour ne pas suivre les redirections
    Quand je lance la requête
    Alors le statut de la réponse est 302
    Et l'entête de la réponse a une propriété "content-type" contenant "text/plain"
    Et l'entête de la réponse a une propriété "location" contenant l'url de callback du FS avec l'erreur
    Et l'url de callback du FS a les paramètres "error,error_description,state,iss"
    Et l'url de callback du FS a un paramètre "error" égal à "access_denied"
    Et l'url de callback du FS a un paramètre "error_description" égal à "user+authentication+aborted"
    Et l'url de callback du FS a un paramètre "state" égal à "37098dd31af91b8d4e2684f7dfcd7f3a0b68f3615db783cada58463cdbb93449"
    Et l'url de callback du FS a un paramètre "iss" égal à "<issuer>"

    @fcpLow
    Exemples:
      | issuer                                                  |
      | https://core-fcp-low.docker.dev-franceconnect.fr/api/v2 |
    @fcpHigh
    Exemples:
      | issuer                                                   |
      | https://core-fcp-high.docker.dev-franceconnect.fr/api/v2 |

  Plan du Scénario: API redirect-to-sp - Redirect with error sans state
    Etant donné que je prépare une requête "redirect-to-sp-with-error"
    Et je mets "<responseType>" dans le paramètre "response_type" de la requête
    Et je retire le paramètre "state" de la requête
    Et je configure la requête pour ne pas suivre les redirections
    Quand je lance la requête
    Alors le statut de la réponse est 302
    Et l'entête de la réponse a une propriété "content-type" contenant "text/plain"
    Et l'entête de la réponse a une propriété "location" contenant l'url de callback du FS avec l'erreur
    Et l'url de callback du FS a les paramètres "error,error_description,state,iss"
    Et l'url de callback du FS a un paramètre "error" égal à "access_denied"
    Et l'url de callback du FS a un paramètre "error_description" égal à "user+authentication+aborted"
    Et l'url de callback du FS a un paramètre "state" égal à "undefined"
    Et l'url de callback du FS a un paramètre "iss" égal à "<issuer>"

    @fcpLow
    Exemples:
      | issuer                                                  |
      | https://core-fcp-low.docker.dev-franceconnect.fr/api/v2 |
    @fcpHigh
    Exemples:
      | issuer                                                   |
      | https://core-fcp-high.docker.dev-franceconnect.fr/api/v2 |

  @fcpLow @fcpHigh
  Scénario: API redirect-to-sp - Redirect with error sans redirect_uri
    Etant donné que je prépare une requête "redirect-to-sp-with-error"
    Et je mets "<responseType>" dans le paramètre "response_type" de la requête
    Et je retire le paramètre "redirect_uri" de la requête
    Quand je lance la requête
    Alors le statut de la réponse est 500
    Et l'entête de la réponse a une propriété "content-type" contenant "text/html"
    Et le corps de la réponse contient une page web
    Et je suis redirigé vers la page erreur technique FranceConnect
    Et le code d'erreur FranceConnect est "Y030030"
    Et le lien retour vers le FS n'est pas affiché dans la page erreur technique

  @fcpLow @fcpHigh
  Scénario: API redirect-to-sp - Redirect with error avec redirect_uri invalide
    Etant donné que je prépare une requête "redirect-to-sp-with-error"
    Et je mets "<responseType>" dans le paramètre "response_type" de la requête
    Et je mets "https://me-redirect-uri.fr/non-valid" dans le paramètre "redirect_uri" de la requête
    Quand je lance la requête
    Alors le statut de la réponse est 500
    Et l'entête de la réponse a une propriété "content-type" contenant "text/html"
    Et le corps de la réponse contient une page web
    Et je suis redirigé vers la page erreur technique FranceConnect
    Et le code d'erreur FranceConnect est "Y030030"
    Et le lien retour vers le FS n'est pas affiché dans la page erreur technique
