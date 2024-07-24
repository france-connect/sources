#language: fr
@usager @fournisseurDonnées @ci
Fonctionnalité: Fournisseur Données
  # En tant que fournisseur de données,
  # je souhaite vérifier la validité d'un access token
  # afin de fournir les données liées aux scopes autorisés pour le fournisseur de service

  Scénario: Checktoken - access token valide avec un scope groups
    Etant donné que j'utilise un fournisseur de service "éligible au scope groups"
    Et que le fournisseur de service requiert l'accès aux informations des scopes "obligatoires et groups"
    Et que je navigue sur la page fournisseur de service
    Et que je me connecte à AgentConnect
    Et que je suis redirigé vers la page fournisseur de service
    Et que je suis connecté au fournisseur de service
    Quand le fournisseur de service demande l'accès aux données au fournisseur de données
    Alors le fournisseur de données vérifie l'access token fourni par le fournisseur de service
    Et le checktoken endpoint envoie un token d'introspection valide
    Et le token d'introspection a une propriété "acr" égale à "eidas1"
    Et le token d'introspection a une propriété "scope" égale à "groups"
    Et le token d'introspection a une propriété "aud" avec le client_id du fournisseur de service
    Et le token d'introspection a une propriété "iat" avec le timestamp de création de l'access token
    Et le token d'introspection a une propriété "exp" avec le timestamp d'expiration de l'access token

  Scénario: Checktoken - access token expiré
    Etant donné que je navigue sur la page fournisseur de service
    Et que je me connecte à AgentConnect
    Et que je suis redirigé vers la page fournisseur de service
    Et que je suis connecté au fournisseur de service
    Quand je révoque le token AgentConnect
    Et le fournisseur de service demande l'accès aux données au fournisseur de données
    Alors le fournisseur de données vérifie l'access token fourni par le fournisseur de service
    Et le checktoken endpoint envoie un token d'introspection expiré

  Scénario: Checktoken - access token aucun scope ne correspond au FD
    Etant donné que le fournisseur de service requiert l'accès aux informations des scopes "obligatoires"
    Et que je navigue sur la page fournisseur de service
    Et que je me connecte à AgentConnect
    Et que je suis redirigé vers la page fournisseur de service
    Et que je suis connecté au fournisseur de service
    Quand le fournisseur de service demande l'accès aux données au fournisseur de données
    Alors le fournisseur de données vérifie l'access token fourni par le fournisseur de service
    Et le checktoken endpoint envoie un token d'introspection valide
    Et le token d'introspection a une propriété "scope" égale à ""
