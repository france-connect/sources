#language: fr
@usager @connexionChiffrement @fcpLow
Fonctionnalité: Connexion avec chiffrement
  # En tant qu'usager d'un fournisseur de service,
  # je veux me connecter à un FI en utilisant du chiffrement
  # afin d'accéder à mon service

  @ignoreInteg01
  Plan du Scénario: Connexion d'un usager - FCP low - FI eidas1 avec signature userinfo "<signature>"
    Etant donné que j'utilise le fournisseur de service "par défaut"
    Et que le fournisseur de service requiert l'accès aux informations du scope "tous les scopes"
    Et que le fournisseur de service requiert un niveau de sécurité "eidas1"
    Et que j'utilise un fournisseur d'identité avec niveau de sécurité "eidas1" et signature "<signature>"
    Et que je navigue sur la page fournisseur de service
    Et que je clique sur le bouton FranceConnect
    Et que je suis redirigé vers la page sélection du fournisseur d'identité
    Et que je clique sur le fournisseur d'identité
    Et que je suis redirigé vers la page login du fournisseur d'identité
    Quand je m'authentifie avec succès
    Et je suis redirigé vers la page confirmation de connexion
    Et les informations demandées par le fournisseur de service correspondent au scope "tous les scopes"
    Et je continue sur le fournisseur de service
    Alors je suis redirigé vers la page fournisseur de service
    Et je suis connecté au fournisseur de service
    Et le fournisseur de service a accès aux informations du scope "tous les scopes"

    @ci
    Exemples:
      | signature |
      | HS256     |
      |           |

    Exemples:
      | signature |
      | ES256     |
  # Aucun FI configuré actuellement avec cette configuration de signature
  #   | RS256     |

  @ignoreInteg01
  Plan du Scénario: Connexion d'un usager - FCP low - FI eidas1 avec une mauvaise signature userinfo
    Etant donné que j'utilise le fournisseur de service "par défaut"
    Et que le fournisseur de service requiert l'accès aux informations du scope "tous les scopes"
    Et que le fournisseur de service requiert un niveau de sécurité "eidas1"
    Et que j'utilise un fournisseur d'identité avec niveau de sécurité "eidas1" et signature "<signature>"
    Et que je navigue sur la page fournisseur de service
    Et que je clique sur le bouton FranceConnect
    Et que je suis redirigé vers la page sélection du fournisseur d'identité
    Et que je clique sur le fournisseur d'identité
    Et que je suis redirigé vers la page login du fournisseur d'identité
    Quand je m'authentifie avec succès
    Alors je suis redirigé vers la page erreur technique FranceConnect
    Et le code d'erreur FranceConnect est "Y020027"
    Et le message d'erreur FranceConnect est "Une erreur technique est survenue. Si le problème persiste, veuillez nous contacter."

    Exemples:
      | signature    |
      | mauvaise     |
      | no-signature |
