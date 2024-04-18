#language: fr
@api @apiAuthorize @ignoreInteg01
Fonctionnalité: API - authorize

  Scénario: API authorize - Erreur Y000400 invalid redirect_uri localhost
    Etant donné que je prépare une requête "authorize"
    Et je mets "http://localhost/callback" dans le paramètre "redirect_uri" de la requête
    Quand je lance la requête
    Alors le statut de la réponse est 400
    Et l'entête de la réponse a une propriété "content-type" contenant "text/html"
    Et le corps de la réponse contient une page web
    Et je suis redirigé vers la page erreur technique
    Et le code d'erreur est "Y000400"
