#language: fr
@api @apiAuthorize
Fonctionnalité: API - authorize
  Plan du Scénario: API authorize - erreur Y030106 client_id=<clientId>
    Etant donné que je prépare une requête "authorize"
    Et que je mets "<clientId>" dans le paramètre "client_id" de la requête
    Quand je lance la requête
    Alors le statut de la réponse est 500
    Et l'entête de la réponse a une propriété "content-type" contenant "text/html"
    Et le corps de la réponse contient une page web
    Et je suis redirigé vers la page erreur technique
    Et le code d'erreur est "Y030106"
    Et le message d'erreur est "client is invalid (client not found)"
    Et le lien retour vers le FS n'est pas affiché dans la page erreur technique

    Exemples:
      | clientId                        |
      | inconnu                         |
      | my-service-provider-deactivated |

  @ignoreInteg01
  Scénario: API authorize - Erreur sur la stack locale Y000400 invalid redirect_uri localhost
    Etant donné que je prépare une requête "authorize"
    Et que je mets "http://localhost/login-callback" dans le paramètre "redirect_uri" de la requête
    Quand je lance la requête
    Alors le statut de la réponse est 400
    Et l'entête de la réponse a une propriété "content-type" contenant "text/html"
    Et le corps de la réponse contient une page web
    Et je suis redirigé vers la page erreur technique
    Et le code d'erreur est "Y000400"

  @ignoreDocker
  Scénario: API authorize - localhost autorisé en integ
    Etant donné que je prépare une requête "authorize"
    Et que je mets "214f336f-fa6d-463a-818b-c80a3e74cd1c" dans le paramètre "client_id" de la requête
    Et que je mets "http://localhost:3000/login-callback" dans le paramètre "redirect_uri" de la requête
    Quand je lance la requête
    Alors le statut de la réponse est 200
    Et l'entête de la réponse a une propriété "content-type" contenant "text/html"
    Et le corps de la réponse contient une page web
    Et je suis redirigé vers la page interaction

  Plan du Scénario: API authorize - erreur <error> redirect_uri=<redirectUri>
    Etant donné que je prépare une requête "authorize"
    Et que je mets "<redirectUri>" dans le paramètre "redirect_uri" de la requête
    Et que je configure la requête pour ne pas suivre les redirections
    Quand je lance la requête
    Alors le statut de la réponse est <httpCode>
    Et l'entête de la réponse a une propriété "content-type" contenant "text/html"
    Et le corps de la réponse contient une page web
    Et je suis redirigé vers la page erreur technique
    Et le code d'erreur est "<error>"

    Exemples:
      | redirectUri                          | httpCode | error   |
      |                                      | 400      | Y000400 |
      | https://my-malicious-url.fr/callback | 500      | Y030118 |
      | example.com                          | 400      | Y000400 |

  Plan du Scénario: API authorize - Cas nominal prompt=<prompt>
    Etant donné que je prépare une requête "authorize"
    Et que je mets "<prompt>" dans le paramètre "prompt" de la requête
    Quand je lance la requête
    Alors le statut de la réponse est 200
    Et l'entête de la réponse a une propriété "content-type" contenant "text/html"
    Et le corps de la réponse contient une page web
    Et je suis redirigé vers la page interaction

    Exemples:
      | prompt        |
      | login         |
      | consent       |
      | login consent |
      | consent login |

  Scénario: API authorize - Prompt non authorisé
    Etant donné que je prépare une requête "authorize"
    Et que je mets "select_account" dans le paramètre "prompt" de la requête
    Quand je lance la requête
    Alors le statut de la réponse est 400

  Scénario: API authorize - prompt n'est pas défini
    Etant donné que je prépare une requête "authorize"
    Et que je retire le paramètre "prompt" de la requête
    Quand je lance la requête
    Alors le statut de la réponse est 200
    Et l'entête de la réponse a une propriété "content-type" contenant "text/html"
    Et le corps de la réponse contient une page web
    Et je suis redirigé vers la page interaction

  Plan du Scénario: API authorize - erreur prompt=none sans session
    Etant donné que je prépare une requête "authorize"
    Et que je mets "<prompt>" dans le paramètre "prompt" de la requête
    Et que je configure la requête pour ne pas suivre les redirections
    Quand je lance la requête
    Alors le statut de la réponse est 303
    Et l'entête de la réponse a une propriété "content-type" contenant "text/html"
    Et l'entête de la réponse a une propriété "location" contenant l'url de callback du FS avec une erreur
    Et l'url de callback du FS a un paramètre "error" égal à "<error>"
    Et l'url de callback du FS a un paramètre "error_description" égal à "<errorDescription>"

    Exemples:
      | prompt       | error           | errorDescription                    |
      | none         | login_required  | End-User authentication is required |
      | none login   | invalid_request | prompt none must only be used alone |
      | none consent | invalid_request | prompt none must only be used alone |

  Scénario: API authorize - Cas nominal sans nonce
    Etant donné que je prépare une requête "authorize"
    Et je retire le paramètre "nonce" de la requête
    Quand je lance la requête
    Alors le statut de la réponse est 200
    Et l'entête de la réponse a une propriété "content-type" contenant "text/html"
    Et le corps de la réponse contient une page web
    Et je suis redirigé vers la page interaction

  @ignoreInteg01
  Scénario: API authorize - Cas nominal sans login_hint
    Etant donné que je prépare une requête "authorize"
    Et que je retire le paramètre "login_hint" de la requête
    Quand je lance la requête
    Alors le statut de la réponse est 200
    Et l'entête de la réponse a une propriété "content-type" contenant "text/html"
    Et le corps de la réponse contient une page web
    Et je suis redirigé vers la page interaction

  Plan du Scénario: API authorize - Erreur <error> avec response_type=<responseType>
    Etant donné que je prépare une requête "authorize"
    Et que je mets "<responseType>" dans le paramètre "response_type" de la requête
    Et que je configure la requête pour ne pas suivre les redirections
    Quand je lance la requête
    Alors le statut de la réponse est 303
    Et l'entête de la réponse a une propriété "content-type" contenant "text/html"
    Et l'entête de la réponse a une propriété "location" contenant l'url de callback du FS avec l'erreur
    Et l'url de callback du FS a un paramètre "error" égal à "<error>"
    Et l'url de callback du FS a un paramètre "error_description" égal à "<errorDescription>"

    Exemples:
      | responseType | error                     | errorDescription                    |
      |              | invalid_request           | missing required parameter          |
      | inconnu      | unsupported_response_type | unsupported response_type requested |

  # D'après la spécification si response_type contient token ou id_token,
  # le FI doit renvoyer un fragment dans le cas passant ou lors d'une erreur
  # https://openid.net/specs/oauth-v2-multiple-response-types-1_0-09.html#rfc.section.5
  Plan du Scénario: API authorize - Erreur unsupported_response_type avec response_type=<responseType> avec redirection contenant un fragment
    Etant donné que je prépare une requête "authorize"
    Et que je mets "<responseType>" dans le paramètre "response_type" de la requête
    Et que je configure la requête pour ne pas suivre les redirections
    Quand je lance la requête
    Alors le statut de la réponse est 303
    Et l'entête de la réponse a une propriété "content-type" contenant "text/html"
    Et l'entête de la réponse a une propriété "location" contenant l'url de callback du FS avec l'erreur (fragment)
    Et l'url de callback du FS a un paramètre "error" égal à "unsupported_response_type"
    Et l'url de callback du FS a un paramètre "error_description" égal à "unsupported response_type requested"

    Exemples:
      | responseType   |
      | id_token       |
      | id_token token |
      | code id_token  |
      | code token     |
      | code token     |

  Plan du Scénario: API authorize - erreur <error> redirect_uri=<redirectUri>
    Etant donné que je prépare une requête "authorize"
    Et que je mets "<redirectUri>" dans le paramètre "redirect_uri" de la requête
    Et que je configure la requête pour ne pas suivre les redirections
    Quand je lance la requête
    Alors le statut de la réponse est <httpCode>
    Et l'entête de la réponse a une propriété "content-type" contenant "text/html"
    Et le corps de la réponse contient une page web
    Et je suis redirigé vers la page erreur technique
    Et le code d'erreur est "<error>"
    Et le message d'erreur est "<errorDescription>"
    Et le lien retour vers le FS n'est pas affiché dans la page erreur technique

    Exemples:
      | redirectUri                          | httpCode | error   | errorDescription                                                                    |
      |                                      | 400      | Y000400 | Bad Request Exception                                                               |
      | https://my-malicious-url.fr/callback | 500      | Y030118 | redirect_uri did not match any of the client's registered redirect_uris (undefined) |
