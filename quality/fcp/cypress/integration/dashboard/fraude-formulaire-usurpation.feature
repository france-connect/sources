#language: fr
@userDashboard @fraude @fraudeFormulaireUsurpation @ci
Fonctionnalité: Formulaire Usurpation

  @ignoreInteg01
  Scénario: Formulaire usurpation - cas passant sans trace
    Etant donné que les traces sont supprimées dans elasticsearch
    Et que je navigue sur la page de connexion du formulaire usurpation
    Et que je force la donnée "fraudSurveyOrigin" à "identite-inconnue" dans le localStorage
    Et que je me connecte pour accéder au formulaire usurpation
    Et que je suis redirigé vers la page formulaire usurpation
    Et que le formulaire usurpation est affiché
    Quand j'entre les valeurs par défaut sur le formulaire usurpation
    Et je coche la case de consentement du formulaire usurpation
    Et je valide le formulaire usurpation
    Alors la demande de support est prise en compte
    Et le mail "demande de support" est envoyé
    Et le sujet est "Demande de support - signalement usurpation d’identité" dans le mail "demande de support"
    Et l'expéditeur est correct dans le mail "demande de support"
    Et le destinataire est le "Support Sécurité" dans le mail "demande de support"
    Et les informations d'identité sont présentes dans le mail "demande de support"
    Et les champs du formulaire sont présents dans le mail "demande de support"
    Et "fraudSurveyOrigin" est "identite-inconnue" dans le mail "demande de support"
    Et "Email du compte FI" contient l'email du compte FI dans le mail "demande de support"
    Et le message d'erreur est "aucune trace ne correspond au code d’identitication" dans le mail "demande de support"
    Et il n'y a pas de pièce jointe dans le mail "demande de support"

  @ignoreInteg01
  Scénario: Formulaire usurpation - cas passant avec une trace fcp-legacy de l'usager
    Etant donné que les traces "FranceConnect(CL)" contiennent "1 connexion"
    Et que j'utilise un compte usager "pour les tests de traces"
    Et que je supprime les mails envoyés à l'usager
    Et que je navigue sur la page de connexion du formulaire usurpation
    Et que je force la donnée "fraudSurveyOrigin" à "identite-inconnue" dans le localStorage
    Et que je me connecte pour accéder au formulaire usurpation
    Et que je suis redirigé vers la page formulaire usurpation
    Et que le formulaire usurpation est affiché
    Quand j'entre les valeurs par défaut sur le formulaire usurpation
    Et j'entre "f6e5ad20-cb60-488a-9466-c852e2f0785e" dans le champ "authenticationEventId" du formulaire usurpation
    Et je coche la case de consentement du formulaire usurpation
    Et je valide le formulaire usurpation
    Alors la demande de support est prise en compte
    Et le mail "demande de support" est envoyé
    Et le sujet est "Demande de support - signalement usurpation d’identité" dans le mail "demande de support"
    Et l'expéditeur est correct dans le mail "demande de support"
    Et le destinataire est le "Support Sécurité" dans le mail "demande de support"
    Et les informations d'identité sont présentes dans le mail "demande de support"
    Et les champs du formulaire sont présents dans le mail "demande de support"
    Et "fraudSurveyOrigin" est "identite-inconnue" dans le mail "demande de support"
    Et le nombre de trace est 1 dans le mail "demande de support"
    Et "error" n'est pas présent dans le mail "demande de support"
    Et "platform" est "FC (v1)" pour la trace numéro 1 dans le mail "demande de support"
    Et "accountIdMatch" est "Oui" pour la trace numéro 1 dans le mail "demande de support"
    Et "idpName" est "fip1-no-discovery" pour la trace numéro 1 dans le mail "demande de support"
    Et "spName" est "Service Provider Example" pour la trace numéro 1 dans le mail "demande de support"
    Et "interactionAcr" est "eidas1" pour la trace numéro 1 dans le mail "demande de support"
    Et "date" est présent pour la trace numéro 1 dans le mail "demande de support"
    Et "country" est présent pour la trace numéro 1 dans le mail "demande de support"
    Et "city" est présent pour la trace numéro 1 dans le mail "demande de support"
    Et le fichier "Service Provider Example_connexions.csv" est joint dans le mail "demande de support"
    Et je télécharge le fichier csv "Service Provider Example_connexions.csv" en pièce jointe
    Et le nombre de ligne est 1 dans le fichier csv "Service Provider Example_connexions.csv"
    Et le fichier csv "Service Provider Example_connexions.csv" contient les traces pour un partenaire de type FS
    Et "spSub" est "bfac09b3bd2d4d729c051b9f63186532ed5410c098c2c9eb10db51c6fe6a9ae9v1" pour la ligne 1 du fichier csv "Service Provider Example_connexions.csv"
    Et le fichier "fip1-no-discovery_connexions.csv" est joint dans le mail "demande de support"
    Et je télécharge le fichier csv "fip1-no-discovery_connexions.csv" en pièce jointe
    Et le nombre de ligne est 1 dans le fichier csv "fip1-no-discovery_connexions.csv"
    Et le fichier csv "fip1-no-discovery_connexions.csv" contient les traces pour un partenaire de type FI
    Et "idpSub" est "82" pour la ligne 1 du fichier csv "fip1-no-discovery_connexions.csv"

  @ignoreInteg01
  Scénario: Formulaire usurpation - cas passant avec une trace fcp-high de l'usager
    Etant donné que les traces "FranceConnect+" contiennent "1 connexion"
    Et que j'utilise un compte usager "pour les tests de traces"
    Et que je supprime les mails envoyés à l'usager
    Et que je navigue sur la page de connexion du formulaire usurpation
    Et que je force la donnée "fraudSurveyOrigin" à "identite-inconnue" dans le localStorage
    Et que je me connecte pour accéder au formulaire usurpation
    Et que je suis redirigé vers la page formulaire usurpation
    Et que le formulaire usurpation est affiché
    Quand j'entre les valeurs par défaut sur le formulaire usurpation
    Et j'entre "f9c4cb30-1b84-47b3-9438-d5ecb5b5a11d" dans le champ "authenticationEventId" du formulaire usurpation
    Et je coche la case de consentement du formulaire usurpation
    Et je valide le formulaire usurpation
    Alors la demande de support est prise en compte
    Et le mail "demande de support" est envoyé
    Et le sujet est "Demande de support - signalement usurpation d’identité" dans le mail "demande de support"
    Et l'expéditeur est correct dans le mail "demande de support"
    Et le destinataire est le "Support Sécurité" dans le mail "demande de support"
    Et les informations d'identité sont présentes dans le mail "demande de support"
    Et les champs du formulaire sont présents dans le mail "demande de support"
    Et "fraudSurveyOrigin" est "identite-inconnue" dans le mail "demande de support"
    Et le nombre de trace est 1 dans le mail "demande de support"
    Et "error" n'est pas présent dans le mail "demande de support"
    Et "platform" est "FC+" pour la trace numéro 1 dans le mail "demande de support"
    Et "accountIdMatch" est "Oui" pour la trace numéro 1 dans le mail "demande de support"
    Et "idpName" est "fip1-high" pour la trace numéro 1 dans le mail "demande de support"
    Et "spName" est "FSP - FSP1-HIGH" pour la trace numéro 1 dans le mail "demande de support"
    Et "interactionAcr" est "eidas3" pour la trace numéro 1 dans le mail "demande de support"
    Et "date" est présent pour la trace numéro 1 dans le mail "demande de support"
    Et "country" est présent pour la trace numéro 1 dans le mail "demande de support"
    Et "city" est présent pour la trace numéro 1 dans le mail "demande de support"
    Et le fichier "FSP - FSP1-HIGH_connexions.csv" est joint dans le mail "demande de support"
    Et je télécharge le fichier csv "FSP - FSP1-HIGH_connexions.csv" en pièce jointe
    Et le nombre de ligne est 1 dans le fichier csv "FSP - FSP1-HIGH_connexions.csv"
    Et le fichier csv "FSP - FSP1-HIGH_connexions.csv" contient les traces pour un partenaire de type FS
    Et "spSub" est "bfac09b3bd2d4d729c051b9f63186532ed5410c098c2c9eb10db51c6fe6a9ae9v1" pour la ligne 1 du fichier csv "FSP - FSP1-HIGH_connexions.csv"
    Et le fichier "fip1-high_connexions.csv" est joint dans le mail "demande de support"
    Et je télécharge le fichier csv "fip1-high_connexions.csv" en pièce jointe
    Et le nombre de ligne est 1 dans le fichier csv "fip1-high_connexions.csv"
    Et le fichier csv "fip1-high_connexions.csv" contient les traces pour un partenaire de type FI
    Et "idpSub" est "229850d7940580fe24818d574b88bfd98353fe5bd8949232410a86a5964cca74" pour la ligne 1 du fichier csv "fip1-high_connexions.csv"

  @ignoreInteg01
  Scénario: Formulaire usurpation - cas passant avec une trace fcp-low de l'usager
    Etant donné que les traces "FranceConnect(v2)" contiennent "1 connexion"
    Et que j'utilise un compte usager "pour les tests de traces"
    Et que je supprime les mails envoyés à l'usager
    Et que je navigue sur la page de connexion du formulaire usurpation
    Et que je force la donnée "fraudSurveyOrigin" à "identite-inconnue" dans le localStorage
    Et que je me connecte pour accéder au formulaire usurpation
    Et que je suis redirigé vers la page formulaire usurpation
    Et que le formulaire usurpation est affiché
    Quand j'entre les valeurs par défaut sur le formulaire usurpation
    Et j'entre "1a344d7d-fb1f-432f-99df-01b374c93687" dans le champ "authenticationEventId" du formulaire usurpation
    Et je coche la case de consentement du formulaire usurpation
    Et je valide le formulaire usurpation
    Alors la demande de support est prise en compte
    Et le mail "demande de support" est envoyé
    Et le sujet est "Demande de support - signalement usurpation d’identité" dans le mail "demande de support"
    Et l'expéditeur est correct dans le mail "demande de support"
    Et le destinataire est le "Support Sécurité" dans le mail "demande de support"
    Et les informations d'identité sont présentes dans le mail "demande de support"
    Et les champs du formulaire sont présents dans le mail "demande de support"
    Et "fraudSurveyOrigin" est "identite-inconnue" dans le mail "demande de support"
    Et le nombre de trace est 1 dans le mail "demande de support"
    Et "error" n'est pas présent dans le mail "demande de support"
    Et "platform" est "FC (v2)" pour la trace numéro 1 dans le mail "demande de support"
    Et "accountIdMatch" est "Oui" pour la trace numéro 1 dans le mail "demande de support"
    Et "idpName" est "fip1-low" pour la trace numéro 1 dans le mail "demande de support"
    Et "spName" est "FSP - FSP1-LOW" pour la trace numéro 1 dans le mail "demande de support"
    Et "interactionAcr" est "eidas1" pour la trace numéro 1 dans le mail "demande de support"
    Et "date" est présent pour la trace numéro 1 dans le mail "demande de support"
    Et "country" est présent pour la trace numéro 1 dans le mail "demande de support"
    Et "city" est présent pour la trace numéro 1 dans le mail "demande de support"
    Et le fichier "FSP - FSP1-LOW_connexions.csv" est joint dans le mail "demande de support"
    Et je télécharge le fichier csv "FSP - FSP1-LOW_connexions.csv" en pièce jointe
    Et le nombre de ligne est 1 dans le fichier csv "FSP - FSP1-LOW_connexions.csv"
    Et le fichier csv "FSP - FSP1-LOW_connexions.csv" contient les traces pour un partenaire de type FS
    Et "spSub" est "bfac09b3bd2d4d729c051b9f63186532ed5410c098c2c9eb10db51c6fe6a9ae9v1" pour la ligne 1 du fichier csv "FSP - FSP1-LOW_connexions.csv"
    Et le fichier "fip1-low_connexions.csv" est joint dans le mail "demande de support"
    Et je télécharge le fichier csv "fip1-low_connexions.csv" en pièce jointe
    Et le nombre de ligne est 1 dans le fichier csv "fip1-low_connexions.csv"
    Et le fichier csv "fip1-low_connexions.csv" contient les traces pour un partenaire de type FI
    Et "idpSub" est "229850d7940580fe24818d574b88bfd98353fe5bd8949232410a86a5964cca74" pour la ligne 1 du fichier csv "fip1-low_connexions.csv"

  @ignoreInteg01
  Scénario: Formulaire usurpation - cas passant avec une trace d'un autre usager
    Etant donné que les traces "FranceConnect(v2)" contiennent "1 connexion"
    Et que je supprime les mails envoyés à l'usager
    Et que je navigue sur la page de connexion du formulaire usurpation
    Et que je force la donnée "fraudSurveyOrigin" à "identite-inconnue" dans le localStorage
    Et que je me connecte pour accéder au formulaire usurpation
    Et que je suis redirigé vers la page formulaire usurpation
    Et que le formulaire usurpation est affiché
    Quand j'entre les valeurs par défaut sur le formulaire usurpation
    Et j'entre "1a344d7d-fb1f-432f-99df-01b374c93687" dans le champ "authenticationEventId" du formulaire usurpation
    Et je coche la case de consentement du formulaire usurpation
    Et je valide le formulaire usurpation
    Alors la demande de support est prise en compte
    Et le mail "demande de support" est envoyé
    Et le sujet est "Demande de support - signalement usurpation d’identité" dans le mail "demande de support"
    Et l'expéditeur est correct dans le mail "demande de support"
    Et le destinataire est le "Support Sécurité" dans le mail "demande de support"
    Et les informations d'identité sont présentes dans le mail "demande de support"
    Et les champs du formulaire sont présents dans le mail "demande de support"
    Et "fraudSurveyOrigin" est "identite-inconnue" dans le mail "demande de support"
    Et le nombre de trace est 1 dans le mail "demande de support"
    Et "error" n'est pas présent dans le mail "demande de support"
    Et "accountIdMatch" est "Non" pour la trace numéro 1 dans le mail "demande de support"
    Et le fichier "FSP - FSP1-LOW_connexions.csv" est joint dans le mail "demande de support"
    Et le fichier "fip1-low_connexions.csv" est joint dans le mail "demande de support"

  @ignoreInteg01
  Scénario: Formulaire usurpation - cas passant avec deux traces
    Etant donné que les traces "FranceConnect(v2)" contiennent "2 connexions"
    Et que je supprime les mails envoyés à l'usager
    Et que je navigue sur la page de connexion du formulaire usurpation
    Et que je force la donnée "fraudSurveyOrigin" à "identite-inconnue" dans le localStorage
    Et que je me connecte pour accéder au formulaire usurpation
    Et que je suis redirigé vers la page formulaire usurpation
    Et que le formulaire usurpation est affiché
    Quand j'entre les valeurs par défaut sur le formulaire usurpation
    Et j'entre "1a344d7d-fb1f-432f-99df-01b374c93687" dans le champ "authenticationEventId" du formulaire usurpation
    Et je coche la case de consentement du formulaire usurpation
    Et je valide le formulaire usurpation
    Alors la demande de support est prise en compte
    Et le mail "demande de support" est envoyé
    Et le sujet est "Demande de support - signalement usurpation d’identité" dans le mail "demande de support"
    Et l'expéditeur est correct dans le mail "demande de support"
    Et le destinataire est le "Support Sécurité" dans le mail "demande de support"
    Et les informations d'identité sont présentes dans le mail "demande de support"
    Et les champs du formulaire sont présents dans le mail "demande de support"
    Et "fraudSurveyOrigin" est "identite-inconnue" dans le mail "demande de support"
    Et le nombre de trace est 2 dans le mail "demande de support"
    Et "error" n'est pas présent dans le mail "demande de support"
    Et le fichier "FSP - FSP1-LOW_connexions.csv" est joint dans le mail "demande de support"
    Et je télécharge le fichier csv "FSP - FSP1-LOW_connexions.csv" en pièce jointe
    Et le nombre de ligne est 2 dans le fichier csv "FSP - FSP1-LOW_connexions.csv"
    Et le fichier "fip1-low_connexions.csv" est joint dans le mail "demande de support"
    Et je télécharge le fichier csv "fip1-low_connexions.csv" en pièce jointe
    Et le nombre de ligne est 2 dans le fichier csv "fip1-low_connexions.csv"

  @ignoreDocker
  Scénario: Formulaire usurpation - demande support prise en compte
    Etant donné que je navigue sur la page de connexion du formulaire usurpation
    Et que je force la donnée "fraudSurveyOrigin" à "identite-inconnue" dans le localStorage
    Et que je me connecte pour accéder au formulaire usurpation
    Et que je suis redirigé vers la page formulaire usurpation
    Et que le formulaire usurpation est affiché
    Quand j'entre les valeurs par défaut sur le formulaire usurpation
    Et je coche la case de consentement du formulaire usurpation
    Et je valide le formulaire usurpation
    Alors la demande de support est prise en compte

  Scénario: Formulaire usurpation - format email invalide
    Etant donné que je navigue sur la page de connexion du formulaire usurpation
    Et que je force la donnée "fraudSurveyOrigin" à "identite-inconnue" dans le localStorage
    Et que je me connecte pour accéder au formulaire usurpation
    Et que je suis redirigé vers la page formulaire usurpation
    Quand j'entre les valeurs par défaut sur le formulaire usurpation
    Et j'entre "bad contact email" dans le champ "contactEmail" du formulaire usurpation
    Et je coche la case de consentement du formulaire usurpation
    Et je valide le formulaire usurpation
    Alors le champ "contactEmail" a une erreur "Veuillez saisir une adresse électronique valide" dans le formulaire usurpation

  Scénario: Formulaire usurpation - format code d'identification invalide
    Etant donné que je navigue sur la page de connexion du formulaire usurpation
    Et que je force la donnée "fraudSurveyOrigin" à "identite-inconnue" dans le localStorage
    Et que je me connecte pour accéder au formulaire usurpation
    Et que je suis redirigé vers la page formulaire usurpation
    Et que le formulaire usurpation est affiché
    Quand j'entre "bad authentication event id" dans le champ "authenticationEventId" du formulaire usurpation
    Et je coche la case de consentement du formulaire usurpation
    Et je valide le formulaire usurpation
    Alors le champ "authenticationEventId" a une erreur "Le code est erroné, veuillez vérifier sa valeur" dans le formulaire usurpation

  Scénario: Formulaire usurpation - champs obligatoires
    Etant donné que je navigue sur la page de connexion du formulaire usurpation
    Et que je force la donnée "fraudSurveyOrigin" à "identite-inconnue" dans le localStorage
    Et que je me connecte pour accéder au formulaire usurpation
    Et que je suis redirigé vers la page formulaire usurpation
    Et que le formulaire usurpation est affiché
    Quand je supprime la valeur du champ "contactEmail" du formulaire usurpation
    Et je valide le formulaire usurpation
    Alors le champ "contactEmail" a une erreur "Veuillez saisir une adresse électronique" dans le formulaire usurpation
    Et le champ "authenticationEventId" a une erreur "Veuillez renseigner le code d’identification" dans le formulaire usurpation
    Et le champ "acceptTransmitData" a une erreur "Veuillez cocher cette case si vous souhaitez continuer" dans le formulaire usurpation

  Scénario: Formulaire usurpation - contactEmail pré-rempli
    Etant donné que je navigue sur la page de connexion du formulaire usurpation
    Et que je force la donnée "fraudSurveyOrigin" à "identite-inconnue" dans le localStorage
    Quand je me connecte pour accéder au formulaire usurpation
    Alors je suis redirigé vers la page formulaire usurpation
    Et le formulaire usurpation est affiché
    Et le champ "contactEmail" contient l'email du compte FI dans le formulaire usurpation

  @ignoreInteg01
  Scénario: Formulaire usurpation - champs optionnels
    Etant donné que je navigue sur la page de connexion du formulaire usurpation
    Et que je force la donnée "fraudSurveyOrigin" à "identite-inconnue" dans le localStorage
    Et que je me connecte pour accéder au formulaire usurpation
    Et que je suis redirigé vers la page formulaire usurpation
    Et que le formulaire usurpation est affiché
    Quand j'entre les valeurs par défaut sur le formulaire usurpation
    Et je supprime la valeur du champ "comment" du formulaire usurpation
    Et je supprime la valeur du champ "phoneNumber" du formulaire usurpation
    Et je coche la case de consentement du formulaire usurpation
    Et je valide le formulaire usurpation
    Alors la demande de support est prise en compte
    Et le mail "demande de support" est envoyé
    Et "phoneNumber" n'est pas présent dans le mail "demande de support"
    Et "comment" n'est pas présent dans le mail "demande de support"

  Scénario: Formulaire usurpation - lien vers l'historique
    Etant donné que je navigue sur la page de connexion du formulaire usurpation
    Et que je force la donnée "fraudSurveyOrigin" à "identite-inconnue" dans le localStorage
    Quand je me connecte pour accéder au formulaire usurpation
    Alors je suis redirigé vers la page formulaire usurpation
    Et le lien vers la page historique de connexion est affiché sur le formulaire usurpation
