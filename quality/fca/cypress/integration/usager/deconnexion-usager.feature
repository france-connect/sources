#language: fr
@usager @deconnexionUsager @ci
Fonctionnalité: Deconnexion Usager
  # En tant qu'usager d'un fournisseur de service,
  # je veux me déconnecter du fournisseur de service, d'agent connect et du fournisseur d'identité
  # afin de clore ma session

  @ignore
  Scénario: Deconnexion d'un usager
    Etant donné que le fournisseur de service requiert l'accès aux informations du scope "tous les scopes"
    Et que je navigue sur la page fournisseur de service
    Et que je clique sur le bouton AgentConnect
    Et que je suis redirigé vers la page interaction
    Et que j'utilise un fournisseur d'identité "actif"
    Et que j'entre l'email "test@fia1.fr"
    Et que je clique sur le bouton de connexion
    Et que je suis redirigé vers la page login du fournisseur d'identité
    Et que je m'authentifie avec succès
    Et que je suis redirigé vers la page fournisseur de service
    Et que je suis connecté au fournisseur de service
    Quand je me déconnecte du fournisseur de service
    Alors je suis déconnecté du fournisseur d'identité
    Et la session AgentConnect est détruite
    Et je suis déconnecté du fournisseur de service
    Et je suis redirigé vers la page fournisseur de service
    Et le cookie "fc_session_id" est supprimé

  @ignoreInteg01
  Scénario: Deconnexion d'un usager avec log métier
    Etant donné que le fournisseur de service requiert l'accès aux informations du scope "tous les scopes"
    Et que je navigue sur la page fournisseur de service
    Et que je clique sur le bouton AgentConnect
    Et que je suis redirigé vers la page interaction
    Et que j'utilise un fournisseur d'identité "actif"
    Et que j'entre l'email "test@fia1.fr"
    Et que je clique sur le bouton de connexion
    Et que je suis redirigé vers la page login du fournisseur d'identité
    Et que je m'authentifie avec succès
    Et que je suis redirigé vers la page fournisseur de service
    Et que je suis connecté au fournisseur de service
    Quand je me déconnecte du fournisseur de service
    Alors je suis déconnecté du fournisseur d'identité
    Et la session AgentConnect est détruite
    Et je suis déconnecté du fournisseur de service
    Et je suis redirigé vers la page fournisseur de service
    Et le cookie "fc_session_id" est supprimé
    Et l'événement "SP_REQUESTED_LOGOUT" est journalisé
    Et l'événement "FC_REQUESTED_LOGOUT_FROM_IDP" est journalisé
    Et l'événement "FC_SESSION_TERMINATED" est journalisé

  @ignoreInteg01
  Scénario: Deconnexion d'un usager avec un fs sans redirection post logout redirect uri
    Etant donné que j'utilise un fournisseur de service "avec accès au FI par défaut (deuxième FS)"
    Et que je navigue sur la page fournisseur de service
    Et que je clique sur le bouton AgentConnect
    Et que je suis redirigé vers la page interaction
    Et que j'utilise un fournisseur d'identité "actif"
    Et que j'entre l'email "test@fia1.fr"
    Et que je clique sur le bouton de connexion
    Et que je suis redirigé vers la page login du fournisseur d'identité
    Et que je m'authentifie avec succès
    Et que je suis redirigé vers la page fournisseur de service
    Et que je suis connecté au fournisseur de service
    Quand je me déconnecte du fournisseur de service
    Alors la session AgentConnect est détruite
    Et je suis redirigé vers la page confirmation de déconnexion
    Et l'événement "SP_REQUESTED_LOGOUT" est journalisé
    Et l'événement "FC_REQUESTED_LOGOUT_FROM_IDP" est journalisé
    Et l'événement "FC_SESSION_TERMINATED" est journalisé

  @ignoreDocker
  Scénario: Deconnexion d'un usager avec log métier
    Etant donné que le fournisseur de service requiert l'accès aux informations du scope "tous les scopes"
    Et que je navigue sur la page fournisseur de service
    Et que je clique sur le bouton AgentConnect
    Et que je suis redirigé vers la page interaction
    Et que j'utilise un fournisseur d'identité "actif"
    Et que j'entre l'email "test@fia1.fr"
    Et que je clique sur le bouton de connexion
    Et que je suis redirigé vers la page login du fournisseur d'identité
    Et que je m'authentifie avec succès
    Et que je suis redirigé vers la page fournisseur de service
    Et que je suis connecté au fournisseur de service
    Quand je me déconnecte du fournisseur de service
    Alors je suis déconnecté du fournisseur d'identité
    Et la session AgentConnect est détruite
    Et je suis déconnecté du fournisseur de service
    Et je suis redirigé vers la page fournisseur de service