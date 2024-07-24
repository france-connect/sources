#language: fr
@usager @connexionPromptNone @ci
Fonctionnalité: Connexion avec prompt none

  Scénario: Connexion avec prompt none - SSO ok
    Etant donné que j'utilise un fournisseur de service "avec accès au FI par défaut (premier FS)"
    Et que j'utilise le fournisseur d'identité "par défaut"
    Et que je navigue sur la page fournisseur de service
    Et que je me connecte à AgentConnect
    Et que je suis redirigé vers la page fournisseur de service
    Et que je suis connecté au fournisseur de service
    Et que j'utilise un fournisseur de service "avec accès au FI par défaut (deuxième FS)"
    Et que je navigue sur la page fournisseur de service
    Et que je rentre "none" dans le champ prompt
    Quand je clique sur le bouton AgentConnect
    Alors je suis redirigé vers la page fournisseur de service
    Et je suis connecté au fournisseur de service

  @ignoreInteg01
  Scénario: Connexion avec prompt none - deuxième FS sans accès au FI
    Etant donné que j'utilise un fournisseur de service "avec accès exclusif à un FI"
    Et que j'utilise le fournisseur d'identité "disponible que pour un FS"
    Et que je navigue sur la page fournisseur de service
    Et que je me connecte à AgentConnect
    Et que je suis redirigé vers la page fournisseur de service
    Et que je suis connecté au fournisseur de service
    Et que j'utilise un fournisseur de service "par défaut"
    Et que je navigue sur la page fournisseur de service
    Et que je rentre "none" dans le champ prompt
    Quand je clique sur le bouton AgentConnect
    Alors je suis redirigé vers la page fournisseur de service
    Et le titre de l'erreur fournisseur de service est "login_required"
    Et la description de l'erreur fournisseur de service est "End-User authentication is required"

  Scénario: Connexion avec prompt none - SSO désactivé pour le deuxième FS
    Etant donné que je désactive le SSO pour le fournisseur de service "avec accès au FI par défaut (premier FS)"
    Et que j'utilise un fournisseur de service "avec accès au FI par défaut (deuxième FS)"
    Et que j'utilise le fournisseur d'identité "par défaut"
    Et que je navigue sur la page fournisseur de service
    Et que je me connecte à AgentConnect
    Et que je suis redirigé vers la page fournisseur de service
    Et que je suis connecté au fournisseur de service
    Et que j'utilise un fournisseur de service "avec accès au FI par défaut (premier FS)"
    Et que je navigue sur la page fournisseur de service
    Et que je rentre "none" dans le champ prompt
    Quand je clique sur le bouton AgentConnect
    Alors je suis redirigé vers la page fournisseur de service
    Et le titre de l'erreur fournisseur de service est "login_required"
    Et la description de l'erreur fournisseur de service est "End-User authentication is required"
    # Réactiver le SSO sur le FS en fin de scénario
    Et j'active le SSO pour le fournisseur de service "avec accès au FI par défaut (premier FS)"
