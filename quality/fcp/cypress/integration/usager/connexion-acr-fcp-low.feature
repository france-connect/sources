#language: fr
@usager @connexionAcr @fcpLow
Fonctionnalité: Connexion ACR
  # En tant qu'usager d'un fournisseur de service,
  # je veux utiliser un niveau de sécurité spécifique lors de ma connexion
  # afin d'accéder à mon service

  Plan du Scénario: Connexion ACR - FCP low - identification niveau "<acrValues>" (méthode <method>)
    Etant donné que j'utilise le fournisseur de service "par défaut"
    Et que le fournisseur de service requiert l'accès aux informations du scope "tous les scopes"
    Et que le fournisseur de service requiert un niveau de sécurité "<acrValues>"
    Et que le fournisseur de service se connecte à FranceConnect via la méthode "<method>"
    Et que je navigue sur la page fournisseur de service
    Et que je clique sur le bouton FranceConnect
    Et que je suis redirigé vers la page sélection du fournisseur d'identité
    Et que j'utilise un fournisseur d'identité "actif"
    Et que je clique sur le fournisseur d'identité
    Et que je suis redirigé vers la page login du fournisseur d'identité
    Quand je m'authentifie avec succès
    Et je suis redirigé vers la page confirmation de connexion
    Et les informations demandées par le fournisseur de service correspondent au scope "tous les scopes"
    Et je continue sur le fournisseur de service
    Alors je suis redirigé vers la page fournisseur de service
    Et je suis connecté au fournisseur de service
    Et la cinématique a utilisé le niveau de sécurité "eidas1"
    Et le fournisseur de service a accès aux informations du scope "tous les scopes"

    @ci
    Exemples:
      | acrValues      | method |
      | eidas1         | get    |
      | eidas1         | post   |
      | niveau_inconnu | get    |

    Exemples:
      | acrValues            | method |
      | niveau_inconnu       | post   |
      | eidas1 eidas2 eidas3 | post   |

  Plan du Scénario: Connexion ACR - FCP low - identification niveau non autorisé "<acrValues>" (méthode <method>)
    Etant donné que j'utilise le fournisseur de service "par défaut"
    Et que le fournisseur de service requiert l'accès aux informations du scope "tous les scopes"
    Et que le fournisseur de service requiert un niveau de sécurité "<acrValues>"
    Et que le fournisseur de service se connecte à FranceConnect via la méthode "<method>"
    Et que je navigue sur la page fournisseur de service
    Quand je clique sur le bouton FranceConnect
    Alors je suis redirigé vers la page erreur du fournisseur de service
    Et le titre de l'erreur fournisseur de service est "invalid_acr"
    Et la description de l'erreur fournisseur de service est "acr_value is not valid, should be equal one of these values, expected eidas1, got <actualAcr>"

    Exemples:
      | acrValues      | method | actualAcr |
      | eidas2         | get    | eidas2    |
      | eidas3         | post   | eidas3    |
      | eidas2 eidas3  | post   | eidas2    |
      | inconnu eidas3 | get    | eidas3    |

  @ci
  Plan du Scénario: Connexion ACR - FCP low - cinématique "<spAcr>" avec FI retournant niveau "<idpAcr>"
    Etant donné que j'utilise le fournisseur de service "par défaut"
    Et que le fournisseur de service requiert l'accès aux informations du scope "tous les scopes"
    Et que le fournisseur de service requiert un niveau de sécurité "<spAcr>"
    Et que je navigue sur la page fournisseur de service
    Et que je clique sur le bouton FranceConnect
    Et que je suis redirigé vers la page sélection du fournisseur d'identité
    Et que j'utilise un fournisseur d'identité avec niveau de sécurité "eidas2"
    Et que je clique sur le fournisseur d'identité
    Et que je suis redirigé vers la page login du fournisseur d'identité
    Et que le fournisseur d'identité garantit un niveau de sécurité "<idpAcr>"
    Quand je m'authentifie avec succès
    Et je suis redirigé vers la page confirmation de connexion
    Et les informations demandées par le fournisseur de service correspondent au scope "tous les scopes"
    Et je continue sur le fournisseur de service
    Alors je suis redirigé vers la page fournisseur de service
    Et je suis connecté au fournisseur de service
    Et la cinématique a utilisé le niveau de sécurité "<actualAcr>"
    Et le fournisseur de service a accès aux informations du scope "tous les scopes"

    Exemples:
      | spAcr  | idpAcr | actualAcr |
      | eidas1 | eidas1 | eidas1    |
      | eidas1 | eidas2 | eidas1    |

  Scénario: Connexion ACR - FCP low - erreur FI retourne un niveau inconnu
    Etant donné que j'utilise le fournisseur de service "par défaut"
    Et que le fournisseur de service requiert l'accès aux informations du scope "tous les scopes"
    Et que le fournisseur de service requiert un niveau de sécurité "eidas1"
    Et que je navigue sur la page fournisseur de service
    Et que je clique sur le bouton FranceConnect
    Et que je suis redirigé vers la page sélection du fournisseur d'identité
    Et que je clique sur le fournisseur d'identité
    Et que je suis redirigé vers la page login du fournisseur d'identité
    Et que le fournisseur d'identité garantit un niveau de sécurité "inconnu"
    Quand je m'authentifie avec succès
    Alors je suis redirigé vers la page erreur technique FranceConnect
    Et le code d'erreur FranceConnect est "Y020001"
    Et le message d'erreur FranceConnect est "Une erreur technique est survenue. Si le problème persiste, veuillez nous contacter."

  Scénario: Connexion ACR - FCP low - erreur FI retourne un niveau eidas2
    Etant donné que j'utilise le fournisseur de service "par défaut"
    Et que le fournisseur de service requiert l'accès aux informations du scope "tous les scopes"
    Et que le fournisseur de service requiert un niveau de sécurité "eidas1"
    Et que je navigue sur la page fournisseur de service
    Et que je clique sur le bouton FranceConnect
    Et que je suis redirigé vers la page sélection du fournisseur d'identité
    Et que j'utilise un fournisseur d'identité avec niveau de sécurité "eidas1"
    Et que je clique sur le fournisseur d'identité
    Et que je suis redirigé vers la page login du fournisseur d'identité
    Et que le fournisseur d'identité garantit un niveau de sécurité "eidas2"
    Quand je m'authentifie avec succès
    Alors je suis redirigé vers la page erreur technique FranceConnect
    Et le code d'erreur FranceConnect est "Y020018"
    Et le message d'erreur FranceConnect est "Une erreur technique est survenue. Si le problème persiste, veuillez nous contacter."
