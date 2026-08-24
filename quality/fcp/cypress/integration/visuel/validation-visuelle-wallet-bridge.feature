#language: fr
@validationVisuelle @walletBridge
Fonctionnalité: Validation Visuelle - Wallet Bridge

  Plan du Scénario: Validation Visuelle - page de connexion du Wallet Bridge sur <device>
    Etant donné que j'utilise un navigateur web sur "<device>"
    Et que je navigue sur la page fournisseur de service
    Et que je clique sur le bouton FranceConnect
    Et que je suis redirigé vers la page sélection du fournisseur d'identité
    Et que j'utilise un fournisseur d'identité "wallet-bridge"
    Quand je clique sur le fournisseur d'identité
    Alors je suis redirigé vers la page de connexion du Wallet Bridge
    Et le QR code de connexion Wallet EUDI est affiché
    Et la copie d'écran "connexionWallet" correspond à la page actuelle sur "<device>"

    Exemples:
      | device           |
      | mobile           |
      | tablet portrait  |
      | tablet landscape |
      | desktop          |

  Plan du Scénario: Validation Visuelle - <état> du Wallet Bridge sur <device>
    Etant donné que j'utilise un navigateur web sur "<device>"
    Et que je navigue sur la page fournisseur de service
    Et que je clique sur le bouton FranceConnect
    Et que je suis redirigé vers la page sélection du fournisseur d'identité
    Et que j'utilise un fournisseur d'identité "wallet-bridge"
    Et que je clique sur le fournisseur d'identité
    Et que je suis redirigé vers la page de connexion du Wallet Bridge
    Et que le QR code de connexion Wallet EUDI est affiché
    Et que je scan le QR code de connexion Wallet EUDI
    Et que j'utilise un compte usager "pour les tests wallet EUDI"
    Et que je suspends la redirection automatique du Wallet Bridge
    Quand <action>
    Et que le message <message> est affiché
    Alors la copie d'écran "<écran>" correspond à la page actuelle sur "<device>"

    Exemples:
      | état                      | device           | action                                                    | message                     | écran                  |
      | authentification en cours | mobile           | j'ouvre la demande d'authentification sur mon Wallet EUDI | d'authentification en cours | connexionWalletEnCours |
      | authentification en cours | tablet portrait  | j'ouvre la demande d'authentification sur mon Wallet EUDI | d'authentification en cours | connexionWalletEnCours |
      | authentification en cours | tablet landscape | j'ouvre la demande d'authentification sur mon Wallet EUDI | d'authentification en cours | connexionWalletEnCours |
      | authentification en cours | desktop          | j'ouvre la demande d'authentification sur mon Wallet EUDI | d'authentification en cours | connexionWalletEnCours |
      | échec d'authentification  | mobile           | j'annule l'authentification depuis mon Wallet EUDI        | d'échec de connexion        | connexionWalletEchec   |
      | échec d'authentification  | tablet portrait  | j'annule l'authentification depuis mon Wallet EUDI        | d'échec de connexion        | connexionWalletEchec   |
      | échec d'authentification  | tablet landscape | j'annule l'authentification depuis mon Wallet EUDI        | d'échec de connexion        | connexionWalletEchec   |
      | échec d'authentification  | desktop          | j'annule l'authentification depuis mon Wallet EUDI        | d'échec de connexion        | connexionWalletEchec   |
      | authentification réussie  | mobile           | je m'authentifie sur mon Wallet EUDI                      | d'authentification réussie  | connexionWalletSucces  |
      | authentification réussie  | tablet portrait  | je m'authentifie sur mon Wallet EUDI                      | d'authentification réussie  | connexionWalletSucces  |
      | authentification réussie  | tablet landscape | je m'authentifie sur mon Wallet EUDI                      | d'authentification réussie  | connexionWalletSucces  |
      | authentification réussie  | desktop          | je m'authentifie sur mon Wallet EUDI                      | d'authentification réussie  | connexionWalletSucces  |
