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
    Alors je suis redirigé vers la page d'erreur eidas-bridge
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
    Alors je suis redirigé vers la page d'erreur eidas-bridge
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
    Alors je suis redirigé vers la page d'erreur eidas-bridge
    Et le refus d'authentification eidas est "Citizen consent not given."

  Scénario: Connexion FS français - erreur niveau de garantie inférieure au niveau attendu
    Etant donné que j'utilise un compte usager "pour les tests eidas-bridge"
    Et que le fournisseur de service requiert le claim "amr"
    Et que je navigue sur la page fournisseur de service
    Et que je clique sur le bouton FranceConnect
    Et que je suis redirigé vers la page sélection du fournisseur d'identité
    Et que j'utilise le fournisseur d'identité "eidas-bridge"
    Et que je clique sur le fournisseur d'identité
    Et que je suis redirigé vers la page sélection du pays
    Et que je clique sur le pays "Mock Node"
    Quand je m'authentifie avec succès sur le fournisseur d'identité étranger avec un niveau de garantie "A"
    Alors je suis redirigé vers la page d'erreur eidas-bridge
    Et l'erreur d'authentification eidas est "202019 - Incorrect Level of Assurance in IdP response"
