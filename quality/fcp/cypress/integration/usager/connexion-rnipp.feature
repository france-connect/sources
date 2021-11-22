#language: fr
@usager @connexionRnipp
Fonctionnalité: Connexion Usager - RNIPP
  # En tant qu'usager d'un fournisseur de service,
  # je veux me connecter en utilisant un fournisseur d'identité et récupérer mes informations du RNIPP
  # afin de les communiquer au fournisseur de service

  Plan du Scénario: Connexion d'un usager - rnipp <userType>
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
    Et je suis connecté
    Et le fournisseur de service a accès aux informations des scopes "tous les scopes"

    Exemples:
      | userType                |
      | né en Corse             |
      | présumé né jour         |
      | présumé né jour et mois |

  Scénario: Connexion d'un usager - erreur invalide COG
    Etant donné que je navigue sur la page fournisseur de service
    Et que je clique sur le bouton FranceConnect
    Et que je suis redirigé vers la page sélection du fournisseur d'identité
    Et que j'utilise un fournisseur d'identité "actif"
    Et que je clique sur le fournisseur d'identité
    Et que je suis redirigé vers la page login du fournisseur d'identité
    Et que j'utilise un compte usager "avec un COG invalide"
    Quand je m'authentifie avec succès
    Alors je suis redirigé vers la page erreur technique
    Et le code d'erreur est "Y000006"
