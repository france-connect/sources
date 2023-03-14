#language: fr
@userDashboard @historiqueConnexion @ignoreInteg01 @ignoreHigh @ignoreLow
Fonctionnalité: Historique Connexion sur FC Legacy (docker)
  # En tant qu'usager de FranceConnect,
  # je veux me connecter au user-dashboard
  # afin de consulter mon historique de connexion FC Legacy

  Scénario: Historique Connexion - FC Legacy - FS public avec scope identité
    Etant donné que j'utilise un compte usager "pour les tests de traces"
    Et que le fournisseur de service requiert l'accès aux informations du scope "tous les scopes"
    Et que j'utilise le fournisseur de service "par défaut"
    Et que j'ai fait une cinématique FranceConnect
    Et que les traces sont récupérées dans elasticsearch
    Et que je navigue sur la page d'accueil du dashboard usager
    Quand je me connecte au dashboard usager
    Alors je suis redirigé vers la page historique du dashboard usager
    Et 1 évènement "FranceConnect" est affiché
    Et j'affiche le détail du dernier évènement "Connexion" sur "FranceConnect" du fournisseur de service "Service Provider Example"
    Et la plateforme de l'évènement est "FranceConnect"
    Et le type d'action de l'évènement est "Connexion"
    Et la date de l'évènement correspond à aujourd'hui
    Et le fournisseur de service de l'évènement est "Service Provider Example"
    Et la date et heure de connexion correspondent à maintenant
    Et la localisation de l'évènement n'est pas affichée
    Et le nom du fournisseur d'identité de l'évènement est "Identity Provider - eIDAS élevé"
    Et le niveau de sécurité de l'évènement est "Faible"

  Scénario: Historique Connexion - FC Legacy - FS public avec scope data
    Etant donné que j'utilise un compte usager "pour les tests de traces"
    Et que j'utilise le fournisseur de service "pour les scopes data"
    Et que le fournisseur de service requiert l'accès aux informations des scopes "dgfip et cnam"
    Et que j'ai fait une cinématique FranceConnect
    Et que les traces sont récupérées dans elasticsearch
    Et que je navigue sur la page d'accueil du dashboard usager
    Quand je me connecte au dashboard usager
    Alors je suis redirigé vers la page historique du dashboard usager
    Et 2 évènements "FranceConnect" sont affichés
    Et j'affiche le détail du dernier évènement "Connexion" sur "FranceConnect" du fournisseur de service "Service Provider Example"
    Et la plateforme de l'évènement est "FranceConnect"
    Et le type d'action de l'évènement est "Connexion"
    Et la date de l'évènement correspond à aujourd'hui
    Et le fournisseur de service de l'évènement est "Service Provider Example"
    Et la date et heure de connexion correspondent à maintenant
    Et la localisation de l'évènement n'est pas affichée
    Et le nom du fournisseur d'identité de l'évènement est "Identity Provider - eIDAS élevé"
    Et le niveau de sécurité de l'évènement est "Faible"
    Et j'affiche le détail du dernier évènement "Échange de Données" sur "FranceConnect" du fournisseur de service "Service Provider Example"
    Et la plateforme de l'évènement est "FranceConnect"
    Et le type d'action de l'évènement est "Échange de Données"
    Et la date de l'évènement correspond à aujourd'hui
    Et le fournisseur de service de l'évènement est "Service Provider Example"
    Et la date et heure de l'évènement correspondent à maintenant
    Et l'évènement concerne aucune donnée "FCP_LOW"
    Et l'évènement concerne 5 données "DGFIP"
    Et les données "DGFIP" de l'évènement contiennent "Revenu fiscal de référence"
    Et les données "DGFIP" de l'évènement contiennent "Nombre de parts du foyer fiscal"
    Et les données "DGFIP" de l'évènement contiennent "Situation de famille (marié, pacsé, célibataire, veuf divorcé)"
    Et les données "DGFIP" de l'évènement contiennent "Détail des personnes à charge et rattachées"
    Et les données "DGFIP" de l'évènement contiennent "Adresse déclarée au 1er Janvier"
    Et l'évènement concerne 1 donnée "CNAM"
    Et les données "CNAM" de l'évènement contiennent "Paiements d'indemnités journalières versés par l’Assurance Maladie"

  Scénario: Historique Connexion - FC Legacy - FS public avec scope traces
    Etant donné que j'utilise un compte usager "pour les tests de traces"
    Et que j'utilise le fournisseur de service "connecté à FD traces"
    Et que le fournisseur de service requiert l'accès aux informations du scope "connexion_tracks"
    Et que j'ai fait une cinématique FranceConnect
    Et que les traces sont récupérées dans elasticsearch
    Et que je navigue sur la page d'accueil du dashboard usager
    Quand je me connecte au dashboard usager
    Alors je suis redirigé vers la page historique du dashboard usager
    Et 2 évènements "FranceConnect" sont affichés
    Et j'affiche le détail du dernier évènement "Connexion" sur "FranceConnect" du fournisseur de service "Service Provider Example"
    Et la plateforme de l'évènement est "FranceConnect"
    Et le type d'action de l'évènement est "Connexion"
    Et la date de l'évènement correspond à aujourd'hui
    Et le fournisseur de service de l'évènement est "Service Provider Example"
    Et la date et heure de connexion correspondent à maintenant
    Et la localisation de l'évènement n'est pas affichée
    Et le nom du fournisseur d'identité de l'évènement est "Identity Provider - eIDAS élevé"
    Et le niveau de sécurité de l'évènement est "Faible"
    Et j'affiche le détail du dernier évènement "Échange de Données" sur "FranceConnect" du fournisseur de service "Service Provider Example"
    Et la plateforme de l'évènement est "FranceConnect"
    Et le type d'action de l'évènement est "Échange de Données"
    Et la date de l'évènement correspond à aujourd'hui
    Et le fournisseur de service de l'évènement est "Service Provider Example"
    Et la date et heure de l'évènement correspondent à maintenant
    Et l'évènement concerne aucune donnée "FCP_LOW"

  Scénario: Historique Connexion - FC Legacy - FS privé avec scope identité
    Etant donné que j'utilise un compte usager "pour les tests de traces"
    Et que j'utilise le fournisseur de service "privé avec consentement obligatoire"
    Et que le fournisseur de service requiert l'accès aux informations des scopes "profile sans preferred_username"
    Et que j'ai fait une cinématique FranceConnect
    Et que les traces sont récupérées dans elasticsearch
    Et que je navigue sur la page d'accueil du dashboard usager
    Quand je me connecte au dashboard usager
    Alors je suis redirigé vers la page historique du dashboard usager
    Et 2 évènements "FranceConnect" sont affichés
    Et j'affiche le détail du dernier évènement "Connexion" sur "FranceConnect" du fournisseur de service "Virtual Private Service Provider for Consent"
    Et la plateforme de l'évènement est "FranceConnect"
    Et le type d'action de l'évènement est "Connexion"
    Et la date de l'évènement correspond à aujourd'hui
    Et le fournisseur de service de l'évènement est "Virtual Private Service Provider for Consent"
    Et la date et heure de connexion correspondent à maintenant
    Et la localisation de l'évènement n'est pas affichée
    Et le nom du fournisseur d'identité de l'évènement est "Identity Provider - eIDAS élevé"
    Et le niveau de sécurité de l'évènement est "Faible"
    Et j'affiche le détail du dernier évènement "Autorisation" sur "FranceConnect" du fournisseur de service "Virtual Private Service Provider for Consent"
    Et la plateforme de l'évènement est "FranceConnect"
    Et le type d'action de l'évènement est "Autorisation"
    Et la date de l'évènement correspond à aujourd'hui
    Et le fournisseur de service de l'évènement est "Virtual Private Service Provider for Consent"
    Et la date et heure de l'évènement correspondent à maintenant
    Et l'évènement concerne 4 données "FCP_LOW"
    Et les données "FCP_LOW" de l'évènement contiennent "Sexe"
    Et les données "FCP_LOW" de l'évènement contiennent "Date de naissance"
    Et les données "FCP_LOW" de l'évènement contiennent "Prénom(s)"
    Et les données "FCP_LOW" de l'évènement contiennent "Nom de naissance"
    Et l'évènement concerne aucune donnée "DGFIP"
    Et l'évènement concerne aucune donnée "CNAM"

  Scénario: Historique Connexion - FC Legacy - FS privé avec scope data
    Etant donné que j'utilise un compte usager "pour les tests de traces"
    Et que j'utilise le fournisseur de service "privé pour les scopes data"
    Et que le fournisseur de service requiert l'accès aux informations des scopes "dgfip et cnam"
    Et que j'ai fait une cinématique FranceConnect
    Et que les traces sont récupérées dans elasticsearch
    Et que je navigue sur la page d'accueil du dashboard usager
    Quand je me connecte au dashboard usager
    Alors je suis redirigé vers la page historique du dashboard usager
    Et 3 évènements "FranceConnect" sont affichés
    Et j'affiche le détail du dernier évènement "Connexion" sur "FranceConnect" du fournisseur de service "Virtual Private Service Provider for Consent"
    Et la plateforme de l'évènement est "FranceConnect"
    Et le type d'action de l'évènement est "Connexion"
    Et la date de l'évènement correspond à aujourd'hui
    Et le fournisseur de service de l'évènement est "Virtual Private Service Provider for Consent"
    Et la date et heure de connexion correspondent à maintenant
    Et la localisation de l'évènement n'est pas affichée
    Et le nom du fournisseur d'identité de l'évènement est "Identity Provider - eIDAS élevé"
    Et le niveau de sécurité de l'évènement est "Faible"
    Et j'affiche le détail du dernier évènement "Autorisation" sur "FranceConnect" du fournisseur de service "Virtual Private Service Provider for Consent"
    Et la plateforme de l'évènement est "FranceConnect"
    Et le type d'action de l'évènement est "Autorisation"
    Et la date de l'évènement correspond à aujourd'hui
    Et le fournisseur de service de l'évènement est "Virtual Private Service Provider for Consent"
    Et la date et heure de l'évènement correspondent à maintenant
    Et l'évènement concerne aucune donnée "FCP_LOW"
    Et l'évènement concerne 5 données "DGFIP"
    Et les données "DGFIP" de l'évènement contiennent "Revenu fiscal de référence"
    Et les données "DGFIP" de l'évènement contiennent "Nombre de parts du foyer fiscal"
    Et les données "DGFIP" de l'évènement contiennent "Situation de famille (marié, pacsé, célibataire, veuf divorcé)"
    Et les données "DGFIP" de l'évènement contiennent "Détail des personnes à charge et rattachées"
    Et les données "DGFIP" de l'évènement contiennent "Adresse déclarée au 1er Janvier"
    Et l'évènement concerne 1 donnée "CNAM"
    Et les données "CNAM" de l'évènement contiennent "Paiements d'indemnités journalières versés par l’Assurance Maladie"
    Et j'affiche le détail du dernier évènement "Échange de Données" sur "FranceConnect" du fournisseur de service "Virtual Private Service Provider for Consent"
    Et la plateforme de l'évènement est "FranceConnect"
    Et le type d'action de l'évènement est "Échange de Données"
    Et la date de l'évènement correspond à aujourd'hui
    Et le fournisseur de service de l'évènement est "Virtual Private Service Provider for Consent"
    Et la date et heure de l'évènement correspondent à maintenant
    Et l'évènement concerne aucune donnée "FCP_LOW"
    Et l'évènement concerne 5 données "DGFIP"
    Et les données "DGFIP" de l'évènement contiennent "Revenu fiscal de référence"
    Et les données "DGFIP" de l'évènement contiennent "Nombre de parts du foyer fiscal"
    Et les données "DGFIP" de l'évènement contiennent "Situation de famille (marié, pacsé, célibataire, veuf divorcé)"
    Et les données "DGFIP" de l'évènement contiennent "Détail des personnes à charge et rattachées"
    Et les données "DGFIP" de l'évènement contiennent "Adresse déclarée au 1er Janvier"
    Et l'évènement concerne 1 donnée "CNAM"
    Et les données "CNAM" de l'évènement contiennent "Paiements d'indemnités journalières versés par l’Assurance Maladie"

  Scénario: Historique Connexion - FC Legacy - FS privé avec scope data pour chaque FD
    Etant donné que j'utilise un compte usager "pour les tests de traces"
    Et que j'utilise le fournisseur de service "privé pour les scopes data"
    Et que le fournisseur de service requiert l'accès aux informations des scopes "scopes de tous les FD"
    Et que j'ai fait une cinématique FranceConnect
    Et que les traces sont récupérées dans elasticsearch
    Et que je navigue sur la page d'accueil du dashboard usager
    Quand je me connecte au dashboard usager
    Alors je suis redirigé vers la page historique du dashboard usager
    Et 4 évènements "FranceConnect" sont affichés
    Et j'affiche le détail du dernier évènement "Connexion" sur "FranceConnect" du fournisseur de service "Virtual Private Service Provider for Consent"
    Et la plateforme de l'évènement est "FranceConnect"
    Et le type d'action de l'évènement est "Connexion"
    Et la date de l'évènement correspond à aujourd'hui
    Et le fournisseur de service de l'évènement est "Virtual Private Service Provider for Consent"
    Et la date et heure de connexion correspondent à maintenant
    Et la localisation de l'évènement n'est pas affichée
    Et le nom du fournisseur d'identité de l'évènement est "Identity Provider - eIDAS élevé"
    Et le niveau de sécurité de l'évènement est "Faible"
    Et j'affiche le détail du 1er évènement "Autorisation" sur "FranceConnect" du fournisseur de service "Virtual Private Service Provider for Consent"
    Et la plateforme de l'évènement est "FranceConnect"
    Et le type d'action de l'évènement est "Autorisation"
    Et la date de l'évènement correspond à aujourd'hui
    Et le fournisseur de service de l'évènement est "Virtual Private Service Provider for Consent"
    Et la date et heure de l'évènement correspondent à maintenant
    Et l'évènement concerne aucune donnée "FCP_LOW"
    Et l'évènement concerne aucune donnée "FCP_HIGH"
    Et l'évènement concerne 1 donnée "DGFIP"
    Et les données "DGFIP" de l'évènement contiennent "Revenu fiscal de référence"
    Et l'évènement concerne 1 donnée "CNAM"
    Et les données "CNAM" de l'évènement contiennent "Paiements d'indemnités journalières versés par l’Assurance Maladie"
    Et l'évènement concerne 1 donnée "MI"
    Et les données "MI" de l'évènement contiennent "Informations de la carte grise: Titulaire et véhicule"
    Et l'évènement concerne 1 donnée "MESRI"
    Et les données "MESRI" de l'évènement contiennent "Identifiant national étudiant"
    Et l'évènement concerne 1 donnée "CNOUS"
    Et les données "CNOUS" de l'évènement contiennent "Statut boursier"
    Et l'évènement concerne 1 donnée "PE"
    Et les données "PE" de l'évènement contiennent "Indemnités de Pôle emploi"
    Et j'affiche le détail du 2ème évènement "Autorisation" sur "FranceConnect" du fournisseur de service "Virtual Private Service Provider for Consent"
    Et la plateforme de l'évènement est "FranceConnect"
    Et le type d'action de l'évènement est "Autorisation"
    Et la date de l'évènement correspond à aujourd'hui
    Et le fournisseur de service de l'évènement est "Virtual Private Service Provider for Consent"
    Et la date et heure de l'évènement correspondent à maintenant
    Et l'évènement concerne 1 donnée "FCP_LOW"
    Et les données "FCP_LOW" de l'évènement contiennent "Prénom(s)"
    Et l'évènement concerne aucune donnée "FCP_HIGH"
    Et l'évènement concerne aucune donnée "DGFIP"
    Et l'évènement concerne aucune donnée "CNAM"
    Et j'affiche le détail du dernier évènement "Échange de Données" sur "FranceConnect" du fournisseur de service "Virtual Private Service Provider for Consent"
    Et la plateforme de l'évènement est "FranceConnect"
    Et le type d'action de l'évènement est "Échange de Données"
    Et la date de l'évènement correspond à aujourd'hui
    Et le fournisseur de service de l'évènement est "Virtual Private Service Provider for Consent"
    Et la date et heure de l'évènement correspondent à maintenant
    Et l'évènement concerne aucune donnée "FCP_LOW"
    Et l'évènement concerne aucune donnée "FCP_HIGH"
    Et l'évènement concerne 1 donnée "DGFIP"
    Et les données "DGFIP" de l'évènement contiennent "Revenu fiscal de référence"
    Et l'évènement concerne 1 donnée "CNAM"
    Et les données "CNAM" de l'évènement contiennent "Paiements d'indemnités journalières versés par l’Assurance Maladie"
    Et l'évènement concerne 1 donnée "MI"
    Et les données "MI" de l'évènement contiennent "Informations de la carte grise: Titulaire et véhicule"
    Et l'évènement concerne 1 donnée "MESRI"
    Et les données "MESRI" de l'évènement contiennent "Identifiant national étudiant"
    Et l'évènement concerne 1 donnée "CNOUS"
    Et les données "CNOUS" de l'évènement contiennent "Statut boursier"
    Et l'évènement concerne 1 donnée "PE"
    Et les données "PE" de l'évènement contiennent "Indemnités de Pôle emploi"

  Scénario: Historique Connexion - FC Legacy - FS privé avec scope anonyme
    Etant donné que j'utilise un compte usager "pour les tests de traces"
    Et que j'utilise le fournisseur de service "privé avec consentement obligatoire"
    Et que le fournisseur de service requiert l'accès aux informations du scope "anonyme"
    Et que j'ai fait une cinématique FranceConnect
    Et que les traces sont récupérées dans elasticsearch
    Et que je navigue sur la page d'accueil du dashboard usager
    Quand je me connecte au dashboard usager
    Alors je suis redirigé vers la page historique du dashboard usager
    Et 1 évènement "FranceConnect" est affiché
    Et j'affiche le détail du dernier évènement "Connexion" sur "FranceConnect" du fournisseur de service "Virtual Private Service Provider for Consent"
    Et la plateforme de l'évènement est "FranceConnect"
    Et le type d'action de l'évènement est "Connexion"
    Et la date de l'évènement correspond à aujourd'hui
    Et le fournisseur de service de l'évènement est "Virtual Private Service Provider for Consent"
    Et la date et heure de connexion correspondent à maintenant
    Et la localisation de l'évènement n'est pas affichée
    Et le nom du fournisseur d'identité de l'évènement est "Identity Provider - eIDAS élevé"
    Et le niveau de sécurité de l'évènement est "Faible"

  Scénario: Historique Connexion - FC Legacy - FS public avec scope traces
    Etant donné que j'utilise un compte usager "pour les tests de traces"
    Et que j'utilise le fournisseur de service "connecté à FD traces"
    Et que le fournisseur de service requiert l'accès aux informations du scope "connexion_tracks"
    Et que j'ai fait une cinématique FranceConnect
    Et que les traces sont récupérées dans elasticsearch
    Et que je navigue sur la page d'accueil du dashboard usager
    Quand je me connecte au dashboard usager
    Alors je suis redirigé vers la page historique du dashboard usager
    Et 2 évènements "FranceConnect" sont affichés
    Et j'affiche le détail du dernier évènement "Connexion" sur "FranceConnect" du fournisseur de service "Service Provider Example"
    Et la plateforme de l'évènement est "FranceConnect"
    Et le type d'action de l'évènement est "Connexion"
    Et la date de l'évènement correspond à aujourd'hui
    Et le fournisseur de service de l'évènement est "Service Provider Example"
    Et la date et heure de connexion correspondent à maintenant
    Et la localisation de l'évènement n'est pas affichée
    Et le nom du fournisseur d'identité de l'évènement est "Identity Provider - eIDAS élevé"
    Et le niveau de sécurité de l'évènement est "Faible"
    Et j'affiche le détail du dernier évènement "Échange de Données" sur "FranceConnect" du fournisseur de service "Service Provider Example"
    Et la plateforme de l'évènement est "FranceConnect"
    Et le type d'action de l'évènement est "Échange de Données"
    Et la date de l'évènement correspond à aujourd'hui
    Et le fournisseur de service de l'évènement est "Service Provider Example"
    Et la date et heure de l'évènement correspondent à maintenant
    Et l'évènement concerne aucune donnée "FCP_LOW"
    Et l'évènement concerne 1 donnée "FC_TRACKS"
    Et les données "FC_TRACKS" de l'évènement contiennent "Historique de connexions"

