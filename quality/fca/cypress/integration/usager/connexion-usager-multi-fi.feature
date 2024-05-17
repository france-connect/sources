#language: fr
@usager @connexionUsager @ci
Fonctionnalité: Connexion Usager dont le fqdn est lié à plusieurs fi

  Plan du Scénario: Connexion d'un usager au fi <idpName>
    Etant donné que le fournisseur de service requiert l'accès aux informations du scope "<scope>"
    Et que je navigue sur la page fournisseur de service
    Et que je clique sur le bouton AgentConnect
    Et que je suis redirigé vers la page interaction
    Et que j'entre l'email "many@polyfi.fr"
    Quand je clique sur le bouton de connexion
    Alors je suis redirigé vers la page permettant la selection d'un fournisseur d'identité
    Et je choisis le fournisseur d'identité "<provider>"
    Quand j'utilise le fournisseur d'identité "<idpName>"
    Et je suis redirigé vers la page login du fournisseur d'identité
    Et je m'authentifie avec succès
    Alors je suis redirigé vers la page fournisseur de service
    Et je suis connecté au fournisseur de service
    Et le fournisseur de service a accès aux informations du scope "<scope>"

    Exemples:
      | provider                                   | idpName    | scope           |
      | Identity Provider 1 - eIDAS faible - ES256 | par défaut | tous les scopes |
      | Identity Provider 2 - eIDAS faible - RS256 | différent  | tous les scopes |

  Scénario: Connexion d'un usager - retour en arrière après redirection vers FI
    Etant donné que le fournisseur de service requiert l'accès aux informations du scope "tous les scopes"
    Et que je navigue sur la page fournisseur de service
    Et que je clique sur le bouton AgentConnect
    Et que je suis redirigé vers la page interaction
    Et que j'entre l'email "many@polyfi.fr"
    Quand je clique sur le bouton de connexion
    Et je suis redirigé vers la page permettant la selection d'un fournisseur d'identité
    Et je choisis le fournisseur d'identité "Identity Provider 1 - eIDAS faible - ES256"
    Et j'utilise le fournisseur d'identité "par défaut"
    Et je suis redirigé vers la page login du fournisseur d'identité
    Quand je reviens en arrière
    Alors je suis redirigé vers la page permettant la selection d'un fournisseur d'identité
    Quand je reviens en arrière
    Alors je suis redirigé vers la page interaction
