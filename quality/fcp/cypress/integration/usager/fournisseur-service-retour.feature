#language: fr
@usager @fsRetour @ci
Fonctionnalité: Fournisseur Service - Retour
  # En tant qu'usager,
  # je veux retourner vers le FS
  # afin de recommencer ma cinématique ou choisir un autre moyen de connexion

  Scénario: Fournisseur Service - Retour après abandon de la connexion sur la mire
    Etant donné que je navigue sur la page fournisseur de service
    Et que je clique sur le bouton FranceConnect
    Et que je suis redirigé vers la page sélection du fournisseur d'identité
    Quand je clique sur le lien retour vers le FS sous la mire
    Alors je suis redirigé vers la page erreur du fournisseur de service
    Et le titre de l'erreur fournisseur de service est "access_denied"
    Et la description de l'erreur fournisseur de service est "User auth aborted"

  Scénario: Fournisseur Service - Retour après erreur
    Etant donné que je navigue sur la page fournisseur de service
    Et que je clique sur le bouton FranceConnect
    Et que je suis redirigé vers la page sélection du fournisseur d'identité
    Et que je clique sur le fournisseur d'identité
    Et que je suis redirigé vers la page login du fournisseur d'identité
    Et que je m'authentifie avec "sans_mail"
    Et que je suis redirigé vers la page erreur technique FranceConnect
    Et que le code d'erreur FranceConnect est "Y000006"
    Quand je clique sur le lien retour vers le FS après une erreur
    Alors je suis redirigé vers la page erreur du fournisseur de service
    Et le titre de l'erreur fournisseur de service est "server_error"
    Et la description de l'erreur fournisseur de service est "authentication aborted due to a technical error on the authorization server"
