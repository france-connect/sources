#language: fr
@api @apiAuthorize @fcpLow @fcpHigh @ignoreInteg01 @ci
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

  Scénario: API authorize - Cas nominal URL avec domaine différent présent dans sector_identifier
    Etant donné que je prépare une requête "authorize"
    Et que je mets "https://franceconnect.gouv.fr/" dans le paramètre "redirect_uri" de la requête
    Quand je lance la requête
    Alors le statut de la réponse est 200
    Et l'entête de la réponse a une propriété "content-type" contenant "text/html"
    Et le corps de la réponse contient une page web
    Et je suis redirigé vers la page sélection du fournisseur d'identité

  Scénario: API authorize - sector_identifier URI ne répond pas
    Etant donné que je prépare une requête "authorize avec un mauvais sector_identifier_uri"
    Quand je lance la requête
    Alors le statut de la réponse est 400
    Et l'entête de la réponse a une propriété "content-type" contenant "text/html"
    Et le corps de la réponse contient une page web
    Et je suis redirigé vers la page erreur technique FranceConnect
    Et le code d'erreur FranceConnect est "Y04A3BD"
    Et le message d'erreur FranceConnect est "Une erreur de communication avec le fournisseur de service est survenue : Impossible de contacter le \"sector_identifier_uri\"."


  Plan du Scénario: API authorize - erreur Y030007 <param> manquant
    Etant donné que je prépare une requête "authorize"
    Et je retire le paramètre "<param>" de la requête
    Quand je lance la requête
    Alors le statut de la réponse est 400
    Et l'entête de la réponse a une propriété "content-type" contenant "text/html"
    Et le corps de la réponse contient une page web
    Et je suis redirigé vers la page erreur technique FranceConnect
    Et le code d'erreur FranceConnect est "Y030007"

    @exceptions
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

    @exceptions
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
    Et l'url fragment de callback du FS a un paramètre "error" égal à "<error>"
    Et l'url fragment de callback du FS a un paramètre "error_description" égal à "<errorDescription>"

    @exceptions
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

  Plan du Scénario: API authorize - erreur Y04EA6E client_id=<clientId>
    Etant donné que je prépare une requête "authorize"
    Et je mets "<clientId>" dans le paramètre "client_id" de la requête
    Quand je lance la requête
    Alors le statut de la réponse est 400
    Et l'entête de la réponse a une propriété "content-type" contenant "text/html"
    Et le corps de la réponse contient une page web
    Et je suis redirigé vers la page erreur technique FranceConnect
    Et le code d'erreur FranceConnect est "Y04EA6E"
    Et le message d'erreur FranceConnect est "Une erreur de communication avec le fournisseur de service est survenue. Veuillez réessayer ultérieurement."
    Et le lien retour vers le FS n'est pas affiché dans la page erreur technique

    @exceptions
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

    @exceptions
    Exemples:
      | redirectUri                          | httpCode | error   | errorDescription                                                                                            |
      |                                      | 400      | Y030007 | Une erreur technique est survenue, fermez l’onglet de votre navigateur et reconnectez-vous.                 |
      | https://my-malicious-url.fr/callback | 400      | Y04C013 | Une erreur de communication avec le fournisseur de service est survenue. Veuillez réessayer ultérieurement. |
      | example.com                          | 400      | Y030007 | Une erreur technique est survenue, fermez l’onglet de votre navigateur et reconnectez-vous.                 |


  @exceptions
  Scénario: API authorize - erreur de paramètres : erreur scope et erreur redirect_uri
    Etant donné que je prépare une requête "authorize"
    Et je mets "email" dans le paramètre "scope" de la requête
    Et j'ajoute "/wrong-url" dans le paramètre "redirect_uri" de la requête
    Quand je lance la requête
    Alors le statut de la réponse est 400
    Et l'entête de la réponse a une propriété "content-type" contenant "text/html"
    Et le corps de la réponse contient une page web
    Et je suis redirigé vers la page erreur technique FranceConnect
    Et le code d'erreur FranceConnect est "Y040001"
    Et le message d'erreur FranceConnect est "Une erreur s'est produite, veuillez réessayer ultérieurement"
    Et le lien retour vers le FS n'est pas affiché dans la page erreur technique

  Scénario: API authorize - Paramètre ui_locales autorisé mais non utilisé
    Etant donné que je prépare une requête "authorize"
    Et que je mets "fr-FR" dans le paramètre "ui_locales" de la requête
    Quand je lance la requête
    Alors le statut de la réponse est 200
    Et l'entête de la réponse a une propriété "content-type" contenant "text/html"
    Et le corps de la réponse contient une page web
    Et je suis redirigé vers la page sélection du fournisseur d'identité
