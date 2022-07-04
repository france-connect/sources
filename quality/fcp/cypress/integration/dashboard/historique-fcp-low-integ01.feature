#language: fr
@userDashboard @historiqueConnexion @ignoreDocker @ignoreHigh @ignoreLow
Fonctionnalité: Historique Connexion sur FC Legacy (integ01)
  # En tant qu'usager de FranceConnect,
  # je veux me connecter au user-dashboard sur integ01
  # afin de consulter mon historique de connexion FC Legacy

  Scénario: Historique Connexion - FC Legacy - FS public avec scope identité
    Etant donné que j'utilise un compte usager "pour les tests de traces"
    Et que le fournisseur de service requiert l'accès aux informations du scope "tous les scopes"
    Et que j'utilise le fournisseur de service "par défaut"
    Et que j'ai fait une cinématique FranceConnect Legacy
    Et que je navigue sur la page d'accueil du dashboard usager
    Quand je me connecte au dashboard usager
    Alors je suis redirigé vers la page historique du dashboard usager
    Quand j'affiche le détail du dernier évènement "Connexion" sur "FranceConnect" du fournisseur de service "Service Provider Example - Authentication"
    Alors la plateforme de l'évènement est "FranceConnect"
    Et le type d'action de l'évènement est "Connexion"
    Et la date de l'évènement correspond à aujourd'hui
    Et le fournisseur de service de l'évènement est "Service Provider Example - Authentication"
    Et la date et heure de connexion correspondent à maintenant
    Et la localisation de l'évènement est affichée
    Et le nom du fournisseur d'identité de l'évènement est "identity-provider-example-faible"
    Et le niveau de sécurité de l'évènement est "Faible"

  @ignore
  Scénario: Historique Connexion - FC Legacy - FS public avec scope data
    Etant donné que j'utilise un compte usager "pour les tests de traces"
    Et que j'utilise le fournisseur de service "pour les scopes data"
    Et que le fournisseur de service requiert l'accès aux informations des scopes "dgfip et cnam"
    Et que j'ai fait une cinématique FranceConnect Legacy
    Et que je navigue sur la page d'accueil du dashboard usager
    Quand je me connecte au dashboard usager
    Alors je suis redirigé vers la page historique du dashboard usager
    Et j'affiche le détail du dernier évènement "Connexion" sur "FranceConnect" du fournisseur de service "Service Provider Example - Data"
    Et la plateforme de l'évènement est "FranceConnect"
    Et le type d'action de l'évènement est "Connexion"
    Et la date de l'évènement correspond à aujourd'hui
    Et le fournisseur de service de l'évènement est "Service Provider Example - Data"
    Et la date et heure de connexion correspondent à maintenant
    Et la localisation de l'évènement est affichée
    Et le nom du fournisseur d'identité de l'évènement est "identity-provider-example-faible"
    Et le niveau de sécurité de l'évènement est "Faible"
    Et j'affiche le détail du dernier évènement "Échange de Données" sur "FranceConnect" du fournisseur de service "Service Provider Example - Data"
    Et la plateforme de l'évènement est "FranceConnect"
    Et le type d'action de l'évènement est "Échange de Données"
    Et la date de l'évènement correspond à aujourd'hui
    Et le fournisseur de service de l'évènement est "Service Provider Example - Data"
    Et la date et heure de l'évènement sont affichées
    Et l'évènement concerne 7 données "FCP_LOW"
    Et les données "FCP_LOW" de l'évènement contiennent "Revenu fiscal de référence (Direction générale des Finances publiques)"
    Et les données "FCP_LOW" de l'évènement contiennent "Nombre de parts du foyer fiscal (Direction générale des Finances publiques)"
    Et les données "FCP_LOW" de l'évènement contiennent "Situation de famille (marié, pacsé, célibataire, veuf divorcé) (Direction générale des Finances publiques)"
    Et les données "FCP_LOW" de l'évènement contiennent "Détail des personnes à charge et rattachées (Direction générale des Finances publiques)"
    Et les données "FCP_LOW" de l'évènement contiennent "Adresse déclarée au 1er Janvier (Direction générale des Finances publiques)"
    Et les données "FCP_LOW" de l'évènement contiennent "Paiements d'indemnités journalières versés par l'Assurance Maladie (Caisse nationale de l'assurance maladie)"
    Et l'évènement concerne aucune donnée "DGFIP"
    Et l'évènement concerne aucune donnée "CNAM"

  @ignore
  Scénario: Historique Connexion - FC Legacy - FS privé avec scope identité
    Etant donné que j'utilise un compte usager "pour les tests de traces"
    Et que j'utilise le fournisseur de service "privé avec consentement obligatoire"
    Et que le fournisseur de service requiert l'accès aux informations des scopes "profile sans preferred_username"
    Et que j'ai fait une cinématique FranceConnect Legacy
    Et que je navigue sur la page d'accueil du dashboard usager
    Quand je me connecte au dashboard usager
    Alors je suis redirigé vers la page historique du dashboard usager
    Et j'affiche le détail du dernier évènement "Connexion" sur "FranceConnect" du fournisseur de service "Service Provider Example - Authentication"
    Et la plateforme de l'évènement est "FranceConnect"
    Et le type d'action de l'évènement est "Connexion"
    Et la date de l'évènement correspond à aujourd'hui
    Et le fournisseur de service de l'évènement est "Service Provider Example - Authentication"
    Et la date et heure de connexion correspondent à maintenant
    Et la localisation de l'évènement est affichée
    Et le nom du fournisseur d'identité de l'évènement est "identity-provider-example-faible"
    Et le niveau de sécurité de l'évènement est "Faible"
    Et j'affiche le détail du dernier évènement "Autorisation" sur "FranceConnect" du fournisseur de service "Service Provider Example - Authentication"
    Et la plateforme de l'évènement est "FranceConnect"
    Et le type d'action de l'évènement est "Autorisation"
    Et la date de l'évènement correspond à aujourd'hui
    Et le fournisseur de service de l'évènement est "Service Provider Example - Authentication"
    Et la date et heure de l'évènement sont affichées
    Et l'évènement concerne 4 données "FCP_LOW"
    Et les données "FCP_LOW" de l'évènement contiennent "Sexe"
    Et les données "FCP_LOW" de l'évènement contiennent "Date de naissance"
    Et les données "FCP_LOW" de l'évènement contiennent "Prénoms"
    Et les données "FCP_LOW" de l'évènement contiennent "Nom de naissance"
    Et l'évènement concerne aucune donnée "DGFIP"
    Et l'évènement concerne aucune donnée "CNAM"

  Scénario: Historique Connexion - FC Legacy - FS privé avec scope data
    Etant donné que j'utilise un compte usager "pour les tests de traces"
    Et que j'utilise le fournisseur de service "pour les scopes data"
    Et que le fournisseur de service requiert l'accès aux informations des scopes "dgfip et cnam"
    Et que j'ai fait une cinématique FranceConnect Legacy
    Et que je navigue sur la page d'accueil du dashboard usager
    Quand je me connecte au dashboard usager
    Alors je suis redirigé vers la page historique du dashboard usager
    Et j'affiche le détail du dernier évènement "Connexion" sur "FranceConnect" du fournisseur de service "Service Provider Example - Data"
    Et la plateforme de l'évènement est "FranceConnect"
    Et le type d'action de l'évènement est "Connexion"
    Et la date de l'évènement correspond à aujourd'hui
    Et le fournisseur de service de l'évènement est "Service Provider Example - Data"
    Et la date et heure de connexion correspondent à maintenant
    Et la localisation de l'évènement est affichée
    Et le nom du fournisseur d'identité de l'évènement est "identity-provider-example-faible"
    Et le niveau de sécurité de l'évènement est "Faible"
    Et j'affiche le détail du dernier évènement "Autorisation" sur "FranceConnect" du fournisseur de service "Service Provider Example - Data"
    Et la plateforme de l'évènement est "FranceConnect"
    Et le type d'action de l'évènement est "Autorisation"
    Et la date de l'évènement correspond à aujourd'hui
    Et le fournisseur de service de l'évènement est "Service Provider Example - Data"
    Et la date et heure de l'évènement sont affichées
    Et l'évènement concerne 6 données "FCP_LOW"
    Et les données "FCP_LOW" de l'évènement contiennent "Revenu fiscal de référence (Direction générale des Finances publiques)"
    Et les données "FCP_LOW" de l'évènement contiennent "Nombre de parts du foyer fiscal (Direction générale des Finances publiques)"
    Et les données "FCP_LOW" de l'évènement contiennent "Situation de famille (marié, pacsé, célibataire, veuf divorcé) (Direction générale des Finances publiques)"
    Et les données "FCP_LOW" de l'évènement contiennent "Détail des personnes à charge et rattachées (Direction générale des Finances publiques)"
    Et les données "FCP_LOW" de l'évènement contiennent "Adresse déclarée au 1er Janvier (Direction générale des Finances publiques)"
    Et les données "FCP_LOW" de l'évènement contiennent "Paiements d'indemnités journalières versés par l'Assurance Maladie (Caisse nationale de l'assurance maladie)"
    Et l'évènement concerne aucune donnée "DGFIP"
    Et l'évènement concerne aucune donnée "CNAM"
    Et j'affiche le détail du dernier évènement "Échange de Données" sur "FranceConnect" du fournisseur de service "Service Provider Example - Data"
    Et la plateforme de l'évènement est "FranceConnect"
    Et le type d'action de l'évènement est "Échange de Données"
    Et la date de l'évènement correspond à aujourd'hui
    Et le fournisseur de service de l'évènement est "Service Provider Example - Data"
    Et la date et heure de l'évènement sont affichées
    Et l'évènement concerne 7 données "FCP_LOW"
    Et les données "FCP_LOW" de l'évènement contiennent "Revenu fiscal de référence (Direction générale des Finances publiques)"
    Et les données "FCP_LOW" de l'évènement contiennent "Nombre de parts du foyer fiscal (Direction générale des Finances publiques)"
    Et les données "FCP_LOW" de l'évènement contiennent "Situation de famille (marié, pacsé, célibataire, veuf divorcé) (Direction générale des Finances publiques)"
    Et les données "FCP_LOW" de l'évènement contiennent "Détail des personnes à charge et rattachées (Direction générale des Finances publiques)"
    Et les données "FCP_LOW" de l'évènement contiennent "Adresse déclarée au 1er Janvier (Direction générale des Finances publiques)"
    Et les données "FCP_LOW" de l'évènement contiennent "Paiements d'indemnités journalières versés par l'Assurance Maladie (Caisse nationale de l'assurance maladie)"
    Et l'évènement concerne aucune donnée "DGFIP"
    Et l'évènement concerne aucune donnée "CNAM"

  @ignore
  Scénario: Historique Connexion - FC Legacy - FS privé avec scope anonyme
    Etant donné que j'utilise un compte usager "pour les tests de traces"
    Et que j'utilise le fournisseur de service "privé avec consentement obligatoire"
    Et que le fournisseur de service requiert l'accès aux informations du scope "anonyme"
    Et que j'ai fait une cinématique FranceConnect Legacy
    Et que je navigue sur la page d'accueil du dashboard usager
    Quand je me connecte au dashboard usager
    Alors je suis redirigé vers la page historique du dashboard usager
    Et j'affiche le détail du dernier évènement "Connexion" sur "FranceConnect" du fournisseur de service "Service Provider Example - Authentication"
    Et la plateforme de l'évènement est "FranceConnect"
    Et le type d'action de l'évènement est "Connexion"
    Et la date de l'évènement correspond à aujourd'hui
    Et le fournisseur de service de l'évènement est "Service Provider Example - Authentication"
    Et la date et heure de connexion correspondent à maintenant
    Et la localisation de l'évènement est affichée
    Et le nom du fournisseur d'identité de l'évènement est "fip1"
    Et le niveau de sécurité de l'évènement est "Faible"
