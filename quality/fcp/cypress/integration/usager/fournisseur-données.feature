#language: fr
@usager @fournisseurDonnées @ci
Fonctionnalité: Fournisseur Données
  # En tant que fournisseur de données,
  # je souhaite vérifier la validité d'un access token
  # afin de fournir les données liées aux scopes autorisés pour le fournisseur de service

  Plan du Scénario: Checktoken - access token valide niveau <acrValue>
    Etant donné que le fournisseur de service requiert l'accès aux informations des scopes "tous les scopes data"
    Et que le fournisseur de service requiert un niveau de sécurité "<acrValue>"
    Et que je navigue sur la page fournisseur de service
    Et que je me connecte à FranceConnect
    Et que je suis redirigé vers la page fournisseur de service
    Et que je suis connecté au fournisseur de service
    Quand le fournisseur de service demande l'accès aux données au fournisseur de données
    Alors le fournisseur de données vérifie l'access token fourni par le fournisseur de service
    Et le checktoken endpoint envoie un token d'introspection valide
    Et le token d'introspection a une propriété "acr" égale à "<acrValue>"
    Et le token d'introspection a une propriété "scope" égale à "dgfip_rfr dgfip_aft"
    Et le token d'introspection contient l'identité de l'usager
    Et le token d'introspection a une propriété "aud" avec le client_id du fournisseur de service
    Et le token d'introspection a une propriété "iat" avec le timestamp de création de l'access token
    Et le token d'introspection a une propriété "exp" avec le timestamp d'expiration de l'access token

    @fcpLow
    Exemples:
      | acrValue |
      | eidas1   |

    @fcpHigh
    Exemples:
      | acrValue |
      | eidas2   |
      | eidas3   |

  Scénario: Checktoken - access token expiré
    Etant donné que je navigue sur la page fournisseur de service
    Et que je me connecte à FranceConnect
    Et que je suis redirigé vers la page fournisseur de service
    Et que je suis connecté au fournisseur de service
    Quand je révoque le token FranceConnect
    Et le fournisseur de service demande l'accès aux données au fournisseur de données
    Alors le fournisseur de données vérifie l'access token fourni par le fournisseur de service
    Et le checktoken endpoint envoie un token d'introspection expiré

  Scénario: Checktoken - access token aucun scope ne correspond au FD
    Etant donné que le fournisseur de service requiert l'accès aux informations des scopes "CNAM"
    Et que je navigue sur la page fournisseur de service
    Et que je me connecte à FranceConnect
    Et que je suis redirigé vers la page fournisseur de service
    Et que je suis connecté au fournisseur de service
    Quand le fournisseur de service demande l'accès aux données au fournisseur de données
    Alors le fournisseur de données vérifie l'access token fourni par le fournisseur de service
    Et le checktoken endpoint envoie un token d'introspection valide
    Et le token d'introspection a une propriété "scope" égale à ""

  Plan du Scénario: Checktoken - access token valide pour usager "<userType>"
    Etant donné que j'utilise un compte usager "<userType>"
    Et que je navigue sur la page fournisseur de service
    Et que je me connecte à FranceConnect
    Et que je suis redirigé vers la page fournisseur de service
    Et que je suis connecté au fournisseur de service
    Quand le fournisseur de service demande l'accès aux données au fournisseur de données
    Alors le fournisseur de données vérifie l'access token fourni par le fournisseur de service
    Et le checktoken endpoint envoie un token d'introspection valide
    Et le token d'introspection contient l'identité de l'usager

    Exemples:
      | userType                           |
      | avec un prénom contenant un espace |
    # @todo #1480 Ne pas renvoyer le claim birthplace si vide
    # see https://gitlab.dev-franceconnect.fr/france-connect/fc/-/issues/1480
    # | né en Algérie                      |
      | né en Corse                        |
      | présumé né jour                    |
      | présumé né jour et mois            |
