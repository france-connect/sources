#language: fr
@eidasBridge @connexionEidasBridge
Fonctionnalité: Connexion eIDAS - FS français
  # En tant qu'usager,
  # je veux utiliser mon identité vérifiée par un fournisseur d'identité européen
  # afin d'accéder à mon fournisseur de service français

  @ci
  Scénario: Connexion FS français - avec claim AMR eidas
    Etant donné que j'utilise un compte usager "pour les tests eidas-bridge"
    Et que le fournisseur de service requiert le claim "amr"
    Et que le fournisseur de service requiert l'accès aux informations des scopes "eidas"
    Et que je navigue sur la page fournisseur de service
    Et que je clique sur le bouton FranceConnect
    Et que je suis redirigé vers la page sélection du fournisseur d'identité
    Et que j'utilise le fournisseur d'identité "eidas-bridge"
    Et que je clique sur le fournisseur d'identité
    Et que je suis redirigé vers la page sélection du pays
    Et que je clique sur le pays "Mock Node"
    Quand je m'authentifie avec succès sur le fournisseur d'identité étranger
    Et je suis redirigé vers la page confirmation de connexion
    Et je continue sur le fournisseur de service
    Alors je suis redirigé vers la page fournisseur de service
    Et je suis connecté au fournisseur de service
    Et la cinématique a utilisé le niveau de sécurité "eidas2"
    Et le fournisseur de service a accès aux informations des scopes "eidas"
    Et la cinématique a renvoyé l'amr "eidas"

  @ci
  Scénario: Connexion FS français - affiche le consentement en anglais
    Etant donné que j'utilise un compte usager "pour les tests eidas-bridge"
    Et que je navigue sur la page fournisseur de service
    Et que je clique sur le bouton FranceConnect
    Et que je suis redirigé vers la page sélection du fournisseur d'identité
    Et que j'utilise le fournisseur d'identité "eidas-bridge"
    Et que je clique sur le fournisseur d'identité
    Et que je suis redirigé vers la page sélection du pays
    Et que je clique sur le pays "Mock Node"
    Quand je m'authentifie avec succès sur le fournisseur d'identité étranger
    Alors je suis redirigé vers la page confirmation de connexion
    Et la page est en "anglais"

  @ci
  Scénario: Connexion FS français - erreur absence de consentement des attributs obligatoires
    Etant donné que j'utilise un compte usager "pour les tests eidas-bridge"
    Et que le fournisseur de service requiert le claim "amr"
    Et que je navigue sur la page fournisseur de service
    Et que je clique sur le bouton FranceConnect
    Et que je suis redirigé vers la page sélection du fournisseur d'identité
    Et que j'utilise le fournisseur d'identité "eidas-bridge"
    Et que je clique sur le fournisseur d'identité
    Et que je suis redirigé vers la page sélection du pays
    Et que je clique sur le pays "Mock Node"
    Quand j'annule l'authentification sur le fournisseur d'identité étranger lors du "consentement des attributs obligatoires"
    Alors je suis redirigé vers la page sélection du fournisseur d'identité
    Et le message d'erreur est présent sur la mire
    Et le refus d'authentification eidas est "Consent not given for a mandatory attribute."

  Scénario: Connexion FS français - erreur absence de consentement des attributs optionnels
    Etant donné que j'utilise un compte usager "pour les tests eidas-bridge"
    Et que le fournisseur de service requiert le claim "amr"
    Et que je navigue sur la page fournisseur de service
    Et que je clique sur le bouton FranceConnect
    Et que je suis redirigé vers la page sélection du fournisseur d'identité
    Et que j'utilise le fournisseur d'identité "eidas-bridge"
    Et que je clique sur le fournisseur d'identité
    Et que je suis redirigé vers la page sélection du pays
    Et que je clique sur le pays "Mock Node"
    Quand j'annule l'authentification sur le fournisseur d'identité étranger lors du "consentement des attributs optionnels"
    Alors je suis redirigé vers la page sélection du fournisseur d'identité
    Et le message d'erreur est présent sur la mire
    Et le refus d'authentification eidas est "Consent not given for a mandatory attribute."

  Scénario: Connexion FS français - erreur absence de confirmation du consentement
    Etant donné que j'utilise un compte usager "pour les tests eidas-bridge"
    Et que le fournisseur de service requiert le claim "amr"
    Et que je navigue sur la page fournisseur de service
    Et que je clique sur le bouton FranceConnect
    Et que je suis redirigé vers la page sélection du fournisseur d'identité
    Et que j'utilise le fournisseur d'identité "eidas-bridge"
    Et que je clique sur le fournisseur d'identité
    Et que je suis redirigé vers la page sélection du pays
    Et que je clique sur le pays "Mock Node"
    Quand j'annule l'authentification sur le fournisseur d'identité étranger lors de la "confirmation du consentement"
    Alors je suis redirigé vers la page sélection du fournisseur d'identité
    Et le message d'erreur est présent sur la mire
    Et le refus d'authentification eidas est "Citizen consent not given."

  Plan du Scénario: Connexion FS français - spAcr <spAcr> - erreur niveau de garantie <levelOfAssurance> inférieure au niveau attendu <minExpectedLevelOfAssurance>
    Etant donné que j'utilise un compte usager "pour les tests eidas-bridge"
    Et que le fournisseur de service requiert un niveau de sécurité "<spAcr>"
    Et que je navigue sur la page fournisseur de service
    Et que je clique sur le bouton FranceConnect
    Et que je suis redirigé vers la page sélection du fournisseur d'identité
    Et que j'utilise le fournisseur d'identité "eidas-bridge"
    Et que je clique sur le fournisseur d'identité
    Et que je suis redirigé vers la page sélection du pays
    Et que je clique sur le pays "Mock Node"
    Quand je m'authentifie avec succès sur le fournisseur d'identité étranger avec un niveau de garantie "<levelOfAssurance>"
    Alors je suis redirigé vers la page sélection du fournisseur d'identité
    Et le message d'erreur est présent sur la mire
    Et l'erreur d'authentification eidas est "202019 - Incorrect Level of Assurance in IdP response"

    Exemples:
      | spAcr  | levelOfAssurance | minExpectedLevelOfAssurance |
      | eidas2 | A                | C                           |
      | eidas2 | B                | C                           |
      | eidas3 | A                | E                           |
      | eidas3 | B                | E                           |
      | eidas3 | C                | E                           |
      | eidas3 | D                | E                           |

  Plan du Scénario: Connexion FS français - spAcr <spAcr> - niveau de garantie <levelOfAssurance> accepté
    Etant donné que j'utilise un compte usager "pour les tests eidas-bridge"
    Et que le fournisseur de service requiert un niveau de sécurité "<spAcr>"
    Et que je navigue sur la page fournisseur de service
    Et que je clique sur le bouton FranceConnect
    Et que je suis redirigé vers la page sélection du fournisseur d'identité
    Et que j'utilise le fournisseur d'identité "eidas-bridge"
    Et que je clique sur le fournisseur d'identité
    Et que je suis redirigé vers la page sélection du pays
    Et que je clique sur le pays "Mock Node"
    Quand je m'authentifie avec succès sur le fournisseur d'identité étranger avec un niveau de garantie "<levelOfAssurance>"
    Et je suis redirigé vers la page confirmation de connexion
    Et je continue sur le fournisseur de service
    Alors je suis redirigé vers la page fournisseur de service
    Et je suis connecté au fournisseur de service
    Et la cinématique a utilisé le niveau de sécurité "<acrValue>"

    Exemples:
      | spAcr  | levelOfAssurance | acrValue |
      | eidas2 | C                | eidas2   |
      | eidas2 | D                | eidas2   |
      | eidas2 | E                | eidas3   |
      | eidas3 | E                | eidas3   |
