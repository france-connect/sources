#language: fr
@eidasBridge @connexionFsEu @ci @ignoreLow @ignoreHigh
Fonctionnalité: Connexion eIDAS - FS Européen
  # En tant qu'usager,
  # je veux utiliser mon identité vérifiée par un fournisseur d'identité français
  # afin d'accéder à mon fournisseur de service européen

  Scénario: Connexion FS Européen - FS eidas-be
    Etant donné que j'utilise un compte usager "par défaut"
    Et que j'utilise le fournisseur de service "eidas-be"
    Et que je navigue sur la page fournisseur de service eidas
    Et que le fournisseur de service requiert l'accès aux informations des scopes "eidas"
    Et que je configure un fournisseur de service sur eidas mock
    Et que je suis redirigé vers la page sélection du fournisseur d'identité
    Et que j'utilise un fournisseur d'identité "français"
    Et que je clique sur le fournisseur d'identité
    Et que je suis redirigé vers la page login du fournisseur d'identité
    Quand je m'authentifie avec succès
    Et je suis redirigé vers la page confirmation de connexion
    Et je continue sur le fournisseur de service
    Et je suis redirigé vers la page fournisseur de service eidas mock
    Et le fournisseur de service eidas mock a accès aux informations des scopes "eidas"
    Et le sub transmis au fournisseur de service eidas commence par "FR/BE"

  Plan du Scénario: Connexion FS Européen - FS eidas-mock avec compte usager <userDescription>
    Etant donné que j'utilise un compte usager "<userDescription>"
    Et que j'utilise le fournisseur de service "eidas-mock"
    Et que je navigue sur la page fournisseur de service eidas
    Et que le fournisseur de service requiert l'accès aux informations des scopes "eidas"
    Et que je configure un fournisseur de service sur eidas mock
    Et que je suis redirigé vers la page sélection du fournisseur d'identité
    Et que j'utilise un fournisseur d'identité "français"
    Et que je clique sur le fournisseur d'identité
    Et que je suis redirigé vers la page login du fournisseur d'identité
    Quand je m'authentifie avec succès
    Et je suis redirigé vers la page confirmation de connexion
    Et je continue sur le fournisseur de service
    Et je suis redirigé vers la page fournisseur de service eidas mock
    Et le fournisseur de service eidas mock a accès aux informations des scopes "eidas"
    Et le sub transmis au fournisseur de service eidas commence par "FR/CB"

    Exemples:
    | userDescription              |
    | avec genre feminin           |
    | avec genre masculin          |
    | avec des caractères spéciaux |
    | avec prénom composé          |
    | avec un nom de famille long  |
    | présumé né jour et mois      |
    | présumé né jour              |
