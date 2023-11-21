#language: fr
@usager @session @ci @ignoreInteg01
Fonctionnalité: Connexion Usager - session fca-low (avec SSO)
  # En tant qu'usager,
  # je souhaite que mes données de session ne soit accessible que lorsqu'elles sont requises
  # afin d'éviter le vol de mes données personnelles

  Scénario: Session avec SSO activé - Nouvelle session créée lors de l'appel à authorize (1ère connexion)
    Etant donné que j'utilise un fournisseur de service "par défaut"
    Et que j'utilise le fournisseur d'identité "par défaut"
    Et que je navigue sur la page fournisseur de service
    Quand je clique sur le bouton AgentConnect
    Alors je suis redirigé vers la page sélection du fournisseur d'identité
    Et le cookie "fc_session_id" est présent
    Et l'événement "FC_AUTHORIZE_INITIATED" est journalisé avec "browsingSessionId" "non null" et "sessionId" "non null" et "isSso" "false"

  Scénario: Session avec SSO activé - Nouvelle session initialisée lors de l'appel à authorize (2ème connexion)
    Etant donné que j'utilise un fournisseur de service "avec accès au FI par défaut (premier FS)"
    Et que j'utilise le fournisseur d'identité "par défaut"
    Et que je navigue sur la page fournisseur de service
    Et que je me connecte à AgentConnect
    Et que je suis connecté au fournisseur de service
    Et que le cookie "fc_session_id" est présent
    Et que je mémorise la valeur du cookie "fc_session_id"
    # Evènement SP_REQUESTED_FC_USERINFO: première cinématique finalisée
    Et que l'événement "SP_REQUESTED_FC_USERINFO" est journalisé avec "accountId" "non null" et "isSso" "false"
    Et que je mémorise la valeur "browsingSessionId" de l'événement "SP_REQUESTED_FC_USERINFO"
    Et que je mémorise la valeur "sessionId" de l'événement "SP_REQUESTED_FC_USERINFO"
    Et que je mémorise la valeur "accountId" de l'événement "SP_REQUESTED_FC_USERINFO"
    Quand j'utilise un fournisseur de service "avec accès au FI par défaut (deuxième FS)"
    Et je navigue sur la page fournisseur de service
    Et je clique sur le bouton AgentConnect
    Alors je suis redirigé vers la page fournisseur de service
    Et je suis connecté au fournisseur de service
    # le cookie n'est pas supprimé en fin de cinématique
    Et le cookie "fc_session_id" est présent
    Et la valeur du cookie "fc_session_id" est différente
    # Evènement FC_AUTHORIZE_INITIATED: cinématique SSO initialisée avec nouveau sessionId
    Et l'événement "FC_AUTHORIZE_INITIATED" est journalisé avec "accountId" "non null" et "isSso" "true"
    Et la valeur "browsingSessionId" est identique dans l'événement "FC_AUTHORIZE_INITIATED"
    Et la valeur "sessionId" est différente dans l'événement "FC_AUTHORIZE_INITIATED"
    Et la valeur "accountId" est identique dans l'événement "FC_AUTHORIZE_INITIATED"
    Et je mémorise la valeur "sessionId" de l'événement "FC_AUTHORIZE_INITIATED"
    # Evènement FC_DATATRANSFER_INFORMATION_IDENTITY: sessionId non changé
    Et l'événement "FC_AUTHORIZE_INITIATED" est journalisé avec "accountId" "non null" et "isSso" "true"
    Et la valeur "browsingSessionId" est identique dans l'événement "FC_AUTHORIZE_INITIATED"
    Et la valeur "sessionId" est identique dans l'événement "FC_AUTHORIZE_INITIATED"
    Et la valeur "accountId" est identique dans l'événement "FC_AUTHORIZE_INITIATED"
    # Evènement SP_REQUESTED_FC_USERINFO: les données de session sont accessibles depuis le back channel
    Et l'événement "SP_REQUESTED_FC_USERINFO" est journalisé avec "accountId" "non null" et "isSso" "true"
    Et la valeur "browsingSessionId" est identique dans l'événement "SP_REQUESTED_FC_USERINFO"
    Et la valeur "sessionId" est identique dans l'événement "SP_REQUESTED_FC_USERINFO"
    Et la valeur "accountId" est identique dans l'événement "SP_REQUESTED_FC_USERINFO"

  Scénario: Session avec SSO activé - Nouvelle session après retour du FI si FI non disponible
    Etant donné que j'utilise un compte usager "par défaut"
    Et que j'utilise un fournisseur de service "avec accès exclusif à un FI"
    Et que j'utilise le fournisseur d'identité "disponible que pour un FS"
    Et que je navigue sur la page fournisseur de service
    Et que je me connecte à AgentConnect
    Et que je suis redirigé vers la page fournisseur de service
    Et que je suis connecté au fournisseur de service
    Et que le cookie "fc_session_id" est présent
    Et que je mémorise la valeur du cookie "fc_session_id"
    # Evènement SP_REQUESTED_FC_USERINFO: première cinématique finalisée
    Et que l'événement "SP_REQUESTED_FC_USERINFO" est journalisé avec "accountId" "non null" et "isSso" "false"
    Et que je mémorise la valeur "browsingSessionId" de l'événement "SP_REQUESTED_FC_USERINFO"
    Et que je mémorise la valeur "sessionId" de l'événement "SP_REQUESTED_FC_USERINFO"
    Et que je mémorise la valeur "accountId" de l'événement "SP_REQUESTED_FC_USERINFO"
    Et que je mémorise la valeur "idpId" de l'événement "SP_REQUESTED_FC_USERINFO"
    Et que j'utilise un fournisseur de service "par défaut"
    Et que je navigue sur la page fournisseur de service
    Et que je clique sur le bouton AgentConnect
    Et que je suis redirigé vers la page sélection du fournisseur d'identité
    Et que le cookie "fc_session_id" est présent
    Et que la valeur du cookie "fc_session_id" est différente
    Et que je mémorise la valeur du cookie "fc_session_id"
    # Evènement FC_AUTHORIZE_INITIATED: cinématique SSO initialisée dans un premier temps avec nouveau sessionId
    Et que l'événement "FC_AUTHORIZE_INITIATED" est journalisé avec "accountId" "non null" et "isSso" "true"
    Et que la valeur "browsingSessionId" est identique dans l'événement "FC_AUTHORIZE_INITIATED"
    Et que la valeur "sessionId" est différente dans l'événement "FC_AUTHORIZE_INITIATED"
    Et que la valeur "accountId" est identique dans l'événement "FC_AUTHORIZE_INITIATED"
    Et que je mémorise la valeur "sessionId" de l'événement "FC_AUTHORIZE_INITIATED"
    Quand j'utilise un fournisseur d'identité "par défaut"
    Et je cherche le fournisseur d'identité par son nom
    Et je clique sur le fournisseur d'identité
    Et je suis redirigé vers la page login du fournisseur d'identité
    # FC_IDP_BLACKLISTED: l'attribut isSso devient false
    Et l'événement "FC_IDP_BLACKLISTED" est journalisé avec "isSso" "false"
    # Evènement IDP_CHOSEN: les données de session concernant l'usager sont supprimées une fois le FI sélectionné
    Et l'événement "IDP_CHOSEN" est journalisé avec "accountId" "null" et "idpSub" "null" et "isSso" "false"
    Et la valeur "sessionId" est identique dans l'événement "IDP_CHOSEN"
    Et la valeur "idpId" est différente dans l'événement "IDP_CHOSEN"
    Et je mémorise la valeur "idpId" de l'événement "IDP_CHOSEN"
    # J'utilise un compte usager différent pour obtenir un accountId différent
    Et j'utilise un compte usager "différent"
    Et je m'authentifie avec succès
    Alors je suis redirigé vers la page fournisseur de service
    Et je suis connecté au fournisseur de service
    Et le cookie "fc_session_id" est présent
    Et la valeur du cookie "fc_session_id" est différente
    # Evènement IDP_CALLEDBACK: nouveau sessionId lors du retour depuis le FI
    Et l'événement "IDP_CALLEDBACK" est journalisé avec "idpId" "non null" et "accountId" "null" et "isSso" "false"
    Et la valeur "browsingSessionId" est identique dans l'événement "IDP_CALLEDBACK"
    Et la valeur "sessionId" est différente dans l'événement "IDP_CALLEDBACK"
    Et la valeur "idpId" est identique dans l'événement "IDP_CALLEDBACK"
    Et je mémorise la valeur "sessionId" de l'événement "IDP_CALLEDBACK"
    # Evènement FC_VERIFIED: accountId est recalculé
    Et l'événement "FC_VERIFIED" est journalisé avec "accountId" "non null" et "isSso" "false"
    Et la valeur "accountId" est différente dans l'événement "FC_VERIFIED"
    Et je mémorise la valeur "accountId" de l'événement "FC_VERIFIED"
    # Evènement SP_REQUESTED_FC_USERINFO: les données de session sont accessibles depuis le back channel
    Et l'événement "SP_REQUESTED_FC_USERINFO" est journalisé avec "accountId" "non null" et "isSso" "false"
    Et la valeur "browsingSessionId" est identique dans l'événement "SP_REQUESTED_FC_USERINFO"
    Et la valeur "sessionId" est identique dans l'événement "SP_REQUESTED_FC_USERINFO"
    Et la valeur "accountId" est identique dans l'événement "SP_REQUESTED_FC_USERINFO"

  Scénario: Session avec SSO activé - Session non détachée avant le retour au FS
    Etant donné que j'utilise un fournisseur de service "par défaut"
    Et que j'utilise le fournisseur d'identité "par défaut"
    Et que je navigue sur la page fournisseur de service
    Quand je me connecte à AgentConnect
    Alors je suis redirigé vers la page fournisseur de service
    Et je suis connecté au fournisseur de service
    Et le cookie "fc_session_id" est présent

  Scénario: Session avec SSO désactivé - isSso false et nouvelle session après retour du FI
    Etant donné que je désactive le SSO pour le fournisseur de service "avec accès au FI par défaut (premier FS)"
    Et que j'utilise un fournisseur de service "avec accès au FI par défaut (deuxième FS)"
    Et que j'utilise un compte usager "par défaut"
    Et que j'utilise le fournisseur d'identité "par défaut"
    Et que je navigue sur la page fournisseur de service
    Et que je me connecte à AgentConnect
    Et que je suis redirigé vers la page fournisseur de service
    Et que je suis connecté au fournisseur de service
    Et que le cookie "fc_session_id" est présent
    Et que je mémorise la valeur du cookie "fc_session_id"
    # Evènement SP_REQUESTED_FC_USERINFO: première cinématique finalisée
    Et que l'événement "SP_REQUESTED_FC_USERINFO" est journalisé avec "accountId" "non null" et "isSso" "false"
    Et que je mémorise la valeur "browsingSessionId" de l'événement "SP_REQUESTED_FC_USERINFO"
    Et que je mémorise la valeur "sessionId" de l'événement "SP_REQUESTED_FC_USERINFO"
    Et que je mémorise la valeur "accountId" de l'événement "SP_REQUESTED_FC_USERINFO"
    Et que je mémorise la valeur "idpId" de l'événement "SP_REQUESTED_FC_USERINFO"
    Quand j'utilise un fournisseur de service "avec accès au FI par défaut (premier FS)"
    Et j'utilise le fournisseur d'identité "différent"
    Et je navigue sur la page fournisseur de service
    Et je me connecte à AgentConnect
    Alors je suis redirigé vers la page fournisseur de service
    Et je suis connecté au fournisseur de service
    Et le cookie "fc_session_id" est présent
    Et la valeur du cookie "fc_session_id" est différente
    # Evènement FC_AUTHORIZE_INITIATED: cinématique SSO initialisée dans un premier temps
    Et l'événement "FC_AUTHORIZE_INITIATED" est journalisé avec "accountId" "non null" et "isSso" "true"
    Et la valeur "browsingSessionId" est identique dans l'événement "FC_AUTHORIZE_INITIATED"
    Et la valeur "accountId" est identique dans l'événement "FC_AUTHORIZE_INITIATED"
    Et la valeur "sessionId" est différente dans l'événement "FC_AUTHORIZE_INITIATED"
    # SP_DISABLED_SSO: l'attribut isSso devient false
    Et l'événement "SP_DISABLED_SSO" est journalisé avec "isSso" "false"
    # Evènement IDP_CHOSEN: les données de session concernant l'usager sont supprimées une fois le FI sélectionné
    Et l'événement "IDP_CHOSEN" est journalisé avec "accountId" "null" et "idpSub" "null" et "isSso" "false"
    Et la valeur "idpId" est différente dans l'événement "IDP_CHOSEN"
    # Evènement IDP_CALLEDBACK: nouveau sessionId lors du retour depuis le FI
    Et l'événement "IDP_CALLEDBACK" est journalisé avec "accountId" "null" et "idpSub" "null" et "isSso" "false"
    Et la valeur "browsingSessionId" est identique dans l'événement "IDP_CALLEDBACK"
    Et la valeur "sessionId" est différente dans l'événement "IDP_CALLEDBACK"
    # Réactiver le SSO sur le FS en fin de scénario
    Et j'active le SSO pour le fournisseur de service "avec accès au FI par défaut (premier FS)"

  Scénario: Session avec SSO désactivé - SSO possible après cinématique avec FS ayant le SSO désactivé
    Etant donné que je désactive le SSO pour le fournisseur de service "avec accès au FI par défaut (premier FS)"
    Et que j'utilise un fournisseur de service "avec accès au FI par défaut (premier FS)"
    Et que je navigue sur la page fournisseur de service
    Et que je me connecte à AgentConnect
    Et que je suis redirigé vers la page fournisseur de service
    Et que je suis connecté au fournisseur de service
    # Evènement SP_REQUESTED_FC_USERINFO: première cinématique finalisée avec FS ayant désactivé le SSO
    Et que l'événement "SP_REQUESTED_FC_USERINFO" est journalisé avec "isSso" "false"
    Et que je mémorise la valeur "browsingSessionId" de l'événement "SP_REQUESTED_FC_USERINFO"
    Et que je mémorise la valeur "sessionId" de l'événement "SP_REQUESTED_FC_USERINFO"
    Et que je mémorise la valeur "accountId" de l'événement "SP_REQUESTED_FC_USERINFO"
    Et que je mémorise la valeur "idpId" de l'événement "SP_REQUESTED_FC_USERINFO"
    Quand j'utilise un fournisseur de service "avec accès au FI par défaut (deuxième FS)"
    Et je navigue sur la page fournisseur de service
    Et je clique sur le bouton AgentConnect
    Alors je suis redirigé vers la page fournisseur de service
    # Evènement FC_AUTHORIZE_INITIATED: cinématique SSO initialisée
    Et l'événement "FC_AUTHORIZE_INITIATED" est journalisé avec "accountId" "non null" et "isSso" "true"
    Et la valeur "browsingSessionId" est identique dans l'événement "FC_AUTHORIZE_INITIATED"
    Et la valeur "sessionId" est différente dans l'événement "FC_AUTHORIZE_INITIATED"
    Et la valeur "accountId" est identique dans l'événement "FC_AUTHORIZE_INITIATED"
    Et la valeur "idpId" est identique dans l'événement "FC_AUTHORIZE_INITIATED"
    # Réactiver le SSO sur le FS en fin de scénario
    Et j'active le SSO pour le fournisseur de service "avec accès au FI par défaut (premier FS)"
