#language: fr
@userDashboard @fraude @fraudeFormulaireUsurpation @ci
Fonctionnalité: Formulaire Usurpation

  @ignoreInteg01
  Scénario: Formulaire usurpation - cas passant
    Etant donné que je supprime les mails envoyés à l'usager
    Et que je navigue sur la page de connexion du formulaire usurpation
    Et que je force la donnée "fraudSurveyOrigin" à "identite-inconnue" dans le localStorage
    Et que je me connecte pour accéder au formulaire usurpation
    Et que je suis redirigé vers la page formulaire usurpation
    Et que le formulaire usurpation est affiché
    Et que j'entre les valeurs par défaut sur le formulaire usurpation
    Et que je coche la case de consentement du formulaire usurpation
    Quand je valide le formulaire usurpation
    Alors la demande de support est prise en compte
    Et le mail "demande de support" est envoyé
    Et le sujet est "Demande de support - signalement usurpation d’identité" dans le mail "demande de support"
    Et l'expéditeur est correct dans le mail "demande de support"
    Et le destinataire est le "Support Sécurité" dans le mail "demande de support"
    Et les informations d'identité sont présentes dans le mail "demande de support"
    Et les champs du formulaire sont présents dans le mail "demande de support"
    Et "Provenance questionnaire usurpation" est "identite-inconnue" dans le mail "demande de support"
    Et "Email du compte FI" contient l'email du compte FI dans le mail "demande de support"

  @ignoreDocker
  Scénario: Formulaire usurpation - demande support prise en compte
    Etant donné que je navigue sur la page de connexion du formulaire usurpation
    Et que je force la donnée "fraudSurveyOrigin" à "identite-inconnue" dans le localStorage
    Et que je me connecte pour accéder au formulaire usurpation
    Et que je suis redirigé vers la page formulaire usurpation
    Et que le formulaire usurpation est affiché
    Et que j'entre les valeurs par défaut sur le formulaire usurpation
    Et que je coche la case de consentement du formulaire usurpation
    Quand je valide le formulaire usurpation
    Alors la demande de support est prise en compte

  Scénario: Formulaire usurpation - format email invalide
    Etant donné que je navigue sur la page de connexion du formulaire usurpation
    Et que je force la donnée "fraudSurveyOrigin" à "identite-inconnue" dans le localStorage
    Et que je me connecte pour accéder au formulaire usurpation
    Et que je suis redirigé vers la page formulaire usurpation
    Et que le formulaire usurpation est affiché
    Et que j'entre "bad contact email" dans le champ "contactEmail" du formulaire usurpation
    Et que je coche la case de consentement du formulaire usurpation
    Quand je valide le formulaire usurpation
    Alors le champ "contactEmail" a une erreur "Veuillez saisir une adresse électronique valide" dans le formulaire usurpation

  Scénario: Formulaire usurpation - format code d'identification invalide
    Etant donné que je navigue sur la page de connexion du formulaire usurpation
    Et que je force la donnée "fraudSurveyOrigin" à "identite-inconnue" dans le localStorage
    Et que je me connecte pour accéder au formulaire usurpation
    Et que je suis redirigé vers la page formulaire usurpation
    Et que le formulaire usurpation est affiché
    Et que j'entre "bad authentication event id" dans le champ "authenticationEventId" du formulaire usurpation
    Et que je coche la case de consentement du formulaire usurpation
    Quand je valide le formulaire usurpation
    Alors le champ "authenticationEventId" a une erreur "Le code est erroné, veuillez vérifier sa valeur" dans le formulaire usurpation

  Scénario: Formulaire usurpation - champs obligatoires
    Etant donné que je navigue sur la page de connexion du formulaire usurpation
    Et que je force la donnée "fraudSurveyOrigin" à "identite-inconnue" dans le localStorage
    Et que je me connecte pour accéder au formulaire usurpation
    Et que je suis redirigé vers la page formulaire usurpation
    Et que le formulaire usurpation est affiché
    Et que je supprime la valeur du champ "contactEmail" du formulaire usurpation
    Quand je valide le formulaire usurpation
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
    Et que j'entre les valeurs par défaut sur le formulaire usurpation
    Et que je supprime la valeur du champ "comment" du formulaire usurpation
    Et que je supprime la valeur du champ "phoneNumber" du formulaire usurpation
    Et que je coche la case de consentement du formulaire usurpation
    Quand je valide le formulaire usurpation
    Alors la demande de support est prise en compte
    Et le mail "demande de support" est envoyé
    Et "phoneNumer" n'est pas présent dans le mail "demande de support"
    Et "comment" n'est pas présent dans le mail "demande de support"

  Scénario: Formulaire usurpation - lien vers l'historique
    Etant donné que je navigue sur la page de connexion du formulaire usurpation
    Et que je force la donnée "fraudSurveyOrigin" à "identite-inconnue" dans le localStorage
    Quand je me connecte pour accéder au formulaire usurpation
    Alors je suis redirigé vers la page formulaire usurpation
    Et le lien vers la page historique de connexion est affiché sur le formulaire usurpation
