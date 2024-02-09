#language: fr
@usager @connexionScope
Fonctionnalité: Connexion Usager - Scope
  # En tant qu'usager d'un fournisseur de service,
  # je veux me connecter en utilisant un fournisseur d'identité
  # afin de communiquer certaines informations personnelles au fournisseur de service

  Plan du Scénario: Connexion d'un usager - scope <scopeType>
    Etant donné que le fournisseur de service requiert l'accès aux informations des scopes "<scopeType>"
    Et que je navigue sur la page fournisseur de service
    Et que je clique sur le bouton FranceConnect
    Et que je suis redirigé vers la page sélection du fournisseur d'identité
    Et que j'utilise un fournisseur d'identité "actif"
    Et que je clique sur le fournisseur d'identité
    Et que je suis redirigé vers la page login du fournisseur d'identité
    Quand je m'authentifie avec succès
    Et je suis redirigé vers la page confirmation de connexion
    Et les informations demandées par le fournisseur de service correspondent aux scopes "<scopeType>"
    Et je continue sur le fournisseur de service
    Alors je suis redirigé vers la page fournisseur de service
    Et je suis connecté au fournisseur de service
    Et le fournisseur de service a accès aux informations des scopes "<scopeType>"

    Exemples:
      | scopeType                 |
      | tous les scopes           |
      | profile sans alias        |
      | identite_pivot sans alias |
      | birth                     |
      | profile                   |
      | identite_pivot            |

  @fcpHigh
  Plan du Scénario: Connexion d'un usager - tous les claims rnipp avec usager <userType>
    Etant donné que le fournisseur de service requiert l'accès aux informations des scopes "tous les scopes rnipp (authorize)"
    Et que je navigue sur la page fournisseur de service
    Et que je clique sur le bouton FranceConnect
    Et que je suis redirigé vers la page sélection du fournisseur d'identité
    Et que j'utilise un fournisseur d'identité "actif"
    Et que je clique sur le fournisseur d'identité
    Et que je suis redirigé vers la page login du fournisseur d'identité
    Et que j'utilise un compte usager "<userType>"
    Quand je m'authentifie avec succès
    Et je suis redirigé vers la page confirmation de connexion
    Et les informations demandées par le fournisseur de service correspondent aux scopes "tous les scopes rnipp (authorize)"
    Et je continue sur le fournisseur de service
    Alors je suis redirigé vers la page fournisseur de service
    Et je suis connecté au fournisseur de service
    Et le fournisseur de service a accès aux informations des scopes "tous les scopes rnipp (userinfo)"

    @ci
    Exemples:
      | userType                           |
      | avec un prénom contenant un espace |

    Exemples:
      | userType                           |
      | avec un prénom                     |
      | avec 3 prénoms                     |
      | avec prénom composé                |

  @fcpLow @ci
  Scénario: Connexion d'un usager - scope idp_birthdate
    Etant donné que le fournisseur de service requiert l'accès aux informations des scopes "birthdate et idp_birthdate"
    Et que je navigue sur la page fournisseur de service
    Et que je clique sur le bouton FranceConnect
    Et que je suis redirigé vers la page sélection du fournisseur d'identité
    Et que j'utilise un fournisseur d'identité "actif"
    Et que je clique sur le fournisseur d'identité
    Et que je suis redirigé vers la page login du fournisseur d'identité
    Quand je m'authentifie avec succès
    Et je suis redirigé vers la page confirmation de connexion
    Et les informations demandées par le fournisseur de service correspondent aux scopes "birthdate et idp_birthdate"
    Et je continue sur le fournisseur de service
    Alors je suis redirigé vers la page fournisseur de service
    Et je suis connecté au fournisseur de service
    Et le fournisseur de service a accès aux informations des scopes "birthdate et idp_birthdate"

  @fcpLow
  Plan du Scénario: Connexion d'un usager - claim given_name_array avec usager <userType>
    Etant donné que le fournisseur de service requiert l'accès aux informations des scopes "tous les scopes"
    Et que je navigue sur la page fournisseur de service
    Et que je clique sur le bouton FranceConnect
    Et que je suis redirigé vers la page sélection du fournisseur d'identité
    Et que j'utilise un fournisseur d'identité "actif"
    Et que je clique sur le fournisseur d'identité
    Et que je suis redirigé vers la page login du fournisseur d'identité
    Et que j'utilise un compte usager "<userType>"
    Quand je m'authentifie avec succès
    Et je suis redirigé vers la page confirmation de connexion
    Et les informations demandées par le fournisseur de service correspondent aux scopes "tous les scopes"
    Et je continue sur le fournisseur de service
    Alors je suis redirigé vers la page fournisseur de service
    Et je suis connecté au fournisseur de service
    Et le fournisseur de service a accès aux informations des scopes "tous les scopes"

    @ci
    Exemples:
      | userType                           |
      | avec un prénom contenant un espace |
    
    Exemples:
      | userType                           |
      | avec un prénom                     |
      | avec 3 prénoms                     |
      | avec prénom composé                |

  Scénario: Connexion d'un usager - scope anonyme
    Etant donné que le fournisseur de service requiert l'accès aux informations du scope "anonyme"
    Et que je navigue sur la page fournisseur de service
    Et que je clique sur le bouton FranceConnect
    Et que je suis redirigé vers la page sélection du fournisseur d'identité
    Et que j'utilise un fournisseur d'identité "actif"
    Et que je clique sur le fournisseur d'identité
    Et que je suis redirigé vers la page login du fournisseur d'identité
    Quand je m'authentifie avec succès
    Et je suis redirigé vers la page confirmation de connexion
    Et aucune information n'est demandée par le fournisseur de service pour le scope "anonyme"
    Et je continue sur le fournisseur de service
    Alors je suis redirigé vers la page fournisseur de service
    Et je suis connecté au fournisseur de service
    Et le fournisseur de service a accès aux informations du scope "anonyme"

  Scénario: Connexion d'un usager - attribut scope inconnu ignoré
    Etant donné que le fournisseur de service requiert l'accès aux informations des scopes "profile avec scope inconnu"
    Et que je navigue sur la page fournisseur de service
    Et que je clique sur le bouton FranceConnect
    Et que je suis redirigé vers la page sélection du fournisseur d'identité
    Et que j'utilise un fournisseur d'identité "actif"
    Et que je clique sur le fournisseur d'identité
    Et que je suis redirigé vers la page login du fournisseur d'identité
    Quand je m'authentifie avec succès
    Et je suis redirigé vers la page confirmation de connexion
    Et les informations demandées par le fournisseur de service correspondent aux scopes "profile"
    Et je continue sur le fournisseur de service
    Alors je suis redirigé vers la page fournisseur de service
    Et je suis connecté au fournisseur de service
    Et le fournisseur de service a accès aux informations des scopes "profile"

  @ignoreLow
  Scénario: Connexion d'un usager - erreur FS non habilité pour ce scope
    Etant donné que j'utilise le fournisseur de service "habilité à demander le scope identite_pivot"
    Et que le fournisseur de service requiert l'accès aux informations du scope "email"
    Et que je navigue sur la page fournisseur de service
    Quand je clique sur le bouton FranceConnect
    Alors je suis redirigé vers la page erreur du fournisseur de service
    Et le titre de l'erreur fournisseur de service est "invalid_scope"
    Et la description de l'erreur fournisseur de service est "requested scope is not allowed"
