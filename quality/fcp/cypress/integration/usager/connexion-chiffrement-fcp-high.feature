#language: fr
@usager @connexionChiffrement @fcpHigh
Fonctionnalité: Connexion avec chiffrement
  # En tant qu'usager d'un fournisseur de service,
  # je veux me connecter à un FI en utilisant du chiffrement
  # afin d'accéder à mon service

  @ignoreInteg01
  Plan du Scénario: Connexion avec chiffrement - FCP high - FI <acrValues> avec chiffrement "<encoding>" et signature "<signature>"
    Etant donné que le fournisseur de service requiert l'accès aux informations du scope "identite_pivot"
    Et que je navigue sur la page fournisseur de service
    Et que je clique sur le bouton FranceConnect
    Et que je suis redirigé vers la page sélection du fournisseur d'identité
    Et que j'utilise un fournisseur d'identité avec niveau de sécurité "<acrValues>", chiffrement "<encoding>" et signature "<signature>"
    Et que je clique sur le fournisseur d'identité
    Et que je suis redirigé vers la page login du fournisseur d'identité
    Quand je m'authentifie avec succès
    Et je suis redirigé vers la page confirmation de connexion
    Et les informations demandées par le fournisseur de service correspondent au scope "identite_pivot"
    Et je continue sur le fournisseur de service
    Alors je suis redirigé vers la page fournisseur de service
    Et je suis connecté
    Et le fournisseur de service a accès aux informations du scope "identite_pivot"

    Exemples:
      | acrValues | encoding         | signature |
      | eidas2    |                  | ES256     |
      | eidas2    | RSA-OAEP,A256GCM | ES256     |
      | eidas2    | ECDH-ES,A256GCM  | RS256     |
      | eidas3    |                  | RS256     |
      | eidas3    | RSA-OAEP,A256GCM | RS256     |
      | eidas3    | ECDH-ES,A256GCM  | ES256     |
