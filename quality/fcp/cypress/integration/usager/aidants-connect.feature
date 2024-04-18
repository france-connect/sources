#language: fr
@usager @aidantsConnect @ci
Fonctionnalité: Aidants Connect
  # En tant qu'usager d'un fournisseur de service,
  # je veux utiliser Aidants Connect
  # afin de me connecter au service

  @fcpHigh
  Scénario: Aidants Connect non présent sous la mire
    Etant donné que je navigue sur la page fournisseur de service
    Quand je clique sur le bouton FranceConnect
    Alors je suis redirigé vers la page sélection du fournisseur d'identité
    Et le bouton Aidants Connect n'est pas affiché sous la mire

  @fcpLow
  Scénario: Connexion via lien Aidants Connect depuis la mire
    Etant donné que j'utilise un fournisseur d'identité "Aidants Connect"
    Et que je navigue sur la page fournisseur de service
    Et que je clique sur le bouton FranceConnect
    Et que je suis redirigé vers la page sélection du fournisseur d'identité
    Et que le bouton Aidants Connect est affiché sous la mire
    Quand je clique sur le bouton Aidants Connect
    Alors je suis redirigé vers la page login du fournisseur d'identité

  @fcpLow @ignoreInteg01
  Scénario: Aidants Connect est présent sous la mire mais n'est pas actif
    Etant donné que j'utilise le fournisseur de service "sans accès au FI Aidants Connect"
    Et que je navigue sur la page fournisseur de service
    Quand je clique sur le bouton FranceConnect
    Alors je suis redirigé vers la page sélection du fournisseur d'identité
    Et le bouton Aidants Connect est affiché sous la mire
    Et le bouton Aidants Connect n'est pas actif
