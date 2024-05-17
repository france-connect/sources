#language: fr
@api @apiAuthorize
Fonctionnalité: API - authorize

  @ignoreInteg01
  Scénario: API authorize - Erreur sur la stack locale Y000400 invalid redirect_uri localhost
    Etant donné que je prépare une requête "authorize"
    Et je mets "http://localhost/callback" dans le paramètre "redirect_uri" de la requête
    Quand je lance la requête
    Alors le statut de la réponse est 400
    Et l'entête de la réponse a une propriété "content-type" contenant "text/html"
    Et le corps de la réponse contient une page web
    Et je suis redirigé vers la page erreur technique
    Et le code d'erreur est "Y000400"

  @ignoreDocker
  Scénario: API authorize - localhost autorisé en integ
    Etant donné que je prépare une requête "authorize"
    Et je mets "http://localhost:3000/login-callback" dans le paramètre "redirect_uri" de la requête
    Quand je lance la requête
    Alors le statut de la réponse est 200
    Et l'entête de la réponse a une propriété "content-type" contenant "text/html"
    Et le corps de la réponse contient une page web
    Et je suis redirigé vers la page interaction

  Plan du Scénario: API authorize - erreur <error> redirect_uri=<redirectUri>
    Etant donné que je prépare une requête "authorize"
    Et je mets "<redirectUri>" dans le paramètre "redirect_uri" de la requête
    Et je configure la requête pour ne pas suivre les redirections
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
