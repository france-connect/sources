#language:fr
@fournisseursServiceDetail @ci
Fonctionnalité: Détail d'un fournisseur de service

  Scénario: Détail d'un fournisseur de service - utilisateur SP_OWNER
    Etant donné que j'utilise un compte partenaire "propriétaire d'un fournisseur de service"
    Et que je navigue sur la page d'accueil du site partenaire
    Et que je me connecte au site partenaire
    Et que je suis redirigé vers la page liste des fournisseurs de service
    Et que 1 fournisseur de service est affiché
    Et que le nom du 1er fournisseur de service est affiché
    Quand je clique sur le 1er fournisseur de service
    Alors je suis redirigé vers la page détail d'un fournisseur de service en mode édition
    Et le nom du fournisseur de service est affiché
    Et la plateforme du fournisseur de service est affichée
    Et l'état du fournisseur de service est affiché

  Scénario: Détail d'un fournisseur de service - utilisateur SP_OBSERVER
    Etant donné que j'utilise un compte partenaire "observateur d'un fournisseur de service"
    Et que je navigue sur la page d'accueil du site partenaire
    Et que je me connecte au site partenaire
    Et que je suis redirigé vers la page liste des fournisseurs de service
    Et que 1 fournisseur de service est affiché
    Et que le nom du 1er fournisseur de service est affiché
    Quand je clique sur le 1er fournisseur de service
    Alors je suis redirigé vers la page détail d'un fournisseur de service en mode consultation
    Et le nom du fournisseur de service est affiché
    Et la plateforme du fournisseur de service est affichée
    Et l'état du fournisseur de service est affiché

  Scénario: Détail d'un fournisseur de service - utilisateur SP_ADMIN
    Etant donné que j'utilise un compte partenaire "administrateur d'un fournisseur de service"
    Et que je navigue sur la page d'accueil du site partenaire
    Et que je me connecte au site partenaire
    Et que je suis redirigé vers la page liste des fournisseurs de service
    Et que 1 fournisseur de service est affiché
    Et que le nom du 1er fournisseur de service est affiché
    Quand je clique sur le 1er fournisseur de service
    Alors je suis redirigé vers la page détail d'un fournisseur de service en mode édition

  Scénario: Détail d'un fournisseur de service - retour sur la liste des FS
    Etant donné que j'utilise un compte partenaire "par défaut"
    Et que je navigue sur la page d'accueil du site partenaire
    Et que je me connecte au site partenaire
    Et que je suis redirigé vers la page liste des fournisseurs de service
    Et que je clique sur le 1er fournisseur de service
    Et que je suis redirigé vers la page détail d'un fournisseur de service en mode édition
    Quand je clique sur le lien retour vers la liste des fournisseurs de service
    Alors je suis redirigé vers la page liste des fournisseurs de service
