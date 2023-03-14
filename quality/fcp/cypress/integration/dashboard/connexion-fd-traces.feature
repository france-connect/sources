#language: fr
@userDashboard @historiqueConnexion @ignoreInteg01 @ignoreHigh @ignoreLow
Fonctionnalité: Historique Connexion sur FC Legacy (docker)
  # En tant qu'usager de FranceConnect,
  # je veux me connecter au user-dashboard
  # afin de consulter mon historique de connexion FC Legacy

  Scénario: Connexion d'un usager - scope anonyme
    Etant donné que j'utilise un compte usager "pour les tests de traces"
    Et que j'utilise le fournisseur de service "connecté à FD traces"
    Et que le fournisseur de service requiert l'accès aux informations du scope "connexion_tracks"
    Et que je navigue sur la page fournisseur de service
    Et que je clique sur le bouton FranceConnect
    Et que je suis redirigé vers la page sélection du fournisseur d'identité
    Et que je clique sur le fournisseur d'identité
    Et que je suis redirigé vers la page login du fournisseur d'identité
    Quand je m'authentifie avec succès
    Et je suis redirigé vers la page confirmation de connexion
    Et les informations demandées par le fournisseur de service correspondent au scope "connexion_tracks"
    Et je continue sur le fournisseur de service
    Alors je suis redirigé vers la page fournisseur de service
    Et je suis connecté au fournisseur de service
    Et le fournisseur de service a accès aux traces FranceConnect
