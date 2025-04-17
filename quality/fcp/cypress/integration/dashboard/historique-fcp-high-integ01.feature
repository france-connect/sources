#language: fr
@userDashboard @historiqueConnexion @ignoreDocker
Fonctionnalité: Historique Connexion sur FC+ (integ01)
  # En tant qu'usager de FranceConnect,
  # je veux me connecter au user-dashboard sur integ01
  # afin de consulter mon historique de connexion FC+

  Scénario: Historique Connexion - FC+ - FS public avec scope identité
    Etant donné que j'utilise la plateforme "FranceConnect+"
    Et que j'utilise un compte usager "pour les tests de traces"
    Et que le fournisseur de service requiert l'accès aux informations du scope "tous les scopes"
    Et que j'utilise le fournisseur de service "par défaut"
    Et que j'ai fait une cinématique FranceConnect avec appel aux FD
    Et que j'utilise la plateforme "FranceConnect(v2)"
    Et que j'utilise un compte usager "pour les tests de traces"
    Et que je navigue sur la page d'accueil du tableau de bord usager
    Quand je me connecte au tableau de bord usager
    Alors je suis redirigé vers la page historique du tableau de bord usager
    Et j'affiche le détail du dernier évènement "Connexion" sur "FranceConnect+" du fournisseur de service "fsp1-high"
    Et la plateforme de l'évènement est "FranceConnect+"
    Et le type d'action de l'évènement est "Connexion"
    Et la date de l'évènement correspond à aujourd'hui
    Et le fournisseur de service de l'évènement est "fsp1-high"
    Et la date et heure de connexion correspondent à maintenant
    # Et la localisation de l'évènement est affichée
    Et le nom du fournisseur d'identité de l'évènement est "Démonstration eIDAS élevé - RSA ES256"
    Et le niveau de sécurité de l'évènement est "Substantiel"
    Et le code d'identification de l'évènement est affiché

  Scénario: Historique Connexion - FC+ - FS public avec scope data
    Etant donné que j'utilise la plateforme "FranceConnect+"
    Et que j'utilise un compte usager "pour les tests de traces"
    Et que j'utilise le fournisseur de service "par défaut"
    Et que le fournisseur de service requiert l'accès aux informations des scopes "dgfip et cnam"
    Et que j'ai fait une cinématique FranceConnect avec appel aux FD
    Et que j'utilise la plateforme "FranceConnect(v2)"
    Et que j'utilise un compte usager "pour les tests de traces"
    Et que je navigue sur la page d'accueil du tableau de bord usager
    Quand je me connecte au tableau de bord usager
    Alors je suis redirigé vers la page historique du tableau de bord usager
    Et j'affiche le détail du dernier évènement "Connexion" sur "FranceConnect+" du fournisseur de service "fsp1-high"
    Et la plateforme de l'évènement est "FranceConnect+"
    Et le type d'action de l'évènement est "Connexion"
    Et la date de l'évènement correspond à aujourd'hui
    Et le fournisseur de service de l'évènement est "fsp1-high"
    Et la date et heure de connexion correspondent à maintenant
    # Et la localisation de l'évènement est affichée
    Et le nom du fournisseur d'identité de l'évènement est "Démonstration eIDAS élevé - RSA ES256"
    Et le niveau de sécurité de l'évènement est "Substantiel"
    Et le code d'identification de l'évènement est affiché
    Et j'affiche le détail du 1er évènement "Échange de Données" sur "FranceConnect+" du FS "fsp1-high" avec le FD "DGFIP"
    Et la plateforme de l'évènement est "FranceConnect+"
    Et le type d'action de l'évènement est "Échange de Données"
    Et la date de l'évènement correspond à aujourd'hui
    Et le fournisseur de service de l'évènement est "fsp1-high"
    Et la date et heure de l'évènement correspondent à maintenant
    Et l'évènement concerne aucune donnée "FCP_HIGH"
    Et l'évènement concerne aucune donnée "CNAM"
    Et l'évènement concerne 5 données "DGFIP"
    Et les données "DGFIP" de l'évènement contiennent "Revenu fiscal de référence"
    Et les données "DGFIP" de l'évènement contiennent "Nombre de parts du foyer fiscal"
    Et les données "DGFIP" de l'évènement contiennent "Situation de famille (marié, pacsé, célibataire, veuf, divorcé)"
    Et les données "DGFIP" de l'évènement contiennent "Détail des personnes à charge et rattachées"
    Et les données "DGFIP" de l'évènement contiennent "Adresse déclarée au 1er Janvier"
    Et j'affiche le détail du 1er évènement "Échange de Données" sur "FranceConnect+" du FS "fsp1-high" avec le FD "CNAM"
    Et la plateforme de l'évènement est "FranceConnect+"
    Et le type d'action de l'évènement est "Échange de Données"
    Et la date de l'évènement correspond à aujourd'hui
    Et le fournisseur de service de l'évènement est "fsp1-high"
    Et la date et heure de l'évènement correspondent à maintenant
    Et l'évènement concerne aucune donnée "FCP_HIGH"
    Et l'évènement concerne aucune donnée "DGFIP"
    Et l'évènement concerne 1 donnée "CNAM"
    Et les données "CNAM" de l'évènement contiennent "Paiements d’indemnités journalières versées par l’Assurance Maladie"

  Scénario: Historique Connexion - FC+ - FS privé avec scope identité
    Etant donné que j'utilise la plateforme "FranceConnect+"
    Et que j'utilise un compte usager "pour les tests de traces"
    Et que j'utilise le fournisseur de service "privé avec consentement obligatoire"
    Et que le fournisseur de service requiert l'accès aux informations du scope "identite_pivot sans alias"
    Et que j'ai fait une cinématique FranceConnect avec appel aux FD
    Et que j'utilise la plateforme "FranceConnect(v2)"
    Et que j'utilise un compte usager "pour les tests de traces"
    Et que je navigue sur la page d'accueil du tableau de bord usager
    Quand je me connecte au tableau de bord usager
    Alors je suis redirigé vers la page historique du tableau de bord usager
    Et j'affiche le détail du dernier évènement "Connexion" sur "FranceConnect+" du fournisseur de service "fsp2-high"
    Et la plateforme de l'évènement est "FranceConnect+"
    Et le type d'action de l'évènement est "Connexion"
    Et la date de l'évènement correspond à aujourd'hui
    Et le fournisseur de service de l'évènement est "fsp2-high"
    Et la date et heure de connexion correspondent à maintenant
    # Et la localisation de l'évènement est affichée
    Et le nom du fournisseur d'identité de l'évènement est "Démonstration eIDAS élevé - RSA ES256"
    Et le niveau de sécurité de l'évènement est "Substantiel"
    Et le code d'identification de l'évènement est affiché
    Et j'affiche le détail du dernier évènement "Autorisation" sur "FranceConnect+" du fournisseur de service "fsp2-high"
    Et la plateforme de l'évènement est "FranceConnect+"
    Et le type d'action de l'évènement est "Autorisation"
    Et la date de l'évènement correspond à aujourd'hui
    Et le fournisseur de service de l'évènement est "fsp2-high"
    Et la date et heure de l'évènement correspondent à maintenant
    Et l'évènement concerne 7 données "FCP_HIGH"
    Et les données "FCP_HIGH" de l'évènement contiennent "Prénom(s)"
    Et les données "FCP_HIGH" de l'évènement contiennent "Nom de naissance"
    Et les données "FCP_HIGH" de l'évènement contiennent "Date de naissance"
    Et les données "FCP_HIGH" de l'évènement contiennent "Sexe"
    Et les données "FCP_HIGH" de l'évènement contiennent "Nom d’usage"
    Et les données "FCP_HIGH" de l'évènement contiennent "Pays de naissance"
    Et les données "FCP_HIGH" de l'évènement contiennent "Lieu de naissance"
    Et l'évènement concerne aucune donnée "DGFIP"
    Et l'évènement concerne aucune donnée "CNAM"

  Scénario: Historique Connexion - FC+ - FS privé avec scope data
    Etant donné que j'utilise la plateforme "FranceConnect+"
    Et que j'utilise un compte usager "pour les tests de traces"
    Et que j'utilise le fournisseur de service "privé avec consentement obligatoire"
    Et que le fournisseur de service requiert l'accès aux informations des scopes "dgfip et cnam"
    Et que j'ai fait une cinématique FranceConnect avec appel aux FD
    Et que j'utilise la plateforme "FranceConnect(v2)"
    Et que j'utilise un compte usager "pour les tests de traces"
    Et que je navigue sur la page d'accueil du tableau de bord usager
    Quand je me connecte au tableau de bord usager
    Alors je suis redirigé vers la page historique du tableau de bord usager
    Et j'affiche le détail du dernier évènement "Connexion" sur "FranceConnect+" du fournisseur de service "fsp2-high"
    Et la plateforme de l'évènement est "FranceConnect+"
    Et le type d'action de l'évènement est "Connexion"
    Et la date de l'évènement correspond à aujourd'hui
    Et le fournisseur de service de l'évènement est "fsp2-high"
    Et la date et heure de connexion correspondent à maintenant
    # Et la localisation de l'évènement est affichée
    Et le nom du fournisseur d'identité de l'évènement est "Démonstration eIDAS élevé - RSA ES256"
    Et le niveau de sécurité de l'évènement est "Substantiel"
    Et le code d'identification de l'évènement est affiché
    Et j'affiche le détail du dernier évènement "Autorisation" sur "FranceConnect+" du fournisseur de service "fsp2-high"
    Et la plateforme de l'évènement est "FranceConnect+"
    Et le type d'action de l'évènement est "Autorisation"
    Et la date de l'évènement correspond à aujourd'hui
    Et le fournisseur de service de l'évènement est "fsp2-high"
    Et la date et heure de l'évènement correspondent à maintenant
    Et l'évènement concerne aucune donnée "FCP_HIGH"
    Et l'évènement concerne 5 données "DGFIP"
    Et les données "DGFIP" de l'évènement contiennent "Revenu fiscal de référence"
    Et les données "DGFIP" de l'évènement contiennent "Nombre de parts du foyer fiscal"
    Et les données "DGFIP" de l'évènement contiennent "Situation de famille (marié, pacsé, célibataire, veuf, divorcé)"
    Et les données "DGFIP" de l'évènement contiennent "Détail des personnes à charge et rattachées"
    Et les données "DGFIP" de l'évènement contiennent "Adresse déclarée au 1er Janvier"
    Et l'évènement concerne 1 donnée "CNAM"
    Et les données "CNAM" de l'évènement contiennent "Paiements d’indemnités journalières versées par l’Assurance Maladie"
    Et j'affiche le détail du 1er évènement "Échange de Données" sur "FranceConnect+" du FS "fsp2-high" avec le FD "DGFIP"
    Et la plateforme de l'évènement est "FranceConnect+"
    Et le type d'action de l'évènement est "Échange de Données"
    Et la date de l'évènement correspond à aujourd'hui
    Et le fournisseur de service de l'évènement est "fsp2-high"
    Et la date et heure de l'évènement correspondent à maintenant
    Et l'évènement concerne aucune donnée "FCP_HIGH"
    Et l'évènement concerne aucune donnée "CNAM"
    Et l'évènement concerne 5 données "DGFIP"
    Et les données "DGFIP" de l'évènement contiennent "Revenu fiscal de référence"
    Et les données "DGFIP" de l'évènement contiennent "Nombre de parts du foyer fiscal"
    Et les données "DGFIP" de l'évènement contiennent "Situation de famille (marié, pacsé, célibataire, veuf, divorcé)"
    Et les données "DGFIP" de l'évènement contiennent "Détail des personnes à charge et rattachées"
    Et les données "DGFIP" de l'évènement contiennent "Adresse déclarée au 1er Janvier"
    Et j'affiche le détail du 1er évènement "Échange de Données" sur "FranceConnect+" du FS "fsp2-high" avec le FD "CNAM"
    Et la plateforme de l'évènement est "FranceConnect+"
    Et le type d'action de l'évènement est "Échange de Données"
    Et la date de l'évènement correspond à aujourd'hui
    Et le fournisseur de service de l'évènement est "fsp2-high"
    Et la date et heure de l'évènement correspondent à maintenant
    Et l'évènement concerne aucune donnée "FCP_HIGH"
    Et l'évènement concerne aucune donnée "DGFIP"
    Et l'évènement concerne 1 donnée "CNAM"
    Et les données "CNAM" de l'évènement contiennent "Paiements d’indemnités journalières versées par l’Assurance Maladie"

  Scénario: Historique Connexion - FC+ - FS privé avec scope anonyme
    Etant donné que j'utilise la plateforme "FranceConnect+"
    Et que j'utilise un compte usager "pour les tests de traces"
    Et que j'utilise le fournisseur de service "privé avec consentement obligatoire"
    Et que le fournisseur de service requiert l'accès aux informations du scope "anonyme"
    Et que j'ai fait une cinématique FranceConnect avec appel aux FD
    Et que j'utilise la plateforme "FranceConnect(v2)"
    Et que j'utilise un compte usager "pour les tests de traces"
    Et que je navigue sur la page d'accueil du tableau de bord usager
    Quand je me connecte au tableau de bord usager
    Alors je suis redirigé vers la page historique du tableau de bord usager
    Et j'affiche le détail du dernier évènement "Connexion" sur "FranceConnect+" du fournisseur de service "fsp2-high"
    Et la plateforme de l'évènement est "FranceConnect+"
    Et le type d'action de l'évènement est "Connexion"
    Et la date de l'évènement correspond à aujourd'hui
    Et le fournisseur de service de l'évènement est "fsp2-high"
    Et la date et heure de connexion correspondent à maintenant
    # Et la localisation de l'évènement est affichée
    Et le nom du fournisseur d'identité de l'évènement est "Démonstration eIDAS élevé - RSA ES256"
    Et le niveau de sécurité de l'évènement est "Substantiel"
    Et le code d'identification de l'évènement est affiché
