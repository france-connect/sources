#language: fr
@usager @affichageFournisseurIdentité @ci @fcpLow
Fonctionnalité: Affichage Fournisseur Identité
  # En tant qu'usager d'un fournisseur de service,
  # je veux visualiser la liste des fournisseurs d'identité disponibles
  # afin de me connecter au service

  Scénario: Connexion d'un usager - erreur connexion abandonnée
    Etant donné que je navigue sur la page fournisseur de service
    Et que je clique sur le bouton FranceConnect
    Et que je suis redirigé vers la page sélection du fournisseur d'identité
    Quand je clique sur le lien retour vers le fournisseur de service
    Alors je suis redirigé vers la page erreur du fournisseur de service
    Et le titre de l'erreur fournisseur de service est "access_denied"
    Et la description de l'erreur fournisseur de service est "User auth aborted"
