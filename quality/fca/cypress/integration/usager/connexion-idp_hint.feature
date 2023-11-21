#language: fr
@usager @connexionIdpHint @ci
Fonctionnalité: Connexion Usager - idp_hint
  # En tant que FS,
  # je souhaite forcer l'usager à utilier un FI donné

  @ignoreInteg01
  Scénario: Connexion initiale + SSO avec idp_hint valide
    Etant donné que j'utilise un fournisseur de service "avec accès au FI par défaut (premier FS)"
    Et que j'utilise le fournisseur d'identité "autorisé pour idp_hint"
    Et que je navigue sur la page fournisseur de service
    Quand je rentre l'id du fournisseur d'identité dans le champ idp_hint
    Et que je clique sur le bouton AgentConnect
    Alors je suis redirigé vers la page login du fournisseur d'identité
    Et je m'authentifie avec succès
    Et je suis redirigé vers la page fournisseur de service
    Et je suis connecté au fournisseur de service
    Quand j'utilise un fournisseur de service "avec accès au FI par défaut (deuxième FS)"
    Et que j'utilise le fournisseur d'identité "autorisé pour idp_hint"
    Et que je navigue sur la page fournisseur de service
    Et que je rentre l'id du fournisseur d'identité dans le champ idp_hint
    Et que je clique sur le bouton AgentConnect
    Alors je ne suis pas redirigé vers la page login du fournisseur d'identité
    Et je suis redirigé vers la page fournisseur de service
    Et je suis connecté au fournisseur de service

  Scénario: Connexion avec idp_hint invalide
    Etant donné que j'utilise un fournisseur de service "par défaut"
    Et que j'utilise le fournisseur d'identité "non autorisé pour idp_hint"
    Et que je navigue sur la page fournisseur de service
    Et que je rentre l'id du fournisseur d'identité dans le champ idp_hint
    Quand je clique sur le bouton AgentConnect
    Alors je suis redirigé vers la page erreur du fournisseur de service
    Et le titre de l'erreur fournisseur de service est "invalid_idp_hint"
    Et la description de l'erreur fournisseur de service est "An idp_hint was provided but is not allowed"