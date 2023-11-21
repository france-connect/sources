#language: fr
@eidasBridge @connexionEidasLog
Fonctionnalité: Connexion eIDAS - Log
  # En tant que PO,
  # je veux tracer les cinématiques via eidas-bridge
  # afin de m'assurer de son bon fonctionnement

  Scénario: Connexion FS Européen - logs métiers
    Etant donné que j'utilise un compte usager "par défaut"
    Et que j'utilise le fournisseur de service "eidas-be"
    Et que je navigue sur la page fournisseur de service eidas
    Et que le fournisseur de service requiert l'accès aux informations des scopes "eidas"
    Et que je configure un fournisseur de service sur eidas mock
    Et que je suis redirigé vers la page sélection du fournisseur d'identité
    Et que l'événement eIDAS "INCOMING_EIDAS_REQUEST" est journalisé avec "category" "EU_REQUEST" et "pays destination" "FR"
    Et que l'événement eIDAS "REDIRECT_TO_FC_AUTHORIZE" est journalisé avec "niveau eIDAS demandé" "substantial" et "pays source" "BE"
    Et que j'utilise un fournisseur d'identité "français"
    Et que je clique sur le fournisseur d'identité
    Et que je suis redirigé vers la page login du fournisseur d'identité
    Quand je m'authentifie avec succès
    Et je suis redirigé vers la page confirmation de connexion
    Et je continue sur le fournisseur de service
    Alors l'événement eIDAS "RECEIVED_FC_AUTH_CODE" est journalisé
    Et l'événement eIDAS "REDIRECTING_TO_EIDAS_FR_NODE" est journalisé avec "niveau eIDAS reçu" "substantial" et "sub du FI" "transmis par FC" et "sub du FS" "transmis par FC"
    Et je suis redirigé vers la page fournisseur de service eidas mock
    Et le fournisseur de service eidas mock a accès aux informations des scopes "eidas"
    Et le sub transmis au fournisseur de service eidas commence par "FR/BE"
    Et la cohérence des événements de la cinématique FS "européen" est respectée

  Scénario: Connexion FS français - logs métiers
    Etant donné que j'utilise un compte usager "pour les tests eidas-bridge"
    Et que le fournisseur de service requiert le claim "amr"
    Et que je navigue sur la page fournisseur de service
    Et que je clique sur le bouton FranceConnect
    Et que je suis redirigé vers la page sélection du fournisseur d'identité
    Et que j'utilise le fournisseur d'identité "eidas-bridge"
    Et que je clique sur le fournisseur d'identité
    Et que l'événement eIDAS "INCOMING_FC_REQUEST" est journalisé avec "category" "FR_REQUEST" et "pays source" "FR"
    Et que je suis redirigé vers la page sélection du pays
    Et que l'événement eIDAS "DISPLAYING_CITIZEN_COUNTRY_CHOICE" est journalisé avec "niveau eIDAS demandé" "substantial"
    Et que je clique sur le pays "Mock Node"
    Et que l'événement eIDAS "SELECTED_CITIZEN_COUNTRY" est journalisé avec "pays destination" "CB"
    Et l'événement eIDAS "REDIRECTING_TO_FR_NODE" est journalisé
    Quand je m'authentifie avec succès sur le fournisseur d'identité étranger
    Et l'événement eIDAS "INCOMING_EIDAS_RESPONSE" est journalisé
    Et l'événement eIDAS "REDIRECT_TO_FC" est journalisé avec "niveau eIDAS reçu" "substantial" et "sub du FI" "transmis par eIDAS" et "sub du FS" "transmis par eIDAS"
    Et je suis redirigé vers la page confirmation de connexion
    Et l'événement eIDAS "RECEIVED_CALL_ON_TOKEN" est journalisé
    Et l'événement eIDAS "RECEIVED_CALL_ON_USERINFO" est journalisé
    Et je continue sur le fournisseur de service
    Alors je suis redirigé vers la page fournisseur de service
    Et je suis connecté au fournisseur de service
    Et la cinématique a utilisé le niveau de sécurité "eidas2"
    Et le fournisseur de service a accès aux informations des scopes "eidas"
    Et la cinématique a renvoyé l'amr "eidas"
    Et la cohérence des événements de la cinématique FS "français" est respectée
