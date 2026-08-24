#language: fr
@usager @connexionWallet @ci @walletBridge
Fonctionnalité: Connexion avec un EUDI Wallet
  # En tant qu'usager d'un fournisseur de service,
  # je veux me connecter en utilisant un EUDI Wallet
  # afin de communiquer certaines informations personnelles au fournisseur de service

  Plan du Scénario: Connexion Wallet - scope <scopeType>
    Etant donné que le fournisseur de service requiert l'accès aux informations des scopes "<scopeType>"
    Et que je navigue sur la page fournisseur de service
    Et que je clique sur le bouton FranceConnect
    Et que je suis redirigé vers la page sélection du fournisseur d'identité
    Et que j'utilise un fournisseur d'identité "wallet-bridge"
    Et que je clique sur le fournisseur d'identité
    Et que je suis redirigé vers la page de connexion du Wallet Bridge
    Et que le QR code de connexion Wallet EUDI est affiché
    Quand je scan le QR code de connexion Wallet EUDI
    Et j'utilise un compte usager "pour les tests wallet EUDI"
    Et je m'authentifie sur mon Wallet EUDI
    Alors je suis redirigé vers la page confirmation de connexion
    Et je continue sur le fournisseur de service
    Et je suis redirigé vers la page fournisseur de service
    Et je suis connecté au fournisseur de service
    # Et le fournisseur de service a accès aux informations des scopes "<scopeType>"

    Exemples:
      | scopeType                 |
      | profile sans alias        |

  Scénario: Connexion Wallet - affichage des états d'authentification
    Etant donné que le fournisseur de service requiert l'accès aux informations des scopes "profile sans alias"
    Et que je navigue sur la page fournisseur de service
    Et que je clique sur le bouton FranceConnect
    Et que je suis redirigé vers la page sélection du fournisseur d'identité
    Et que j'utilise un fournisseur d'identité "wallet-bridge"
    Et que je clique sur le fournisseur d'identité
    Et que je suis redirigé vers la page de connexion du Wallet Bridge
    Et que le QR code de connexion Wallet EUDI est affiché
    Et que je scan le QR code de connexion Wallet EUDI
    Et que j'utilise un compte usager "pour les tests wallet EUDI"
    Quand j'ouvre la demande d'authentification sur mon Wallet EUDI
    Alors le message d'authentification en cours est affiché
    Quand je m'authentifie sur mon Wallet EUDI
    Alors le message d'authentification réussie est affiché
    Et je suis redirigé vers la page confirmation de connexion

  Scénario: Connexion Wallet - abandon de l'authentification depuis le wallet
    Etant donné que le fournisseur de service requiert l'accès aux informations des scopes "profile sans alias"
    Et que je navigue sur la page fournisseur de service
    Et que je clique sur le bouton FranceConnect
    Et que je suis redirigé vers la page sélection du fournisseur d'identité
    Et que j'utilise un fournisseur d'identité "wallet-bridge"
    Et que je clique sur le fournisseur d'identité
    Et que je suis redirigé vers la page de connexion du Wallet Bridge
    Et que le QR code de connexion Wallet EUDI est affiché
    Et que je scan le QR code de connexion Wallet EUDI
    Quand j'annule l'authentification depuis mon Wallet EUDI
    Alors le message d'échec de connexion est affiché

  Plan du Scénario: Page de connexion Wallet - affichage de la page sur <device>
    Etant donné que j'utilise un navigateur web sur "<device>"
    Et que je navigue sur la page fournisseur de service
    Et que je clique sur le bouton FranceConnect
    Et que je suis redirigé vers la page sélection du fournisseur d'identité
    Et que j'utilise un fournisseur d'identité "wallet-bridge"
    Quand je clique sur le fournisseur d'identité
    Alors je suis redirigé vers la page de connexion du Wallet Bridge
    Et le QR code de connexion Wallet EUDI est affiché
    Et le bouton d'ouverture de l'application wallet <isAppButtonDisplayed>
    Et le lien d'information Wallet EUDI redirige vers le site usagers

    Exemples:
      | device  | isAppButtonDisplayed |
      | mobile  | est affiché          |
      | desktop | n'est pas affiché    |
