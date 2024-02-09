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
