#language: fr
@usager @connexionAcr
Fonctionnalité: Connexion Usager - Acr
  # En tant qu'usager d'un fournisseur de service,
  # je veux me connecter en utilisant un fournisseur d'identité
  # et recevoir sur mon FS un niveau de sécurité eidas1

  Plan du Scénario: Connexion ACR - identification niveau "<acrValues>" (méthode <method>) utilise eidas1
    Etant donné que j'utilise le fournisseur de service "par défaut"
    Et que j'utilise le fournisseur d'identité "par défaut"
    Et que le fournisseur de service requiert l'accès aux informations des scopes "obligatoires"
    Et que le fournisseur de service requiert un niveau de sécurité "<acrValues>"
    Et que le fournisseur de service se connecte à AgentConnect via la méthode "<method>"
    Et que je navigue sur la page fournisseur de service
    Et que je clique sur le bouton AgentConnect
    Et que je suis redirigé vers la page interaction
    Et que j'entre l'email "test@fia1.fr"
    Quand je clique sur le bouton de connexion
    Et je suis redirigé vers la page login du fournisseur d'identité
    Et je m'authentifie avec succès
    Alors je suis redirigé vers la page fournisseur de service
    Et je suis connecté au fournisseur de service
    Et la cinématique a utilisé le niveau de sécurité "<actualAcr>"
    Et le fournisseur de service a accès aux informations du scope "obligatoires"

    @ci
    Exemples:
      | acrValues            | method | actualAcr |
      | eidas1               | get    | eidas1    |
      | eidas1               | post   | eidas1    |
      | niveau_inconnu       | get    | eidas1    |

    Exemples:
      | acrValues            | method | actualAcr |
      | niveau_inconnu       | post   | eidas1    |
      | eidas1 eidas2 eidas3 | post   | eidas1    |

  Plan du Scénario: Connexion ACR - identification niveau non autorisé "<acrValues>" (méthode <method>)
    Etant donné que j'utilise le fournisseur de service "par défaut"
    Et que le fournisseur de service requiert l'accès aux informations des scopes "obligatoires"
    Et que le fournisseur de service requiert un niveau de sécurité "<acrValues>"
    Et que le fournisseur de service se connecte à AgentConnect via la méthode "<method>"
    Et que je navigue sur la page fournisseur de service
    Quand je clique sur le bouton AgentConnect
    Alors je suis redirigé vers la page erreur du fournisseur de service
    Et le titre de l'erreur fournisseur de service est "invalid_acr"
    Et la description de l'erreur fournisseur de service est "acr_value is not valid, should be equal one of these values, expected eidas1, got <actualAcr>"

    Exemples:
      | acrValues      | method | actualAcr |
      | eidas2         | get    | eidas2    |
      | eidas3         | post   | eidas3    |
      | eidas2 eidas3  | post   | eidas2    |
      | inconnu eidas3 | get    | eidas3    |

  Plan du Scénario: Connexion ACR - FI retourne le niveau <idpAcr>
    Etant donné que j'utilise le fournisseur de service "par défaut"
    Et que j'utilise le fournisseur d'identité "par défaut"
    Et que le fournisseur de service requiert l'accès aux informations des scopes "obligatoires"
    Et que je navigue sur la page fournisseur de service
    Et que je clique sur le bouton AgentConnect
    Et que je suis redirigé vers la page interaction
    Et que j'entre l'email "test@fia1.fr"
    Et que je clique sur le bouton de connexion
    Et que je suis redirigé vers la page login du fournisseur d'identité
    Et que le fournisseur d'identité garantit un niveau de sécurité "<idpAcr>"
    Quand je m'authentifie avec succès
    Alors je suis redirigé vers la page fournisseur de service
    Et je suis connecté au fournisseur de service
    Et le fournisseur de service a accès aux informations des scopes "obligatoires"
    Et la cinématique a utilisé le niveau de sécurité "<actualAcr>"

    Exemples:
      | idpAcr | actualAcr |
      | eidas1 | eidas1    |

  Scénario: Connexion ACR - FI retourne un niveau inconnu
    Etant donné que j'utilise le fournisseur de service "par défaut"
    Et que j'utilise le fournisseur d'identité "par défaut"
    Et que le fournisseur de service requiert l'accès aux informations des scopes "obligatoires"
    Et que je navigue sur la page fournisseur de service
    Et que je clique sur le bouton AgentConnect
    Et que je suis redirigé vers la page interaction
    Et que j'entre l'email "test@fia1.fr"
    Et que je clique sur le bouton de connexion
    Et que je suis redirigé vers la page login du fournisseur d'identité
    Et que le fournisseur d'identité garantit un niveau de sécurité "inconnu"
    Quand je m'authentifie avec succès
    Alors je suis redirigé vers la page erreur technique
    Et le code d'erreur est "Y020001"

  Scénario: Connexion ACR - FI retourne un niveau trop élevé
    Etant donné que j'utilise le fournisseur de service "par défaut"
    Et que j'utilise le fournisseur d'identité "par défaut"
    Et que le fournisseur de service requiert l'accès aux informations des scopes "obligatoires"
    Et que je navigue sur la page fournisseur de service
    Et que je clique sur le bouton AgentConnect
    Et que je suis redirigé vers la page interaction
    Et que j'entre l'email "test@fia1.fr"
    Et que je clique sur le bouton de connexion
    Et que je suis redirigé vers la page login du fournisseur d'identité
    Et que le fournisseur d'identité garantit un niveau de sécurité "eidas2"
    Quand je m'authentifie avec succès
    Alors je suis redirigé vers la page erreur technique
    Et le code d'erreur est "Y020018"
