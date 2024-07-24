#language: fr
@api @apiRedirectToIdp
Fonctionnalité: API - redirect to idp

  Scénario: API redirect-to-idp - Not valid CSRF token
    Etant donné que je navigue sur la page fournisseur de service
    Et que je clique sur le bouton AgentConnect
    Et que je suis redirigé vers la page interaction
    Et que je prépare une requête "redirect-to-idp"
    Quand je lance la requête
    Alors l'entête de la réponse a une propriété "content-type" contenant "text/html"
    Et le corps de la réponse contient une page web
    Et je suis redirigé vers la page erreur technique
    Et le code d'erreur est "Y470001"
