#language: fr
@usager @token @ci
Fonctionnalité: Connexion Usager - Token
  # En tant qu'usager,
  # je souhaite que mes données de session soient accessibles tant que mon token est valide
  # afin de continuer à utiliser mes données depuis mon fournisseur de service

  Scénario: Token non valide après révocation
    Etant donné que je navigue sur la page fournisseur de service
    Et que je me connecte à AgentConnect
    Et que je suis redirigé vers la page fournisseur de service
    Et que je suis connecté au fournisseur de service
    Quand je révoque le token AgentConnect
    Et le token AgentConnect est révoqué
    Et je redemande les informations de l'usager
    Alors je suis redirigé vers la page erreur du fournisseur de service
    Et le titre de l'erreur fournisseur de service est "invalid_token"
    Et la description de l'erreur fournisseur de service est "invalid token provided"
