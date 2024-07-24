#language: fr
@userDashboard @historiqueConnexion @ignoreInteg01
Fonctionnalité: Historique Connexion sur FC Legacy (docker)
  # En tant qu'usager de FranceConnect,
  # je veux me connecter au user-dashboard
  # afin de consulter mon historique de connexion FC Legacy

  Scénario: Historique Connexion - FC Legacy - Charger les traces dans ElasticSearch
    Etant donné que les traces "FranceConnect(CL)" contiennent "des connexions récentes et anciennes de plus de 6 mois"

  Scénario: Historique Connexion - FC Legacy - FS public avec scope identité
    Etant donné que j'utilise un compte usager "pour les tests de traces"
    Et que je navigue sur la page d'accueil du tableau de bord usager
    Quand je me connecte au tableau de bord usager
    Alors je suis redirigé vers la page historique du tableau de bord usager
    Et j'affiche le détail du dernier évènement "Connexion" sur "FranceConnect" du fournisseur de service "Service Provider Example"
    Et la plateforme de l'évènement est "FranceConnect"
    Et le type d'action de l'évènement est "Connexion"
    Et la date de l'évènement est affichée
    Et le fournisseur de service de l'évènement est "Service Provider Example"
    Et la date et heure de connexion sont affichées
    Et la localisation de l'évènement est affichée
    Et le nom du fournisseur d'identité de l'évènement est "FIP1-LOW - eIDAS LOW - NO DISCOVERY"
    Et le niveau de sécurité de l'évènement est "Faible"

  Scénario: Historique Connexion - FC Legacy - FS privé avec scope data
    Etant donné que j'utilise un compte usager "pour les tests de traces"
    Et que je navigue sur la page d'accueil du tableau de bord usager
    Quand je me connecte au tableau de bord usager
    Alors je suis redirigé vers la page historique du tableau de bord usager
    Et j'affiche le détail du dernier évènement "Connexion" sur "FranceConnect" du fournisseur de service "Virtual Private Service Provider for Consent"
    Et la plateforme de l'évènement est "FranceConnect"
    Et le type d'action de l'évènement est "Connexion"
    Et la date de l'évènement est affichée
    Et le fournisseur de service de l'évènement est "Virtual Private Service Provider for Consent"
    Et la date et heure de connexion sont affichées
    # Et la localisation de l'évènement est affichée
    Et le nom du fournisseur d'identité de l'évènement est "FIP1-LOW - eIDAS LOW - NO DISCOVERY"
    Et le niveau de sécurité de l'évènement est "Faible"
    Et j'affiche le détail du 2ème évènement "Autorisation" sur "FranceConnect" du fournisseur de service "Virtual Private Service Provider for Consent"
    Et la plateforme de l'évènement est "FranceConnect"
    Et le type d'action de l'évènement est "Autorisation"
    Et la date de l'évènement est affichée
    Et le fournisseur de service de l'évènement est "Virtual Private Service Provider for Consent"
    Et la date et heure de l'évènement sont affichées
    Et l'évènement concerne 7 données "FCP_LOW"
    Et les données "FCP_LOW" de l'évènement contiennent "Prénom(s)"
    Et les données "FCP_LOW" de l'évènement contiennent "Nom de naissance"
    Et les données "FCP_LOW" de l'évènement contiennent "Date de naissance"
    Et les données "FCP_LOW" de l'évènement contiennent "Sexe"
    Et les données "FCP_LOW" de l'évènement contiennent "Nom d’usage"
    Et les données "FCP_LOW" de l'évènement contiennent "Pays de naissance"
    Et les données "FCP_LOW" de l'évènement contiennent "Lieu de naissance"
    Et l'évènement concerne aucune donnée "FCP_HIGH"
    Et l'évènement concerne aucune donnée "DGFIP"
    Et l'évènement concerne aucune donnée "CNAM"
    Et j'affiche le détail du dernier évènement "Autorisation" sur "FranceConnect" du fournisseur de service "Virtual Private Service Provider for Consent"
    Et la plateforme de l'évènement est "FranceConnect"
    Et le type d'action de l'évènement est "Autorisation"
    Et la date de l'évènement est affichée
    Et le fournisseur de service de l'évènement est "Virtual Private Service Provider for Consent"
    Et la date et heure de l'évènement sont affichées
    Et l'évènement concerne 5 données "DGFIP"
    Et les données "DGFIP" de l'évènement contiennent "Revenu fiscal de référence"
    Et les données "DGFIP" de l'évènement contiennent "Nombre de parts du foyer fiscal"
    Et les données "DGFIP" de l'évènement contiennent "Situation de famille (marié, pacsé, célibataire, veuf, divorcé)"
    Et les données "DGFIP" de l'évènement contiennent "Détail des personnes à charge et rattachées"
    Et les données "DGFIP" de l'évènement contiennent "Adresse déclarée au 1er Janvier"
    Et l'évènement concerne 1 donnée "CNAM"
    Et les données "CNAM" de l'évènement contiennent "Paiements d'indemnités journalières versées par l'Assurance Maladie"
    Et j'affiche le détail du dernier évènement "Échange de Données" sur "FranceConnect" du fournisseur de service "Virtual Private Service Provider for Consent"
    Et la plateforme de l'évènement est "FranceConnect"
    Et le type d'action de l'évènement est "Échange de Données"
    Et la date de l'évènement est affichée
    Et le fournisseur de service de l'évènement est "Virtual Private Service Provider for Consent"
    Et la date et heure de l'évènement sont affichées
    Et l'évènement concerne 5 données "DGFIP"
    Et les données "DGFIP" de l'évènement contiennent "Revenu fiscal de référence"
    Et les données "DGFIP" de l'évènement contiennent "Nombre de parts du foyer fiscal"
    Et les données "DGFIP" de l'évènement contiennent "Situation de famille (marié, pacsé, célibataire, veuf, divorcé)"
    Et les données "DGFIP" de l'évènement contiennent "Détail des personnes à charge et rattachées"
    Et les données "DGFIP" de l'évènement contiennent "Adresse déclarée au 1er Janvier"
    Et l'évènement concerne 1 donnée "CNAM"
    Et les données "CNAM" de l'évènement contiennent "Paiements d'indemnités journalières versées par l'Assurance Maladie"
