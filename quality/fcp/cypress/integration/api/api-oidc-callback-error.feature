#language: fr
@usager @apiOidcCallbackError @ignoreInteg01 @ci
Fonctionnalité: API - oidc-callback erreur

  Scénario: API oidc-callback-error - cas passant
    Etant donné que je navigue sur la page fournisseur de service
    Et que je clique sur le bouton FranceConnect
    Et que je suis redirigé vers la page sélection du fournisseur d'identité
    Et que je paramètre un intercepteur pour l'appel authorize au fournisseur d'identité
    Et que je clique sur le fournisseur d'identité
    Et que je suis redirigé vers la page login du fournisseur d'identité
    Et que je prépare une requête "oidc-callback-error"
    Et que je mets le state fourni par FC dans le paramètre "state" de la requête
    Quand je lance la requête
    Alors le statut de la réponse est 200
    Et l'entête de la réponse a une propriété "content-type" contenant "text/html"
    Et le corps de la réponse contient une page web
    Et je suis redirigé vers la page sélection du fournisseur d'identité
    Et le message d'erreur est présent sur la mire

  Scénario: API oidc-callback-error - paramètre error_description optionnel
    Etant donné que je navigue sur la page fournisseur de service
    Et que je clique sur le bouton FranceConnect
    Et que je suis redirigé vers la page sélection du fournisseur d'identité
    Et que je paramètre un intercepteur pour l'appel authorize au fournisseur d'identité
    Et que je clique sur le fournisseur d'identité
    Et que je suis redirigé vers la page login du fournisseur d'identité
    Et que je prépare une requête "oidc-callback-error"
    Et que je retire le paramètre "error_description" de la requête
    Et que je mets le state fourni par FC dans le paramètre "state" de la requête
    Quand je lance la requête
    Alors le statut de la réponse est 200
    Et l'entête de la réponse a une propriété "content-type" contenant "text/html"
    Et le corps de la réponse contient une page web
    Et je suis redirigé vers la page sélection du fournisseur d'identité
    Et le message d'erreur est présent sur la mire

  Scénario: API oidc-callback-error - paramètre state manquant
    Etant donné que je navigue sur la page fournisseur de service
    Et que je clique sur le bouton FranceConnect
    Et que je suis redirigé vers la page sélection du fournisseur d'identité
    Et que je clique sur le fournisseur d'identité
    Et que je suis redirigé vers la page login du fournisseur d'identité
    Et que je prépare une requête "oidc-callback-error"
    Et que je retire le paramètre "state" de la requête
    Quand je lance la requête
    Alors le statut de la réponse est 400
    Et l'entête de la réponse a une propriété "content-type" contenant "text/html"
    Et le corps de la réponse contient une page web
    Et je suis redirigé vers la page erreur technique FranceConnect
    Et le code d'erreur FranceConnect est "Y020021"

  Scénario: API oidc-callback-error - paramètre state erroné
    Etant donné que je navigue sur la page fournisseur de service
    Et que je clique sur le bouton FranceConnect
    Et que je suis redirigé vers la page sélection du fournisseur d'identité
    Et que je clique sur le fournisseur d'identité
    Et que je suis redirigé vers la page login du fournisseur d'identité
    Et que je prépare une requête "oidc-callback-error"
    Quand je lance la requête
    Alors le statut de la réponse est 403
    Et l'entête de la réponse a une propriété "content-type" contenant "text/html"
    Et le corps de la réponse contient une page web
    Et je suis redirigé vers la page erreur technique FranceConnect
    Et le code d'erreur FranceConnect est "Y020022"