#language: fr
@usager @pidBirthPlace @ci @walletBridge
Fonctionnalité: Récupération du lieu de naissance d'un usager via le Wallet Bridge
  # En tant que fournisseur de service,
  # je veux récupérer les informations concernant le lieu de naissance d'un usager via le Wallet Bridge
  # afin de pouvoir identifier l'usager

  Plan du Scénario: PID Birthplace - COG birthcountry quand PID <pidType>
    Etant donné que le fournisseur de service requiert l'accès aux informations des scopes "identite_pivot sans alias"
    Et que je navigue sur la page fournisseur de service
    Et que je clique sur le bouton FranceConnect
    Et que je suis redirigé vers la page sélection du fournisseur d'identité
    Et que j'utilise un fournisseur d'identité "wallet-bridge"
    Et que je clique sur le fournisseur d'identité
    Et que je suis redirigé vers la page de connexion du Wallet Bridge
    Et que le QR code de connexion Wallet EUDI est affiché
    Quand je scan le QR code de connexion Wallet EUDI
    Et j'utilise un PID "<pidType>"
    Et je m'authentifie sur mon Wallet EUDI
    Alors je suis redirigé vers la page confirmation de connexion
    Et je continue sur le fournisseur de service
    Et je suis redirigé vers la page fournisseur de service
    Et je suis connecté au fournisseur de service
    Et le claim "birthcountry" contient "<birthcountry>" dans la réponse userinfo

    Exemples:
      | pidType                     | birthcountry |
      | avec code ISO de la France  | 99100        |
      | avec code ISO de la Pologne | 99122        |

  Plan du Scénario: PID Birthplace - birthcountry absent quand PID <pidType>
    Etant donné que le fournisseur de service requiert l'accès aux informations des scopes "identite_pivot sans alias"
    Et que je navigue sur la page fournisseur de service
    Et que je clique sur le bouton FranceConnect
    Et que je suis redirigé vers la page sélection du fournisseur d'identité
    Et que j'utilise un fournisseur d'identité "wallet-bridge"
    Et que je clique sur le fournisseur d'identité
    Et que je suis redirigé vers la page de connexion du Wallet Bridge
    Et que le QR code de connexion Wallet EUDI est affiché
    Quand je scan le QR code de connexion Wallet EUDI
    Et j'utilise un PID "<pidType>"
    Et je m'authentifie sur mon Wallet EUDI
    Alors je suis redirigé vers la page confirmation de connexion
    Et je continue sur le fournisseur de service
    Et je suis redirigé vers la page fournisseur de service
    Et je suis connecté au fournisseur de service
    Et le claim "birthcountry" est absent de la réponse userinfo

    Exemples:
      | pidType                                  |
      | sans code ISO reconnu par l'INSEE        |
      | sans country dans l'attribut birth_place |
