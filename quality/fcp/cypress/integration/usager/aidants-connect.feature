#language: fr
@usager @aidantsConnect @ci
Fonctionnalité: Aidants Connect
  # En tant qu'usager d'un fournisseur de service,
  # je veux utiliser Aidants Connect
  # afin de me connecter au service

  @fcpHigh
  Scénario: Aidants Connect non présent dans le footer
    Etant donné que je navigue sur la page fournisseur de service
    Quand je clique sur le bouton FranceConnect
    Alors je suis redirigé vers la page sélection du fournisseur d'identité
    Et le lien Aidants Connect n'est pas affiché dans le footer

  @fcpLow
  Scénario: Connexion via lien Aidants Connect depuis le footer
    Etant donné que j'utilise un fournisseur d'identité "Aidants Connect"
    Et que je navigue sur la page fournisseur de service
    Et que je clique sur le bouton FranceConnect
    Et que je suis redirigé vers la page sélection du fournisseur d'identité
    Et que le lien Aidants Connect est affiché dans le footer
    Quand je clique sur le lien Aidants Connect
    Alors je suis redirigé vers la page login du fournisseur d'identité
