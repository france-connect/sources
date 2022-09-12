#language:fr
@fournisseursServiceListe @ci
Fonctionnalité: Liste des fournisseurs de service

  Scénario: Liste des fournisseurs de service - aucun FS
    Etant donné que j'utilise un compte partenaire "sans fournisseur de service"
    Et que je navigue sur la page d'accueil du site partenaire
    Quand je me connecte au site partenaire
    Alors je suis redirigé vers la page liste des fournisseurs de service
    Et aucun fournisseur de service n'est affiché
    Et le titre de la page liste des fournisseurs de service est "Aucun fournisseur de service"
    Et le message d'erreur "vous n'avez aucun fournisseur de service" est affiché

  Scénario: Liste des fournisseurs de service - un FS
    Etant donné que j'utilise un compte partenaire "avec 1 fournisseur de service"
    Et que je navigue sur la page d'accueil du site partenaire
    Quand je me connecte au site partenaire
    Alors je suis redirigé vers la page liste des fournisseurs de service
    Et 1 fournisseur de service est affiché
    Et le titre de la page liste des fournisseurs de service est "Mon fournisseur de service"
    Et le nom du 1er fournisseur de service est affiché
    Et l'organisation du 1er fournisseur de service est affichée
    Et la plateforme du 1er fournisseur de service est affichée
    Et le numéro datapass du 1er fournisseur de service est affiché
    Et le date de création du 1er fournisseur de service est affichée
    Et l'état du 1er fournisseur de service est affiché
    Et les informations du fournisseur de service de l'utilisateur sont affichées

  Scénario: Liste des fournisseurs de service - plusieurs FS
    Etant donné que j'utilise un compte partenaire "avec 2 fournisseurs de service"
    Et que je navigue sur la page d'accueil du site partenaire
    Quand je me connecte au site partenaire
    Alors je suis redirigé vers la page liste des fournisseurs de service
    Et 2 fournisseurs de service sont affichés
    Et le titre de la page liste des fournisseurs de service est "Mes fournisseurs de service (2)"
    Et les informations des fournisseurs de service de l'utilisateur sont affichées

  Scénario: Liste des fournisseurs de service - tous les états de FS
    Etant donné que j'utilise un compte partenaire "avec tous les statuts de fournisseurs de service"
    Et que je navigue sur la page d'accueil du site partenaire
    Quand je me connecte au site partenaire
    Alors je suis redirigé vers la page liste des fournisseurs de service
    Et 10 fournisseurs de service sont affichés
    Et le titre de la page liste des fournisseurs de service est "Mes fournisseurs de service (10)"
    Et les informations des fournisseurs de service de l'utilisateur sont affichées
