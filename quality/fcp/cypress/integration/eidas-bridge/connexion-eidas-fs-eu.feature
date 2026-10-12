#language: fr
@eidasBridge @connexionFsEu
Fonctionnalité: Connexion eIDAS - FS Européen
  # En tant qu'usager,
  # je veux utiliser mon identité vérifiée par un fournisseur d'identité français
  # afin d'accéder à mon fournisseur de service européen

  @ci
  Scénario: Connexion FS Européen - cas passant FS eidas-mock
    Etant donné que j'utilise un compte usager "par défaut"
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
    Et je continue sur le fournisseur de service européen
    Et j'avance jusqu'à la page fournisseur de service eidas mock
    Et le fournisseur de service eidas mock a accès aux informations des scopes "eidas"
    Et le sub transmis au fournisseur de service eidas commence par "FR/CB"

  @ci
  Plan du Scénario: Connexion FS Européen - FS eidas-mock - nameId au format <requestedNameIdFormat>
    Etant donné que j'utilise un compte usager "par défaut"
    Et que j'utilise le fournisseur de service "eidas-mock"
    Et que je navigue sur la page fournisseur de service eidas
    Et que le fournisseur de service requiert l'accès aux informations des scopes "eidas"
    Et que le fournisseur de service européen a configuré sa requête avec un nameId au format "<requestedNameIdFormat>"
    Et que je configure un fournisseur de service sur eidas mock
    Et que je suis redirigé vers la page sélection du fournisseur d'identité
    Et que j'utilise un fournisseur d'identité "français"
    Et que je clique sur le fournisseur d'identité
    Et que je suis redirigé vers la page login du fournisseur d'identité
    Quand je m'authentifie avec succès
    Et je suis redirigé vers la page confirmation de connexion
    Et je continue sur le fournisseur de service européen
    Et je suis redirigé vers la page de callback fournisseur de service eidas mock
    Et la réponse du fournisseur d'identité eidas mock contient un nameId au format "<expectedNameIdFormat>"
    Et je continue vers la page fournisseur de service eidas mock
    Et le fournisseur de service eidas mock a accès aux informations des scopes "eidas"

    Exemples:
      | requestedNameIdFormat | expectedNameIdFormat |
      | persistent            | persistent           |
      | transient             | transient            |
      | unspecified           | persistent           |
      | label                 | persistent           |

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
    Et je continue sur le fournisseur de service européen
    Et j'avance jusqu'à la page fournisseur de service eidas mock
    Et le fournisseur de service eidas mock a accès aux informations des scopes "eidas"

    Exemples:
      | userDescription              |
      | avec genre feminin           |
      | avec genre masculin          |
      | avec des caractères spéciaux |
      | avec prénom composé          |
      | avec un nom de famille long  |
      | présumé né jour et mois      |
      | présumé né jour              |

  @ci
  Plan du Scénario: Connexion FS Européen - idpAcr <acr> - eidas-bridge renvoie le level of assurance <levelOfAssurance>
    Etant donné que j'utilise un compte usager "par défaut"
    Et que j'utilise le fournisseur de service "eidas-mock"
    Et que je navigue sur la page fournisseur de service eidas
    Et que le fournisseur de service requiert l'accès aux informations des scopes "eidas"
    Et que je configure un fournisseur de service sur eidas mock
    Et que je suis redirigé vers la page sélection du fournisseur d'identité
    Et que j'utilise un fournisseur d'identité "français"
    Et que je clique sur le fournisseur d'identité
    Et que je suis redirigé vers la page login du fournisseur d'identité
    Et que le fournisseur d'identité garantit un niveau de sécurité "<acr>"
    Quand je m'authentifie avec succès
    Et je suis redirigé vers la page confirmation de connexion
    Et je continue sur le fournisseur de service européen
    Et je suis redirigé vers la page de callback fournisseur de service eidas mock
    Et la réponse du fournisseur d'identité eidas mock contient le level of assurance "<levelOfAssurance>"
    Et je continue vers la page fournisseur de service eidas mock
    Et le fournisseur de service eidas mock a accès aux informations des scopes "eidas"
    Et le sub transmis au fournisseur de service eidas commence par "FR/CB"

    Exemples:
      | acr    | levelOfAssurance |
      | eidas2 | D                |
      | eidas3 | E                |
