#language: fr
@usager @fiWalletBridge @ignoreInteg01
Fonctionnalité: Fournisseur Identité - Wallet Bridge
  # En tant qu'usager,
  # je veux que le bouton wallet bridge ne soit visible que si disponible
  # afin d'accéder à mon service

  @ci @fcpHigh @fcpLow
  Plan du Scénario: FI Wallet Bridge - <display> <active>
    Etant donné que je configure le fournisseur d'identité "wallet-bridge" <display> et <active> sur le site d'exploitation
    Et que j'attend le rechargement déférré du cache des fournisseurs d'identité
    Et que je navigue sur la page fournisseur de service
    Quand je clique sur le bouton FranceConnect
    Alors je suis redirigé vers la page sélection du fournisseur d'identité
    Et j'utilise le fournisseur d'identité "wallet-bridge"
    Et le fournisseur d'identité <result> dans la mire

    Exemples:
      | display   | active    | result            |
      | visible   | désactivé | n'est pas affiché |
      | invisible | actif     | n'est pas affiché |
      | invisible | désactivé | n'est pas affiché |
      | visible   | actif     | est affiché       |

  @fcpHigh
  Scénario: FI Wallet Bridge - Invisible si blacklisté
    Etant donné que j'ajoute "wallet-bridge" à la "Blacklist" du fournisseur de service "fsp1-high" sur le site d'exploitation
    Et que j'attend le rechargement déférré du cache des fournisseurs de service
    Et que je navigue sur la page fournisseur de service
    Quand je clique sur le bouton FranceConnect
    Alors je suis redirigé vers la page sélection du fournisseur d'identité
    Et j'utilise le fournisseur d'identité "wallet-bridge"
    Et le fournisseur d'identité n'est pas affiché dans la mire

  @fcpHigh
  Scénario: FI Wallet Bridge - Visible si non blacklisté
    Etant donné que je retire les restrictions de FI du fournisseur de service "fsp1-high" sur le site d'exploitation
    Et que j'attend le rechargement déférré du cache des fournisseurs de service
    Et que je navigue sur la page fournisseur de service
    Quand je clique sur le bouton FranceConnect
    Alors je suis redirigé vers la page sélection du fournisseur d'identité
    Et j'utilise le fournisseur d'identité "wallet-bridge"
    Et le fournisseur d'identité est affiché dans la mire

  @fcpLow
  Scénario: FI Wallet Bridge - Invisible si blacklisté
    Etant donné que j'ajoute "wallet-bridge" à la "Blacklist" du fournisseur de service "fsp1-low" sur le site d'exploitation
    Et que j'attend le rechargement déférré du cache des fournisseurs de service
    Et que je navigue sur la page fournisseur de service
    Quand je clique sur le bouton FranceConnect
    Alors je suis redirigé vers la page sélection du fournisseur d'identité
    Et j'utilise le fournisseur d'identité "wallet-bridge"
    Et le fournisseur d'identité n'est pas affiché dans la mire

  @fcpLow
  Scénario: FI Wallet Bridge - Visible si non blacklisté
    Etant donné que je retire les restrictions de FI du fournisseur de service "fsp1-low" sur le site d'exploitation
    Et que j'attend le rechargement déférré du cache des fournisseurs de service
    Et que je navigue sur la page fournisseur de service
    Quand je clique sur le bouton FranceConnect
    Alors je suis redirigé vers la page sélection du fournisseur d'identité
    Et j'utilise le fournisseur d'identité "wallet-bridge"
    Et le fournisseur d'identité est affiché dans la mire
