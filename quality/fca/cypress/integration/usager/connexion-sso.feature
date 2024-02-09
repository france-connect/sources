#language: fr
@usager @connexionSSO @ci
Fonctionnalité: Connexion Usager - SSO
  # En tant qu'agent,
  # je souhaite bénéficier d'une authentification unique sur AgentConnect
  # afin de naviguer sur différents FS sans avoir à me ré-authentifier

  Scénario: Connexion SSO - deux FS avec accès au même FI
    Etant donné que j'utilise un fournisseur de service "avec accès au FI par défaut (premier FS)"
    Et que j'utilise le fournisseur d'identité "par défaut"
    Et que je navigue sur la page fournisseur de service
    Et que je me connecte à AgentConnect
    Et que je suis redirigé vers la page fournisseur de service
    Et que je suis connecté au fournisseur de service
    Et que j'utilise un fournisseur de service "avec accès au FI par défaut (deuxième FS)"
    Et que je navigue sur la page fournisseur de service
    Quand je clique sur le bouton AgentConnect
    Alors je suis redirigé vers la page fournisseur de service
    Et je suis connecté au fournisseur de service

  @ignoreInteg01
  Scénario: Connexion SSO - deuxième FS sans accès au FI
    Etant donné que j'utilise un fournisseur de service "avec accès exclusif à un FI"
    Et que j'utilise le fournisseur d'identité "disponible que pour un FS"
    Et que je navigue sur la page fournisseur de service
    Et que je me connecte à AgentConnect
    Et que je suis redirigé vers la page fournisseur de service
    Et que je suis connecté au fournisseur de service
    Et que j'utilise un fournisseur de service "par défaut"
    Et que je navigue sur la page fournisseur de service
    Quand je clique sur le bouton AgentConnect
    Et que je suis redirigé vers la page interaction
    Et que j'entre l'email "test@fia8.fr"
    Et que je clique sur le bouton de connexion
    Alors je suis redirigé vers la page erreur technique
    Et le code d'erreur est "Y020023"

  @ignoreInteg01
  Scénario: Connexion SSO - deuxième FS utilise un autre FI
    Etant donné que j'utilise un fournisseur de service "avec accès exclusif à un FI"
    Et que j'utilise le fournisseur d'identité "disponible que pour un FS"
    Et que je navigue sur la page fournisseur de service
    Et que je me connecte à AgentConnect
    Et que je suis redirigé vers la page fournisseur de service
    Et que je suis connecté au fournisseur de service
    Et que j'utilise un fournisseur de service "par défaut"
    Et que je navigue sur la page fournisseur de service
    Et que je clique sur le bouton AgentConnect
    Et que je suis redirigé vers la page interaction
    Et que j'utilise un fournisseur d'identité "par défaut"
    Et que j'entre l'email "test@fia1.fr"
    Et que je clique sur le bouton de connexion
    Et que je suis redirigé vers la page login du fournisseur d'identité
    Quand je m'authentifie avec succès
    Alors je suis redirigé vers la page fournisseur de service
    Et je suis connecté au fournisseur de service

  @ignoreInteg01
  Scénario: Connexion SSO - troisième FS utilise SSO après une cinématique non terminée
    Etant donné que j'utilise un fournisseur de service "avec accès au FI par défaut (premier FS)"
    Et que j'utilise le fournisseur d'identité "par défaut"
    Et que je navigue sur la page fournisseur de service
    Et que je me connecte à AgentConnect
    Et que je suis redirigé vers la page fournisseur de service
    Et que je suis connecté au fournisseur de service
    Et que j'utilise un fournisseur de service "sans accès au FI par défaut"
    Et que je navigue sur la page fournisseur de service
    Et que je clique sur le bouton AgentConnect
    Et que je suis redirigé vers la page interaction
    Et que j'utilise un fournisseur de service "avec accès au FI par défaut (deuxième FS)"
    Et que je navigue sur la page fournisseur de service
    Quand je clique sur le bouton AgentConnect
    Alors je suis redirigé vers la page fournisseur de service
    Et je suis connecté au fournisseur de service

  # Il faut modifier le FS mock pour pouvoir avoir un état connecté/déconnecté
  @ignoreInteg01
  Scénario: Connexion SSO - déconnexion d'un FS seulement et SSO terminé
    Etant donné que j'utilise un fournisseur de service "avec accès au FI par défaut (premier FS)"
    Et que j'utilise le fournisseur d'identité "par défaut"
    Et que je navigue sur la page fournisseur de service
    Et que je me connecte à AgentConnect
    Et que je suis redirigé vers la page fournisseur de service
    Et que je suis connecté au fournisseur de service
    Et que j'utilise un fournisseur de service "avec accès au FI par défaut (deuxième FS)"
    Et que je navigue sur la page fournisseur de service
    Et que je clique sur le bouton AgentConnect
    Et que je suis redirigé vers la page fournisseur de service
    Et que je suis connecté au fournisseur de service
    Et que j'utilise un fournisseur de service "avec accès au FI par défaut (premier FS)"
    Et que je navigue sur la page fournisseur de service
    Et que je suis connecté au fournisseur de service
    Quand je me déconnecte du fournisseur de service
    Alors je suis déconnecté du fournisseur de service
    Et je clique sur le bouton AgentConnect
    Et je suis redirigé vers la page interaction
    Et j'utilise un fournisseur de service "avec accès au FI par défaut (deuxième FS)"
    Et je navigue sur la page fournisseur de service
    Et je suis connecté au fournisseur de service

  # Il faut modifier le FS mock pour pouvoir avoir un état connecté/déconnecté
  # bloqué par https://gitlab.dev-franceconnect.fr/france-connect/fc/-/issues/1213
  @ignoreInteg01
  Scénario: Connexion SSO - déconnexion de plusieurs FS
    Etant donné que j'utilise un fournisseur de service "avec accès au FI par défaut (premier FS)"
    Et que j'utilise le fournisseur d'identité "par défaut"
    Et que le fournisseur de service requiert l'accès aux informations du scope "obligatoires"
    Et que je navigue sur la page fournisseur de service
    Et que je me connecte à AgentConnect
    Et que je suis redirigé vers la page fournisseur de service
    Et que je suis connecté au fournisseur de service
    Et que j'utilise un fournisseur de service "avec accès au FI par défaut (troisième FS)"
    Et que je navigue sur la page fournisseur de service
    Et que je clique sur le bouton AgentConnect
    Et que je suis redirigé vers la page fournisseur de service
    Et que je suis connecté au fournisseur de service
    Et que j'utilise un fournisseur de service "avec accès au FI par défaut (premier FS)"
    Et que je navigue sur la page fournisseur de service
    Et que je suis connecté au fournisseur de service
    Et que je me déconnecte du fournisseur de service
    Et que je suis déconnecté du fournisseur de service
    Et que j'utilise un fournisseur de service "avec accès au FI par défaut (troisième FS)"
    Et que je navigue sur la page fournisseur de service
    Et que je suis connecté au fournisseur de service
    Quand je me déconnecte du fournisseur de service
    Alors je suis déconnecté du fournisseur de service
    Et je clique sur le bouton AgentConnect
    Et je suis redirigé vers la page interaction

  Scénario: Connexion SSO - SSO désactivé pour le deuxième FS
    Etant donné que je désactive le SSO pour le fournisseur de service "avec accès au FI par défaut (premier FS)"
    Et que j'utilise un fournisseur de service "avec accès au FI par défaut (deuxième FS)"
    Et que j'utilise le fournisseur d'identité "par défaut"
    Et que je navigue sur la page fournisseur de service
    Et que je me connecte à AgentConnect
    Et que je suis redirigé vers la page fournisseur de service
    Et que je suis connecté au fournisseur de service
    Et que j'utilise un fournisseur de service "avec accès au FI par défaut (premier FS)"
    Et que je navigue sur la page fournisseur de service
    Quand je clique sur le bouton AgentConnect
    Alors je suis redirigé vers la page interaction

  Scénario: Connexion SSO - SSO réactivé pour le deuxième FS
    Etant donné que j'active le SSO pour le fournisseur de service "avec accès au FI par défaut (premier FS)"
    Et que j'utilise un fournisseur de service "avec accès au FI par défaut (deuxième FS)"
    Et que j'utilise le fournisseur d'identité "par défaut"
    Et que je navigue sur la page fournisseur de service
    Et que je me connecte à AgentConnect
    Et que je suis redirigé vers la page fournisseur de service
    Et que je suis connecté au fournisseur de service
    Et que j'utilise un fournisseur de service "avec accès au FI par défaut (premier FS)"
    Et que je navigue sur la page fournisseur de service
    Quand je clique sur le bouton AgentConnect
    Alors je suis redirigé vers la page fournisseur de service
    Et je suis connecté au fournisseur de service
