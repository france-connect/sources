#language: fr
@usager @interactionErrorMessage @ci
Fonctionnalité: Message d'erreur sur la mire
  # En tant qu'usager FranceConnect,
  # je veux être informé par un message d'erreur sur la mire
  # quand il y a une impossiblité de me connecter avec le FI choisi

  Scénario: TA01 - Retour en erreur du FI avec retour chez le FS
    Etant donné que je navigue sur la page fournisseur de service
    Et que je clique sur le bouton FranceConnect
    Et que je suis redirigé vers la page sélection du fournisseur d'identité
    Et que je clique sur le fournisseur d'identité
    Et que je suis redirigé vers la page login du fournisseur d'identité
    Quand je clique sur le lien retour vers FC depuis un FI
    Alors je suis redirigé vers la page sélection du fournisseur d'identité
    Et le message d'erreur est présent sur la mire

  Scénario: TA02 - Retour en erreur du FI avec connexion au même FI
    Etant donné que je navigue sur la page fournisseur de service
    Et que je clique sur le bouton FranceConnect
    Et que je suis redirigé vers la page sélection du fournisseur d'identité
    Et que je clique sur le fournisseur d'identité
    Et que je clique sur le lien retour vers FC depuis un FI
    Et que je suis redirigé vers la page sélection du fournisseur d'identité
    Et que le message d'erreur est présent sur la mire
    Quand je clique sur le fournisseur d'identité
    Alors je suis redirigé vers la page login du fournisseur d'identité
    Et je m'authentifie avec succès
    Et je suis redirigé vers la page confirmation de connexion
    Et je continue sur le fournisseur de service
    Et je suis redirigé vers la page fournisseur de service
    Et je suis connecté au fournisseur de service

  Scénario: TA03 - Retour en erreur du FI avec connexion au autre FI
    Etant donné que je navigue sur la page fournisseur de service
    Et que je navigue sur la page fournisseur de service
    Et que je clique sur le bouton FranceConnect
    Et que je suis redirigé vers la page sélection du fournisseur d'identité
    Et que j'utilise un fournisseur d'identité "par défaut"
    Et que je clique sur le fournisseur d'identité
    Et que je clique sur le lien retour vers FC depuis un FI
    Et que je suis redirigé vers la page sélection du fournisseur d'identité
    Et que le message d'erreur est présent sur la mire
    Quand j'utilise un fournisseur d'identité "différent"
    Et je clique sur le fournisseur d'identité
    Alors je suis redirigé vers la page login du fournisseur d'identité
    Et je m'authentifie avec succès
    Et je suis redirigé vers la page confirmation de connexion
    Et je continue sur le fournisseur de service
    Et je suis redirigé vers la page fournisseur de service
    Et je suis connecté au fournisseur de service