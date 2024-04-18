#language: fr
@api @apiAuthorize @ignoreInteg01
Fonctionnalité: API - authorize

  Plan du Scénario: API authorize - Cas nominal prompt=<prompt>
    Etant donné que je prépare une requête "authorize"
    Et je mets "<prompt>" dans le paramètre "prompt" de la requête
    Quand je lance la requête
    Alors le statut de la réponse est 200
    Et l'entête de la réponse a une propriété "content-type" contenant "text/html"
    Et le corps de la réponse contient une page web
    Et je suis redirigé vers la page sélection du fournisseur d'identité

    Exemples:
      | prompt        |
      | login         |
      | consent       |
      | login consent |
      | consent login |

  Scénario: API authorize - Cas nominal sans prompt
    Etant donné que je prépare une requête "authorize"
    Et je retire le paramètre "prompt" de la requête
    Quand je lance la requête
    Alors le statut de la réponse est 200
    Et l'entête de la réponse a une propriété "content-type" contenant "text/html"
    Et le corps de la réponse contient une page web
    Et je suis redirigé vers la page sélection du fournisseur d'identité

  Plan du Scénario: API authorize - erreur Y030007 <param> manquant
    Etant donné que je prépare une requête "authorize"
    Et je retire le paramètre "<param>" de la requête
    Quand je lance la requête
    Alors le statut de la réponse est 400
    Et l'entête de la réponse a une propriété "content-type" contenant "text/html"
    Et le corps de la réponse contient une page web
    Et je suis redirigé vers la page erreur technique FranceConnect
    Et le code d'erreur FranceConnect est "Y030007"

    Exemples:
      | param         |
      | acr_values    |
      | client_id     |
      | nonce         |
      | redirect_uri  |
      | response_type |
      | scope         |
      | state         |

  Plan du Scénario: API authorize - erreur Y030007 prompt=<prompt>
    Etant donné que je prépare une requête "authorize"
    Et je mets "<prompt>" dans le paramètre "prompt" de la requête
    Quand je lance la requête
    Alors le statut de la réponse est 400
    Et l'entête de la réponse a une propriété "content-type" contenant "text/html"
    Et le corps de la réponse contient une page web
    Et je suis redirigé vers la page erreur technique FranceConnect
    Et le code d'erreur FranceConnect est "Y030007"

    Exemples:
      | prompt         |
      |                |
      | none           |
      | select_account |

  Plan du Scénario: API authorize - Cas nominal nonce=<nonce>
    Etant donné que je prépare une requête "authorize"
    Et je mets "<nonce>" dans le paramètre "nonce" de la requête
    Quand je lance la requête
    Alors le statut de la réponse est 200
    Et l'entête de la réponse a une propriété "content-type" contenant "text/html"
    Et le corps de la réponse contient une page web
    Et je suis redirigé vers la page sélection du fournisseur d'identité

    Exemples:
      | nonce                                                               |
      | nonceatleastthirtytwocharacterss                                    |
      | nonceatleastsixtyfourcharacterss@#&nonceatleastsixtyfourcharacterss |

  Plan du Scénario: API authorize - erreur Y030007 nonce=<nonce>
    Etant donné que je prépare une requête "authorize"
    Et je mets "<nonce>" dans le paramètre "nonce" de la requête
    Quand je lance la requête
    Alors le statut de la réponse est 400
    Et l'entête de la réponse a une propriété "content-type" contenant "text/html"
    Et le corps de la réponse contient une page web
    Et je suis redirigé vers la page erreur technique FranceConnect
    Et le code d'erreur FranceConnect est "Y030007"

    Exemples:
      | nonce            |
      |                  |
      | nonce_trop_court |

  Plan du Scénario: API authorize - Erreur <error> avec response_type=<responseType>
    Etant donné que je prépare une requête "authorize"
    Et je mets "<responseType>" dans le paramètre "response_type" de la requête
    Et je configure la requête pour ne pas suivre les redirections
    Quand je lance la requête
    Alors le statut de la réponse est 303
    Et l'entête de la réponse a une propriété "content-type" contenant "text/html"
    Et l'entête de la réponse a une propriété "location" contenant l'url de callback du FS avec l'erreur
    Et l'url de callback du FS a un paramètre "error" égal à "<error>"
    Et l'url de callback du FS a un paramètre "error_description" égal à "<errorDescription>"

    Exemples:
      | responseType | error                     | errorDescription                           |
      |              | invalid_request           | missing required parameter 'response_type' |
      | inconnu      | unsupported_response_type | unsupported response_type requested        |

  # D'après la spécification si response_type contient token ou id_token,
  # le FI doit renvoyer un fragment dans le cas passant ou lors d'une erreur
  # https://openid.net/specs/oauth-v2-multiple-response-types-1_0-09.html#rfc.section.5
  Plan du Scénario: API authorize - Erreur <error> avec response_type=<responseType> avec redirection contenant un fragment
    Etant donné que je prépare une requête "authorize"
    Et je mets "<responseType>" dans le paramètre "response_type" de la requête
    Et je configure la requête pour ne pas suivre les redirections
    Quand je lance la requête
    Alors le statut de la réponse est 303
    Et l'entête de la réponse a une propriété "content-type" contenant "text/html"
    Et l'entête de la réponse a une propriété "location" contenant l'url de callback du FS avec l'erreur (fragment)
    Et l'url de callback du FS a un paramètre "error" égal à "<error>"
    Et l'url de callback du FS a un paramètre "error_description" égal à "<errorDescription>"

    Exemples:
      | responseType   | error                     | errorDescription                    |
      | id_token       | unsupported_response_type | unsupported response_type requested |
      | id_token token | unsupported_response_type | unsupported response_type requested |
      | code id_token  | unsupported_response_type | unsupported response_type requested |
      | code token     | unsupported_response_type | unsupported response_type requested |
      | code token     | unsupported_response_type | unsupported response_type requested |

  Scénario: API authorize - erreur Y030007 client_id=
    Etant donné que je prépare une requête "authorize"
    Et je mets "" dans le paramètre "client_id" de la requête
    Quand je lance la requête
    Alors le statut de la réponse est 400
    Et l'entête de la réponse a une propriété "content-type" contenant "text/html"
    Et le corps de la réponse contient une page web
    Et je suis redirigé vers la page erreur technique FranceConnect
    Et le code d'erreur FranceConnect est "Y030007"
    Et le lien retour vers le FS n'est pas affiché dans la page erreur technique

  Plan du Scénario: API authorize - erreur Y030106 client_id=<clientId>
    Etant donné que je prépare une requête "authorize"
    Et je mets "<clientId>" dans le paramètre "client_id" de la requête
    Quand je lance la requête
    Alors le statut de la réponse est 500
    Et l'entête de la réponse a une propriété "content-type" contenant "text/html"
    Et le corps de la réponse contient une page web
    Et je suis redirigé vers la page erreur technique FranceConnect
    Et le code d'erreur FranceConnect est "Y030106"
    Et le message d'erreur FranceConnect est "invalid_client"
    Et le lien retour vers le FS n'est pas affiché dans la page erreur technique

    Exemples:
      | clientId                        |
      | inconnu                         |
      | my-service-provider-deactivated |

  Plan du Scénario: API authorize - erreur invalid_request scope=<scope>
    Etant donné que je prépare une requête "authorize"
    Et je mets "<scope>" dans le paramètre "scope" de la requête
    Et je configure la requête pour ne pas suivre les redirections
    Quand je lance la requête
    Alors le statut de la réponse est 303
    Et l'entête de la réponse a une propriété "content-type" contenant "text/html"
    Et l'entête de la réponse a une propriété "location" contenant l'url de callback du FS avec l'erreur
    Et l'url de callback du FS a un paramètre "error" égal à "invalid_request"
    Et l'url de callback du FS a un paramètre "error_description" égal à "<errorDescription>"

    Exemples:
      | scope   | errorDescription                                                   |
      |         | openid scope must be requested when using the acr_values parameter |
      | profile | openid scope must be requested when using the acr_values parameter |

  Plan du Scénario: API authorize - erreur <error> redirect_uri=<redirectUri>
    Etant donné que je prépare une requête "authorize"
    Et je mets "<redirectUri>" dans le paramètre "redirect_uri" de la requête
    Et je configure la requête pour ne pas suivre les redirections
    Quand je lance la requête
    Alors le statut de la réponse est <httpCode>
    Et l'entête de la réponse a une propriété "content-type" contenant "text/html"
    Et le corps de la réponse contient une page web
    Et je suis redirigé vers la page erreur technique FranceConnect
    Et le code d'erreur FranceConnect est "<error>"
    Et le message d'erreur FranceConnect est "<errorDescription>"
    Et le lien retour vers le FS n'est pas affiché dans la page erreur technique

    Exemples:
      | redirectUri                          | httpCode | error   | errorDescription                                                                            |
      |                                      | 400      | Y030007 | Une erreur technique est survenue, fermez l’onglet de votre navigateur et reconnectez-vous. |
      | http://localhost/callback            | 400      | Y030007 | Une erreur technique est survenue, fermez l’onglet de votre navigateur et reconnectez-vous. |
      | https://my-malicious-url.fr/callback | 500      | Y030118 | invalid_redirect_uri                                                                        |      
