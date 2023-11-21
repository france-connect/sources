#language: fr
@usager @fiEidasBridge @fcpHigh @ignoreInteg01
Fonctionnalité: Fournisseur Identité - Eidas Bridge
  # En tant qu'usager,
  # je veux que le bouton eIDAS bridge ne soit visible que si disponible
  # afin d'accéder à mon service

  Plan du Scénario: FI Eidas Bridge - <display> <active>
    Etant donné que je configure le fournisseur d'identité "eidas-bridge" <display> et <active> sur le site d'exploitation
    Et que je navigue sur la page fournisseur de service
    Quand je clique sur le bouton FranceConnect
    Alors je suis redirigé vers la page sélection du fournisseur d'identité
    Et j'utilise le fournisseur d'identité "eidas-bridge"
    Et le fournisseur d'identité <result> dans la mire

    @ci
    Exemples:
      | display   | active    | result            |
      | invisible | actif     | n'est pas affiché |
      | invisible | désactivé | n'est pas affiché |

    Exemples:
      | display   | active    | result            |
      | visible   | désactivé | n'est pas affiché |
      | visible   | actif     | est affiché       |

  Scénario: FI Eidas Bridge - Invisible si blacklisté
    Etant donné que j'ajoute "eidas-bridge" à la "Blacklist" du fournisseur de service "fsp1-high" sur le site d'exploitation
    Et que je navigue sur la page fournisseur de service
    Quand je clique sur le bouton FranceConnect
    Alors je suis redirigé vers la page sélection du fournisseur d'identité
    Et j'utilise le fournisseur d'identité "eidas-bridge"
    Et le fournisseur d'identité n'est pas affiché dans la mire

  Scénario: FI Eidas Bridge - Visible si non blacklisté
    Etant donné que je retire les restrictions de FI du fournisseur de service "fsp1-high" sur le site d'exploitation
    Et que je navigue sur la page fournisseur de service
    Quand je clique sur le bouton FranceConnect
    Alors je suis redirigé vers la page sélection du fournisseur d'identité
    Et j'utilise le fournisseur d'identité "eidas-bridge"
    Et le fournisseur d'identité est affiché dans la mire
