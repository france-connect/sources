#language: fr
@userDashboard @historiqueConnexion
Fonctionnalité: Connexion au FD traces
  # En tant que FS partenaire,
  # je veux contacter le FD traces
  # afin de récupérer l'historique de connexions FranceConnect de l'usager

  @ignoreInteg01
  Scénario: Connexion au FD traces - historique de connexions depuis un FS public
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

  @ignoreInteg01
  Scénario: Connexion au FD traces - historique de connexions depuis un FS privé
    Etant donné que j'utilise un compte usager "pour les tests de traces"
    Et que j'utilise le fournisseur de service "privé connecté à FD traces"
    Et que le fournisseur de service requiert l'accès aux informations du scope "connexion_tracks"
    Et que je navigue sur la page fournisseur de service
    Et que je clique sur le bouton FranceConnect
    Et que je suis redirigé vers la page sélection du fournisseur d'identité
    Et que je clique sur le fournisseur d'identité
    Et que je suis redirigé vers la page login du fournisseur d'identité
    Quand je m'authentifie avec succès
    Et je suis redirigé vers la page confirmation de connexion
    Et les informations demandées par le fournisseur de service correspondent au scope "connexion_tracks"
    Et je consens à transmettre mes informations au fournisseur de service
    Et je continue sur le fournisseur de service
    Alors je suis redirigé vers la page fournisseur de service
    Et je suis connecté au fournisseur de service
    Et le fournisseur de service a accès aux traces FranceConnect

  # Utiliser l'usager par défaut pour avoir des traces FC et FC+
  @ignoreDocker
  Scénario: Connexion au FD traces - historique de connexions depuis un FS privé (integ01)
    Etant donné que j'utilise un compte usager "par défaut"
    Et que j'utilise le fournisseur de service "privé connecté à FD traces"
    Et que le fournisseur de service requiert l'accès aux informations du scope "connexion_tracks"
    Et que je navigue sur la page fournisseur de service
    Et que je clique sur le bouton FranceConnect
    Et que je suis redirigé vers la page sélection du fournisseur d'identité
    Et que je clique sur le fournisseur d'identité
    Et que je suis redirigé vers la page login du fournisseur d'identité
    Quand je m'authentifie avec succès
    Et je suis redirigé vers la page confirmation de connexion
    Et les informations demandées par le fournisseur de service correspondent au scope "connexion_tracks"
    Et je consens à transmettre mes informations au fournisseur de service
    Et je continue sur le fournisseur de service
    Alors je suis redirigé vers la page fournisseur de service
    Et je suis connecté au fournisseur de service
    Et le fournisseur de service a accès aux traces FranceConnect
