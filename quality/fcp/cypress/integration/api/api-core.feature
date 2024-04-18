#language: fr
@api @apiCore @ignoreInteg01
Fonctionnalité: API - core

  Scénario: API core - redirection vers le site usager
    Etant donné que je prépare une requête "/api/v2"
    Et que je configure la requête pour ne pas suivre les redirections
    Quand je lance la requête
    Alors le statut de la réponse est 301
    Et l'entête de la réponse a une propriété "content-type" contenant "text/plain"
    Et l'entête de la réponse a une propriété "location" égale à "https://franceconnect.gouv.fr"

  Scénario: API core - Page inconue dans le dossier /api/v2
    Etant donné que je prépare une requête "/api/v2/wrong-url"
    Et que je configure la requête pour ne pas suivre les redirections
    Quand je lance la requête
    Alors le statut de la réponse est 500
    Et l'entête de la réponse a une propriété "content-type" contenant "text/html"
    Et le corps de la réponse contient une page web
    Et le code d'erreur FranceConnect est "Y030111"

  Scénario: API core - Page inconue dans le dossier /
    Etant donné que je prépare une requête "/wrong-url"
    Et que je configure la requête pour ne pas suivre les redirections
    Quand je lance la requête
    Alors le statut de la réponse est 404
    Et l'entête de la réponse a une propriété "content-type" contenant "text/html"
    Et le corps de la réponse contient une page web
    Et le code d'erreur FranceConnect est "Y000404"
