#language: fr
@usager @connexionUsager @ci
Fonctionnalité: Connexion Usager - Redirection vers FI avec email
  # En tant qu'usager d'un fournisseur de service,
  # je veux me connecter en utilisant un fournisseur d'identité
  # afin d'accéder à mon service

  Plan du Scénario: Connexion d'un usager - fqdn <idpName>
    Etant donné que le fournisseur de service requiert l'accès aux informations du scope "<scope>"
    Et que je navigue sur la page fournisseur de service
    Et que je clique sur le bouton AgentConnect
    Et que je suis redirigé vers la page interaction
    Et que j'entre l'email "<email>"
    Quand je clique sur le bouton de connexion
    Et j'utilise le fournisseur d'identité "<idpName>"
    Et je suis redirigé vers la page login du fournisseur d'identité
    Et je m'authentifie avec succès
    Alors je suis redirigé vers la page fournisseur de service
    Et je suis connecté au fournisseur de service
    Et le fournisseur de service a accès aux informations du scope "<scope>"

    Exemples:
      | email                  | idpName    | scope           |
      | iknowthisemail@fia1.fr | par défaut | tous les scopes |
      | iknowthisemail@fia2.fr | différent  | tous les scopes |

    @ignoreInteg01
    Exemples:
      | email                        | idpName      | scope           |
      | albus.dumbledore@hogwarts.uk | moncomptepro | tous les scopes |

  @ignoreDocker
  Plan du Scénario: Connexion d'un usager - fqdn <idpName> (redirection vers FI seulement)
    Etant donné que je navigue sur la page fournisseur de service
    Et que je clique sur le bouton AgentConnect
    Et que je suis redirigé vers la page interaction
    Et que j'entre l'email "<email>"
    Quand je clique sur le bouton de connexion
    Alors j'utilise le fournisseur d'identité "<idpName>"
    Et je suis redirigé vers la page login du fournisseur d'identité

    Exemples:
      | email                               | idpName      |
      | albus.dumbledore@hogwarts.uk        | moncomptepro |
      | hades@developpement-durable.gouv.fr | cerbere      |

  @ignoreInteg01
  Scénario: Connexion d'un usager - fqdn non reconnu et non service public
    Etant donné que le fournisseur de service requiert l'accès aux informations du scope "tous les scopes"
    Et que je navigue sur la page fournisseur de service
    Et que je clique sur le bouton AgentConnect
    Et que je suis redirigé vers la page interaction
    Et que j'entre l'email "albus.dumbledore@hogwarts.uk"
    Quand je clique sur le bouton de connexion
    Et j'utilise le fournisseur d'identité "moncomptepro"
    Et je suis redirigé vers la page login du fournisseur d'identité
    Et j'utilise un compte usager "privé"
    Et je m'authentifie avec succès
    Alors je suis redirigé vers la page erreur technique
    Et le code d'erreur est "Y000015"

  @ignoreInteg01
  Scénario: Connexion d'un usager - fqdn non reconnu et non service public mais FS acceptant le privé
    Etant donné que j'utilise le fournisseur de service "acceptant le privé"
    Et que je navigue sur la page fournisseur de service
    Et que je clique sur le bouton AgentConnect
    Et que je suis redirigé vers la page interaction
    Et que j'entre l'email "albus.dumbledore@hogwarts.uk"
    Quand je clique sur le bouton de connexion
    Et j'utilise le fournisseur d'identité "moncomptepro"
    Et que je suis redirigé vers la page login du fournisseur d'identité
    Et j'utilise un compte usager "privé"
    Et je m'authentifie avec succès
    Alors je suis redirigé vers la page fournisseur de service

  @ignoreInteg01
  Scénario: Connexion d'un usager - fqdn lié à plusieurs fi retourne le premier fi
    Etant donné que le fournisseur de service requiert l'accès aux informations du scope "tous les scopes"
    Et que je navigue sur la page fournisseur de service
    Et que je clique sur le bouton AgentConnect
    Et que je suis redirigé vers la page interaction
    Et que j'entre l'email "many@polyfi.fr"
    Quand je clique sur le bouton de connexion
    Et j'utilise le fournisseur d'identité "différent"
    Et je suis redirigé vers la page login du fournisseur d'identité
    Et je m'authentifie avec succès
    Alors je suis redirigé vers la page fournisseur de service
    Et je suis connecté au fournisseur de service
    Et le fournisseur de service a accès aux informations du scope "tous les scopes"
