#language: fr
@usager @session @fcpHigh @ci @ignoreInteg01
Fonctionnalité: Connexion Usager - session fcp-high (sans SSO)
  # En tant qu'usager,
  # je souhaite que mes données de session ne soit accessible que lorsqu'elles sont requises
  # afin d'éviter le vol de mes données personnelles

  Scénario: Session sans SSO - Nouvelle session vide lors de l'appel à authorize (1ère connexion)
    Etant donné que j'utilise un fournisseur de service "par défaut"
    Et que j'utilise le fournisseur d'identité "par défaut"
    Et que je navigue sur la page fournisseur de service
    Quand je clique sur le bouton FranceConnect
    Alors je suis redirigé vers la page sélection du fournisseur d'identité
    Et le cookie "fc_session_id" est présent
    Et l'événement "FC_AUTHORIZE_INITIATED" est journalisé avec "browsingSessionId" "non null" et "sessionId" "non null" et "isSso" "false"

  Scénario: Session sans SSO - Nouvelle session vide lors d'un nouvel appel à authorize (2ème connexion)
    Etant donné que j'utilise un fournisseur de service "public"
    Et que j'utilise le fournisseur d'identité "par défaut"
    Et que je navigue sur la page fournisseur de service
    Et que je me connecte à FranceConnect
    Et que je suis connecté au fournisseur de service
    # Evénement SP_REQUESTED_FC_USERINFO: première cinématique finalisée
    Et que l'événement "SP_REQUESTED_FC_USERINFO" est journalisé avec "accountId" "non null" et "isSso" "false"
    Et que je mémorise la valeur "browsingSessionId" de l'événement "SP_REQUESTED_FC_USERINFO"
    Et que je mémorise la valeur "sessionId" de l'événement "SP_REQUESTED_FC_USERINFO"
    # J'utilise un autre fournisseur de service
    Quand j'utilise un fournisseur de service "privé avec consentement obligatoire"
    Et le fournisseur de service requiert l'accès aux informations du scope "anonyme"
    Et je navigue sur la page fournisseur de service
    Et je clique sur le bouton FranceConnect
    Alors je suis redirigé vers la page sélection du fournisseur d'identité
    # Evénement FC_AUTHORIZE_INITIATED: nouvelle session sans SSO
    Et l'événement "FC_AUTHORIZE_INITIATED" est journalisé avec "accountId" "null" et "isSso" "false"
    Et la valeur "browsingSessionId" est différente dans l'événement "FC_AUTHORIZE_INITIATED"
    Et la valeur "sessionId" est différente dans l'événement "FC_AUTHORIZE_INITIATED"

  Scénario: Session sans SSO - SessionId changé après retour du FI
    Etant donné que j'utilise un fournisseur de service "par défaut"
    Et que j'utilise le fournisseur d'identité "par défaut"
    Et que je navigue sur la page fournisseur de service
    Et que je clique sur le bouton FranceConnect
    Et que je suis redirigé vers la page sélection du fournisseur d'identité
    Et que je mémorise la valeur du cookie "fc_session_id"
    # Evénement FC_AUTHORIZE_INITIATED: cinématique initialisée
    Et que je mémorise la valeur "browsingSessionId" de l'événement "FC_AUTHORIZE_INITIATED"
    Et que je mémorise la valeur "sessionId" de l'événement "FC_AUTHORIZE_INITIATED"
    Et que je clique sur le fournisseur d'identité
    Et que je suis redirigé vers la page login du fournisseur d'identité
    Quand je m'authentifie avec succès
    Alors je suis redirigé vers la page d'information
    Et la valeur du cookie "fc_session_id" est différente
    # Evènement IDP_CALLEDBACK: nouveau sessionId lors du retour depuis le FI
    Et la valeur "browsingSessionId" est identique dans l'événement "IDP_CALLEDBACK"
    Et la valeur "sessionId" est différente dans l'événement "IDP_CALLEDBACK"

  Scénario: Session sans SSO - Session détachée lors du retour au FS
    Etant donné que j'utilise un fournisseur de service "par défaut"
    Et que j'utilise le fournisseur d'identité "par défaut"
    Et que je navigue sur la page fournisseur de service
    Et que je clique sur le bouton FranceConnect
    Et que je suis redirigé vers la page sélection du fournisseur d'identité
    Et que je clique sur le fournisseur d'identité
    Et que je suis redirigé vers la page login du fournisseur d'identité
    Et que je m'authentifie avec succès
    Et que je suis redirigé vers la page confirmation de connexion
    Et que le cookie "fc_session_id" est présent
    # Evènement FC_VERIFIED: je mémorise les données de session avec le retour vers le FS
    Et que l'événement "FC_VERIFIED" est journalisé avec "accountId" "non null"
    Et que je mémorise la valeur "browsingSessionId" de l'événement "FC_VERIFIED"
    Et que je mémorise la valeur "sessionId" de l'événement "FC_VERIFIED"
    Et que je mémorise la valeur "accountId" de l'événement "FC_VERIFIED"
    Quand je continue sur le fournisseur de service
    Alors je suis redirigé vers la page fournisseur de service
    Et je suis connecté au fournisseur de service
    # le cookie est supprimé en fin de cinématique
    Et le cookie "fc_session_id" est supprimé
    # Evènement FC_DATATRANSFER_INFORMATION_IDENTITY: sessionId non changé
    Et l'événement "FC_DATATRANSFER_INFORMATION_IDENTITY" est journalisé
    Et la valeur "browsingSessionId" est identique dans l'événement "FC_DATATRANSFER_INFORMATION_IDENTITY"
    Et la valeur "sessionId" est identique dans l'événement "FC_DATATRANSFER_INFORMATION_IDENTITY"
    Et la valeur "accountId" est identique dans l'événement "FC_DATATRANSFER_INFORMATION_IDENTITY"
    # Evènement SP_REQUESTED_FC_USERINFO: les données de session sont accessibles depuis le back channel
    Et l'événement "SP_REQUESTED_FC_USERINFO" est journalisé
    Et la valeur "browsingSessionId" est identique dans l'événement "SP_REQUESTED_FC_USERINFO"
    Et la valeur "sessionId" est identique dans l'événement "SP_REQUESTED_FC_USERINFO"
    Et la valeur "accountId" est identique dans l'événement "SP_REQUESTED_FC_USERINFO"
