#language: fr
@usager @apiOidcCallback @ignoreInteg01
Fonctionnalité: API - oidc-callback
  
  Scénario: API oidc-callback - state manquant
    Etant donné que je navigue sur la page fournisseur de service
    Et que je clique sur le bouton FranceConnect
    Et que je suis redirigé vers la page sélection du fournisseur d'identité
    Et que je clique sur le fournisseur d'identité
    Et que je suis redirigé vers la page login du fournisseur d'identité
    Et que je prépare une requête "oidc-callback"
    Et que je retire le paramètre "state" de la requête
    Quand je lance la requête
    Alors le statut de la réponse est 400
    Et l'entête de la réponse a une propriété "content-type" contenant "text/html"
    Et le corps de la réponse contient une page web
    Et je suis redirigé vers la page erreur technique FranceConnect
    Et le code d'erreur FranceConnect est "Y020021"
  
  Scénario: API oidc-callback - state vide
    Etant donné que je navigue sur la page fournisseur de service
    Et que je clique sur le bouton FranceConnect
    Et que je suis redirigé vers la page sélection du fournisseur d'identité
    Et que je clique sur le fournisseur d'identité
    Et que je suis redirigé vers la page login du fournisseur d'identité
    Et que je prépare une requête "oidc-callback"
    Et que je mets "" dans le paramètre "state" de la requête
    Quand je lance la requête
    Alors le statut de la réponse est 400
    Et l'entête de la réponse a une propriété "content-type" contenant "text/html"
    Et le corps de la réponse contient une page web
    Et je suis redirigé vers la page erreur technique FranceConnect
    Et le code d'erreur FranceConnect est "Y020021"

  Scénario: API oidc-callback - mauvais state
    Etant donné que je navigue sur la page fournisseur de service
    Et que je clique sur le bouton FranceConnect
    Et que je suis redirigé vers la page sélection du fournisseur d'identité
    Et que je clique sur le fournisseur d'identité
    Et que je suis redirigé vers la page login du fournisseur d'identité
    Et que je prépare une requête "oidc-callback"
    Quand je lance la requête
    Alors le statut de la réponse est 403
    Et l'entête de la réponse a une propriété "content-type" contenant "text/html"
    Et le corps de la réponse contient une page web
    Et je suis redirigé vers la page erreur technique FranceConnect
    Et le code d'erreur FranceConnect est "Y020022"

  Scénario: API oidc-callback - code manquant
    Etant donné que je navigue sur la page fournisseur de service
    Et que je clique sur le bouton FranceConnect
    Et que je suis redirigé vers la page sélection du fournisseur d'identité
    Et que je clique sur le fournisseur d'identité
    Et que je suis redirigé vers la page login du fournisseur d'identité
    Et que je prépare une requête "oidc-callback"
    Et que je retire le paramètre "code" de la requête
    Quand je lance la requête
    Alors le statut de la réponse est 400
    Et l'entête de la réponse a une propriété "content-type" contenant "text/html"
    Et le corps de la réponse contient une page web
    Et je suis redirigé vers la page erreur technique FranceConnect
    Et le code d'erreur FranceConnect est "Y020025"

  Scénario: API oidc-callback - code vide
    Etant donné que je navigue sur la page fournisseur de service
    Et que je clique sur le bouton FranceConnect
    Et que je suis redirigé vers la page sélection du fournisseur d'identité
    Et que je clique sur le fournisseur d'identité
    Et que je suis redirigé vers la page login du fournisseur d'identité
    Et que je prépare une requête "oidc-callback"
    Et que je mets "" dans le paramètre "code" de la requête
    Quand je lance la requête
    Alors le statut de la réponse est 400
    Et l'entête de la réponse a une propriété "content-type" contenant "text/html"
    Et le corps de la réponse contient une page web
    Et je suis redirigé vers la page erreur technique FranceConnect
    Et le code d'erreur FranceConnect est "Y020025"

  # On utilise une erreur 502 pour le rôle de gateway de FC
  # lors de la récupération du token auprès du FI
  Scénario: API oidc-callback - bon state mais mauvais code
    Etant donné que je navigue sur la page fournisseur de service
    Et que je clique sur le bouton FranceConnect
    Et que je suis redirigé vers la page sélection du fournisseur d'identité
    Et que je paramètre un intercepteur pour l'appel authorize au fournisseur d'identité
    Et que je clique sur le fournisseur d'identité
    Et que je suis redirigé vers la page login du fournisseur d'identité
    Et que je prépare une requête "oidc-callback"
    Et que je mets le state fourni par FC dans le paramètre "state" de la requête
    Quand je lance la requête
    Alors le statut de la réponse est 502
    Et l'entête de la réponse a une propriété "content-type" contenant "text/html"
    Et le corps de la réponse contient une page web
    Et je suis redirigé vers la page erreur technique FranceConnect
    Et le code d'erreur FranceConnect est "Y020026"
