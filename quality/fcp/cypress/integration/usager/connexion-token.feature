#language: fr
@usager @token @ci
Fonctionnalité: Connexion Usager - Token
  # En tant qu'usager,
  # je souhaite que mes données de session soient accessibles tant que mon token est valide
  # afin de continuer à utiliser mes données depuis mon fournisseur de service

  # configuration de FS manquante sur integ01
  @fcpLow @ignoreInteg01
  Scénario: FCP LOW - Token encore valide après changement d'identité (FI non disponible pour SSO)
    # Première cinématique
    Etant donné que j'utilise un compte usager "par défaut"
    Et que j'utilise un fournisseur de service "avec accès exclusif à un FI"
    Et que le fournisseur de service requiert l'accès aux informations du scope "identite_pivot"
    Et que j'utilise le fournisseur d'identité "disponible que pour un FS"
    Et que je navigue sur la page fournisseur de service
    Et que je me connecte à FranceConnect
    Et que je suis redirigé vers la page fournisseur de service
    Et que je suis connecté au fournisseur de service
    Et que le fournisseur de service a accès aux informations des scopes "identite_pivot"
    # Deuxième cinématique avec premier FI non disponible et autre identité
    Et que j'utilise un compte usager "présumé né jour"
    Et que j'utilise un fournisseur de service "par défaut"
    Et que j'utilise le fournisseur d'identité "par défaut"
    Et que je navigue sur la page fournisseur de service
    Et que je me connecte à FranceConnect
    Et que je suis redirigé vers la page fournisseur de service
    Et que je suis connecté au fournisseur de service
    Et que le fournisseur de service a accès aux informations des scopes "identite_pivot"
    # Vérification des informations renvoyées suite à un refresh des données depuis le premier FS
    Quand j'utilise un compte usager "par défaut"
    Et j'utilise un fournisseur de service "avec accès exclusif à un FI"
    Et je navigue sur la page fournisseur de service
    Et je redemande les informations de l'usager
    Alors le fournisseur de service a accès aux informations des scopes "identite_pivot"

  # TODO: Investiguer pourquoi ce scénario ne fonctionne pas avec Cypress sur integ01
  # TODO: A réactiver quand le #1418 sera fait
  @fcpHigh @ignoreInteg01 @ignoreHigh
  Scénario: FCP HIGH - Token encore valide après nouvelle cinématique
    # Première cinématique
    Etant donné que j'utilise un compte usager "par défaut"
    Et que j'utilise un fournisseur de service "public"
    Et que le fournisseur de service requiert l'accès aux informations du scope "identite_pivot"
    Et que je navigue sur la page fournisseur de service
    Et que je me connecte à FranceConnect
    Et que je suis redirigé vers la page fournisseur de service
    Et que je suis connecté au fournisseur de service
    Et que le fournisseur de service a accès aux informations des scopes "identite_pivot"
    # Deuxième cinématique avec autre identité
    Et que j'utilise un compte usager "présumé né jour"
    Et que j'utilise un fournisseur de service "privé avec consentement obligatoire"
    Et que le fournisseur de service requiert un niveau de sécurité "eidas3"
    Et que je navigue sur la page fournisseur de service
    Et que je me connecte à FranceConnect
    Et que je suis redirigé vers la page fournisseur de service
    Et que je suis connecté au fournisseur de service
    Et que le fournisseur de service a accès aux informations des scopes "identite_pivot"
    # Vérification des informations renvoyées suite à un refresh des données depuis le premier FS
    Quand j'utilise un compte usager "par défaut"
    Et j'utilise un fournisseur de service "public"
    Et je navigue sur la page fournisseur de service
    Et je redemande les informations de l'usager
    Alors le fournisseur de service a accès aux informations des scopes "identite_pivot"
