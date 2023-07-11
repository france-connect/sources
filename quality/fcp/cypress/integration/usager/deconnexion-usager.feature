#language: fr
@usager @fcpLow @deconnexionUsager @ci
Fonctionnalité: Deconnexion Usager
  # En tant qu'usager d'un fournisseur de service,
  # je veux me déconnecter du fournisseur de service, de FranceConnect et du fournisseur d'identité
  # afin de clore ma session

  Scénario: Deconnexion d'un usager (FI avec endSessionUrl)
    Etant donné que le fournisseur de service requiert l'accès aux informations du scope "tous les scopes"
    Et que je navigue sur la page fournisseur de service
    Et que je clique sur le bouton FranceConnect
    Et que je suis redirigé vers la page sélection du fournisseur d'identité
    Et que j'utilise un fournisseur d'identité "actif"
    Et que je clique sur le fournisseur d'identité
    Et que je suis redirigé vers la page login du fournisseur d'identité
    Et que je m'authentifie avec succès
    Et que je suis redirigé vers la page confirmation de connexion
    Et que je continue sur le fournisseur de service
    Et que je suis connecté au fournisseur de service
    Quand je me déconnecte du fournisseur de service et du fournisseur d'identité
    Alors je suis déconnecté du fournisseur d'identité
    Et la session FranceConnect est détruite
    Et je suis déconnecté du fournisseur de service

  Scénario: Deconnexion d'un usager (FI sans endSessionUrl)
    Etant donné que le fournisseur de service requiert l'accès aux informations du scope "tous les scopes"
    Et que je navigue sur la page fournisseur de service
    Et que je clique sur le bouton FranceConnect
    Et que je suis redirigé vers la page sélection du fournisseur d'identité
    Et que j'utilise un fournisseur d'identité "sans endSessionUrl"
    Et que je clique sur le fournisseur d'identité
    Et que je suis redirigé vers la page login du fournisseur d'identité
    Et que je m'authentifie avec succès
    Et que je suis redirigé vers la page confirmation de connexion
    Et que je continue sur le fournisseur de service
    Et que je suis connecté au fournisseur de service
    Quand je me déconnecte du fournisseur de service et de FranceConnect
    Alors je suis déconnecté de FranceConnect
    Et la session FranceConnect est détruite
    Et je suis déconnecté du fournisseur de service
