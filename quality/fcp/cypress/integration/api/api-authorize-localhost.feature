#language: fr
@api @apiAuthorize
Fonctionnalité: API - authorize localhost

  @ignoreInteg01
  Scénario: API authorize - localhost refusé sur la stack locale
    Etant donné que je prépare une requête "authorize"
    Et je mets "http://localhost/login-callback" dans le paramètre "redirect_uri" de la requête
    Et je configure la requête pour ne pas suivre les redirections
    Quand je lance la requête
    Alors le statut de la réponse est 400
    Et l'entête de la réponse a une propriété "content-type" contenant "text/html"
    Et le corps de la réponse contient une page web
    Et je suis redirigé vers la page erreur technique FranceConnect
    Et le code d'erreur FranceConnect est "Y030007"
    Et le message d'erreur FranceConnect est "Une erreur technique est survenue, fermez l’onglet de votre navigateur et reconnectez-vous."
    Et le lien retour vers le FS n'est pas affiché dans la page erreur technique

  @ignoreDocker @fcpHigh
  Scénario: API authorize - localhost refusé en integ pour FC+
    Etant donné que je prépare une requête "authorize"
    Et je mets "http://localhost/login-callback" dans le paramètre "redirect_uri" de la requête
    Et je configure la requête pour ne pas suivre les redirections
    Quand je lance la requête
    Alors le statut de la réponse est 400
    Et l'entête de la réponse a une propriété "content-type" contenant "text/html"
    Et le corps de la réponse contient une page web
    Et je suis redirigé vers la page erreur technique FranceConnect
    Et le code d'erreur FranceConnect est "Y030007"
    Et le message d'erreur FranceConnect est "Une erreur technique est survenue, fermez l’onglet de votre navigateur et reconnectez-vous."
    Et le lien retour vers le FS n'est pas affiché dans la page erreur technique

  @ignoreDocker @fcpLow
  Scénario: API authorize - localhost autorisé en integ pour FC
    Etant donné que je prépare une requête "authorize"
    Et je mets "http://localhost/login-callback" dans le paramètre "redirect_uri" de la requête
    Quand je lance la requête
    Alors le statut de la réponse est 200
    Et l'entête de la réponse a une propriété "content-type" contenant "text/html"
    Et le corps de la réponse contient une page web
    Et je suis redirigé vers la page sélection du fournisseur d'identité