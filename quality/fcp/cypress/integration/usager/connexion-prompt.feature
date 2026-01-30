#language: fr
@usager @connexionPrompt @fcpLow @fcpHigh @ci @ignoreInteg01
Fonctionnalité: Connexion prompt
  # En tant que fournisseur de service autorisé,
  # je veux utiliser le paramètre OIDC "prompt" avec différentes valeurs,
  # afin de sauter la page de consentement/information et fluidifier l'expérience utilisateur

  Plan du Scénario: Connexion prompt = 'login' - Page de consentement non affichée
    Etant donné que j'utilise le fournisseur de service "avec prompt login uniquement"
    Et que le fournisseur de service requiert l'accès aux informations du scope "tous les scopes"
    Et que je navigue sur la page fournisseur de service
    Et que le fournisseur de service requiert le prompt "login"
    Et que je clique sur le bouton FranceConnect
    Et que je suis redirigé vers la page sélection du fournisseur d'identité
    Et que je clique sur le fournisseur d'identité
    Et que je suis redirigé vers la page login du fournisseur d'identité
    Quand je m'authentifie avec succès
    Alors je suis redirigé vers la page fournisseur de service
    Et je suis connecté au fournisseur de service
    Et le fournisseur de service a accès aux informations du scope "tous les scopes"

  Plan du Scénario: Connexion prompt = '<prompt>' - Page de consentement affichée
    Etant donné que j'utilise le fournisseur de service "<spDescription>"
    Et que le fournisseur de service requiert l'accès aux informations du scope "tous les scopes"
    Et que je navigue sur la page fournisseur de service
    Et que le fournisseur de service requiert le prompt "<prompt>"
    Et que je clique sur le bouton FranceConnect
    Et que je suis redirigé vers la page sélection du fournisseur d'identité
    Et que je clique sur le fournisseur d'identité
    Et que je suis redirigé vers la page login du fournisseur d'identité
    Quand je m'authentifie avec succès
    Alors je suis redirigé vers la page confirmation de connexion
    Et je continue sur le fournisseur de service
    Et je suis connecté au fournisseur de service
    Et le fournisseur de service a accès aux informations du scope "tous les scopes"

    Exemples:
      | spDescription                  | prompt        |
      | avec prompt consent uniquement | consent       |
      | avec prompt login uniquement   | login consent |
