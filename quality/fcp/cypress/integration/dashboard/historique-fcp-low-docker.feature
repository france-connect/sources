#language: fr
@userDashboard @historiqueConnexion @ignoreInteg01
Fonctionnalité: Historique Connexion FranceConnect(v2) (docker)
  # En tant qu'usager de FranceConnect,
  # je veux me connecter au user-dashboard
  # afin de consulter mon historique de connexion FC+

  Scénario: Historique Connexion - FranceConnect(v2) - FS public avec scope identité
    Etant donné que j'utilise un compte usager "pour les tests de traces"
    Et que les traces "FranceConnect(v2)" contiennent "des connexions récentes et anciennes de plus de 6 mois"
    Et que je navigue sur la page d'accueil du tableau de bord usager
    Quand je me connecte au tableau de bord usager
    Alors je suis redirigé vers la page historique du tableau de bord usager
    Et j'affiche le détail du dernier évènement "Connexion" sur "FranceConnect" du fournisseur de service "FSP - FSP1-LOW"
    Et la plateforme de l'évènement est "FranceConnect"
    Et le type d'action de l'évènement est "Connexion"
    Et la date de l'évènement est affichée
    Et le fournisseur de service de l'évènement est "FSP - FSP1-LOW"
    Et la date et heure de connexion sont affichées
    Et la localisation de l'évènement est affichée
    Et le nom du fournisseur d'identité de l'évènement est "IDP1 - Identity Provider - eIDAS élevé - discov - crypt"
    Et le niveau de sécurité de l'évènement est "Faible"

  Scénario: Historique Connexion - FranceConnect(v2) - FS privé avec scope identité
    Etant donné que j'utilise un compte usager "pour les tests de traces"
    Et que les traces "FranceConnect(v2)" contiennent "des connexions récentes et anciennes de plus de 6 mois"
    Et que je navigue sur la page d'accueil du tableau de bord usager
    Quand je me connecte au tableau de bord usager
    Alors je suis redirigé vers la page historique du tableau de bord usager
    Et j'affiche le détail du dernier évènement "Connexion" sur "FranceConnect" du fournisseur de service "FSP - FSP5-LOW"
    Et la plateforme de l'évènement est "FranceConnect"
    Et le type d'action de l'évènement est "Connexion"
    Et la date de l'évènement est affichée
    Et le fournisseur de service de l'évènement est "FSP - FSP5-LOW"
    Et la date et heure de connexion sont affichées
    # Et la localisation de l'évènement est affichée
    Et le nom du fournisseur d'identité de l'évènement est "IDP1 - Identity Provider - eIDAS élevé - discov - crypt"
    Et le niveau de sécurité de l'évènement est "Faible"
    Et j'affiche le détail du dernier évènement "Autorisation" sur "FranceConnect" du fournisseur de service "FSP - FSP5-LOW"
    Et la plateforme de l'évènement est "FranceConnect"
    Et le type d'action de l'évènement est "Autorisation"
    Et la date de l'évènement est affichée
    Et le fournisseur de service de l'évènement est "FSP - FSP5-LOW"
    Et la date et heure de l'évènement sont affichées
    Et l'évènement concerne 8 données "FCP_LOW"
    Et les données "FCP_LOW" de l'évènement contiennent "Prénom(s)"
    Et les données "FCP_LOW" de l'évènement contiennent "Nom de naissance"
    Et les données "FCP_LOW" de l'évènement contiennent "Date de naissance"
    Et les données "FCP_LOW" de l'évènement contiennent "Sexe"
    Et les données "FCP_LOW" de l'évènement contiennent "Nom d’usage"
    Et les données "FCP_LOW" de l'évènement contiennent "Pays de naissance"
    Et les données "FCP_LOW" de l'évènement contiennent "Lieu de naissance"
    Et les données "FCP_LOW" de l'évènement contiennent "Adresse email"
    Et l'évènement concerne aucune donnée "FCP_HIGH"
    Et l'évènement concerne aucune donnée "DGFIP"
    Et l'évènement concerne aucune donnée "CNAM"
