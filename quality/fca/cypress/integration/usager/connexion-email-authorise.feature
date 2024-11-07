#language: fr
@usager @connexionEmailAuthorise @ci
Fonctionnalité: Connexion Usager - Email autorisé
  # En tant qu'agent,
  # je ne peux pas pas me connecter avec certains emails via certains FS

  @ignoreInteg01
  Scénario: Connexion à un FS qui limite les emails avec un email authorisé
    Etant donné que le fournisseur de service ne requiert pas le claim "amr"
    Et que j'utilise un fournisseur de service "avec une restriction de fqdn"
    Et que le fournisseur de service requiert l'accès aux informations du scope "obligatoires"
    Et que je navigue sur la page fournisseur de service
    Et que je clique sur le bouton AgentConnect
    Et que je suis redirigé vers la page interaction
    Et que j'entre l'email "fqdnautorise@fia1.fr"
    Et que je clique sur le bouton de connexion
    Et que je suis redirigé vers la page login du fournisseur d'identité
    Quand je m'authentifie avec succès
    Alors je suis redirigé vers la page fournisseur de service
    Et je suis connecté au fournisseur de service

  @ignoreInteg01
  Scénario: Connexion à un FS qui limite les email avec un email non authorisé
    Etant donné que le fournisseur de service ne requiert pas le claim "amr"
    Et que j'utilise un fournisseur de service "avec une restriction de fqdn"
    Et que le fournisseur de service requiert l'accès aux informations du scope "obligatoires"
    Et que je navigue sur la page fournisseur de service
    Et que je clique sur le bouton AgentConnect
    Et que je suis redirigé vers la page interaction
    Et que j'entre l'email "test@nonautorise.fr"
    Quand je clique sur le bouton de connexion
    Alors je suis redirigé vers la page erreur technique
    Et le code d'erreur est "Y500025"
