#language:fr
@fournisseursServiceConfigurationListe @ci
Fonctionnalité: Liste des configurations de fournisseur de service

  Scénario: Liste des configurations de fournisseur de service - liste vide
    Etant donné que je réinitialise la base de données pour les tests de configuration
    Et que j'utilise un compte partenaire "pour les tests de configuration"
    Et que je navigue sur la page d'accueil du site partenaire
    Et que je me connecte au site partenaire
    Et que je suis redirigé vers la page liste des fournisseurs de service
    Et que 1 fournisseur de service est affiché
    Et que le nom du 1er fournisseur de service est affiché
    Quand je clique sur le 1er fournisseur de service
    Alors je suis redirigé vers la page détail d'un fournisseur de service en mode édition
    Et aucune configuration de test n'est listée
    Et le bouton ajouter une configuration de test est affiché

  Scénario: Liste des configurations de fournisseur de service - ajout de la première configuration
    Etant donné que j'utilise un compte partenaire "pour les tests de configuration"
    Et que je navigue sur la page d'accueil du site partenaire
    Et que je me connecte au site partenaire
    Et que je suis redirigé vers la page liste des fournisseurs de service
    Et que 1 fournisseur de service est affiché
    Et que le nom du 1er fournisseur de service est affiché
    Et que je clique sur le 1er fournisseur de service
    Et que je suis redirigé vers la page détail d'un fournisseur de service en mode édition
    Et qu' aucune configuration de test n'est listée
    Quand je clique sur le bouton ajouter une configuration de test
    Alors 1 configuration de test est listée
    Et le nom de la 1ère configuration de test est "Configuration de test N°1"

  Scénario: Liste des configurations de fournisseur de service - ajout d'une nième configuration
    Etant donné que j'utilise un compte partenaire "pour les tests de configuration"
    Et que je navigue sur la page d'accueil du site partenaire
    Et que je me connecte au site partenaire
    Et que je suis redirigé vers la page liste des fournisseurs de service
    Et que 1 fournisseur de service est affiché
    Et que le nom du 1er fournisseur de service est affiché
    Et que je clique sur le 1er fournisseur de service
    Et que je suis redirigé vers la page détail d'un fournisseur de service en mode édition
    Et que 1 configuration de test est listée
    Quand je clique sur le bouton ajouter une configuration de test
    Alors 2 configurations de test sont listées
    Et le nom de la 1ère configuration de test est "Configuration de test N°1"
    Et le nom de la 2ème configuration de test est "Configuration de test N°2"

  Scénario: Liste des configurations de fournisseur de service - liste avec plusieurs configurations
    Etant donné que j'utilise un compte partenaire "pour les tests de configuration"
    Et que je navigue sur la page d'accueil du site partenaire
    Et que je me connecte au site partenaire
    Et que je suis redirigé vers la page liste des fournisseurs de service
    Et que 1 fournisseur de service est affiché
    Et que le nom du 1er fournisseur de service est affiché
    Quand je clique sur le 1er fournisseur de service
    Alors je suis redirigé vers la page détail d'un fournisseur de service en mode édition
    Et 2 configurations de test sont listées
    Et le nom de la 1ère configuration de test est "Configuration de test N°1"
    Et le nom de la 2ème configuration de test est "Configuration de test N°2"
