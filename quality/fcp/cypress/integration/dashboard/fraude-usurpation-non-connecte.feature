#language: fr
@userDashboard @fraude @fraudeFormulaireUsurpation @ci @ignoreInteg01
Fonctionnalité: Formulaire Usurpation non connecté

  Contexte: Initialisation des traces dans elasticsearch
    Etant donné que j'initialise les traces dans elasticsearch pour le test "fraude-usurpation-non-connecte"

  Scénario: Formulaire usurpation non connecté - cas passant FC+
    Etant donné que je supprime les mails envoyés à "support.test@franceconnect.gouv.fr"
    Et que je navigue vers la page formulaire usurpation non connecté
    Et que je suis redirigé vers la page description du formulaire usurpation non connecté
    Et que l'étape 1 sur 6 du formulaire usurpation non connecté est affichée
    Et que l'étape du formulaire usurpation non connecté est "Description de l’usurpation"
    Et que j'entre "description de l'usurpation d'identité" dans le champ "description" du formulaire usurpation non connecté
    Et que je continue avec le formulaire usurpation non connecté
    Et que je suis sur la page identification de connexion du formulaire usurpation non connecté
    Et que l'étape 2 sur 6 du formulaire usurpation non connecté est affichée
    Et que l'étape du formulaire usurpation non connecté est "Identification de la connexion"
    Et que j'entre "f9c4cb30-1b84-47b3-9438-d5ecb5b5a11d" dans le champ "code" du formulaire usurpation non connecté
    Et que je continue avec le formulaire usurpation non connecté
    Et que je suis sur la page connexions existantes du formulaire usurpation non connecté
    Et que l'étape 3 sur 6 du formulaire usurpation non connecté est affichée
    Et que l'étape du formulaire usurpation non connecté est "Identification de la connexion"
    Et que 1 connexion existante a été trouvée avec le code d'identification
    Et que je valide les connexions correspondantes
    Et que je suis sur la page identitée usurpée du formulaire usurpation non connecté
    Et que l'étape 4 sur 6 du formulaire usurpation non connecté est affichée
    Et que l'étape du formulaire usurpation non connecté est "Identité de la personne usurpée"
    Et que j'entre "Family Name" dans le champ "family_name" du formulaire usurpation non connecté
    Et que j'entre "Given Name" dans le champ "given_name" du formulaire usurpation non connecté
    Et que j'entre "01/01/1980" dans le champ "rawBirthdate" du formulaire usurpation non connecté
    Et que j'entre "France" dans le champ "rawBirthcountry" du formulaire usurpation non connecté
    Et que j'entre "Melun" dans le champ "rawBirthplace" du formulaire usurpation non connecté
    Et que je continue avec le formulaire usurpation non connecté
    Et que je suis sur la page contact du formulaire usurpation non connecté
    Et que l'étape 5 sur 6 du formulaire usurpation non connecté est affichée
    Et que l'étape du formulaire usurpation non connecté est "Moyens de contact"
    Et que j'entre "test@email.fr" dans le champ "email" du formulaire usurpation non connecté
    Et que j'entre "+33612345678" dans le champ "phone" du formulaire usurpation non connecté
    Et que je continue avec le formulaire usurpation non connecté
    Et que je suis sur la page récapitulatif du formulaire usurpation non connecté
    Et que l'étape 6 sur 6 du formulaire usurpation non connecté est affichée
    Et que l'étape du formulaire usurpation non connecté est "Récapitulatif des informations saisies"
    Et que je coche la case de consentement du formulaire usurpation non connecté
    Quand je valide le formulaire usurpation non connecté
    Alors je suis sur la page confirmation du formulaire usurpation non connecté
    Et le mail "demande de support" est envoyé à "test@email.fr"
    Et le sujet est "Demande de support - signalement usurpation d’identité" dans le mail "demande de support"
    Et le destinataire est le "Support Sécurité" dans le mail "demande de support"
    Et "familyName" est "Family Name" dans le mail "demande de support"
    Et "givenName" est "Given Name" dans le mail "demande de support"
    Et "birthdate" est "01/01/1980" dans le mail "demande de support"
    Et "birthcountry" est "France" dans le mail "demande de support"
    Et "birthplace" est "Melun" dans le mail "demande de support"
    Et "contactEmail" est "test@email.fr" dans le mail "demande de support"
    Et "idpEmail" est "test@email.fr" dans le mail "demande de support"
    Et "phoneNumber" est "+33612345678" dans le mail "demande de support"
    Et "fraudCaseId" est présent dans le mail "demande de support"
    Et "fraudSurveyOrigin" est "identite-inconnue" dans le mail "demande de support"
    Et "authenticationEventId" est "f9c4cb30-1b84-47b3-9438-d5ecb5b5a11d" dans le mail "demande de support"
    Et "comment" est "description de l'usurpation d'identité" dans le mail "demande de support"
    Et le message d'erreur est "impossible de récupérer les account ids à partir de l’identité de l’usager" dans le mail "demande de support"
    Et le fichier "FSP - FSP1-HIGH_connexions.csv" est joint dans le mail "demande de support"
    Et le fichier "fip1-high_connexions.csv" est joint dans le mail "demande de support"

  Scénario: Formulaire usurpation non connecté - cas passant FC v2 et changement de code
    Etant donné que je supprime les mails envoyés à "support.test@franceconnect.gouv.fr"
    Et que je navigue vers la page formulaire usurpation non connecté
    Et que je suis redirigé vers la page description du formulaire usurpation non connecté
    Et que l'étape 1 sur 6 du formulaire usurpation non connecté est affichée
    Et que l'étape du formulaire usurpation non connecté est "Description de l’usurpation"
    Et que j'entre "description de l'usurpation d'identité" dans le champ "description" du formulaire usurpation non connecté
    Et que je continue avec le formulaire usurpation non connecté
    Et que je suis sur la page identification de connexion du formulaire usurpation non connecté
    Et que l'étape 2 sur 6 du formulaire usurpation non connecté est affichée
    Et que l'étape du formulaire usurpation non connecté est "Identification de la connexion"
    Et que j'entre "f9c4cb30-1b84-47b3-9438-d5ecb5b5a11d" dans le champ "code" du formulaire usurpation non connecté
    Et que je continue avec le formulaire usurpation non connecté
    Et que je suis sur la page connexions existantes du formulaire usurpation non connecté
    Et que l'étape 3 sur 6 du formulaire usurpation non connecté est affichée
    Et que l'étape du formulaire usurpation non connecté est "Identification de la connexion"
    Et que 1 connexions existante a été trouvée avec le code d'identification
    Et que je clique pour saisir un nouveau code d'identification
    Et que je suis sur la page identification de connexion du formulaire usurpation non connecté
    Et que l'étape 2 sur 6 du formulaire usurpation non connecté est affichée
    Et que l'étape du formulaire usurpation non connecté est "Identification de la connexion"
    Et que j'entre "1a344d7d-fb1f-432f-99df-01b374c93687" dans le champ "code" du formulaire usurpation non connecté
    Et que je continue avec le formulaire usurpation non connecté
    Et que je suis sur la page connexions existantes du formulaire usurpation non connecté
    Et que l'étape 3 sur 6 du formulaire usurpation non connecté est affichée
    Et que l'étape du formulaire usurpation non connecté est "Identification de la connexion"
    Et que 3 connexions existantes ont été trouvées avec le code d'identification
    Et que je valide les connexions correspondantes
    Et que je suis sur la page identitée usurpée du formulaire usurpation non connecté
    Et que l'étape 4 sur 6 du formulaire usurpation non connecté est affichée
    Et que l'étape du formulaire usurpation non connecté est "Identité de la personne usurpée"
    Et que j'entre "Family Name" dans le champ "family_name" du formulaire usurpation non connecté
    Et que j'entre "Given Name" dans le champ "given_name" du formulaire usurpation non connecté
    Et que j'entre "01/01/1980" dans le champ "rawBirthdate" du formulaire usurpation non connecté
    Et que j'entre "France" dans le champ "rawBirthcountry" du formulaire usurpation non connecté
    Et que j'entre "Melun" dans le champ "rawBirthplace" du formulaire usurpation non connecté
    Et que je continue avec le formulaire usurpation non connecté
    Et que je suis sur la page contact du formulaire usurpation non connecté
    Et que l'étape 5 sur 6 du formulaire usurpation non connecté est affichée
    Et que l'étape du formulaire usurpation non connecté est "Moyens de contact"
    Et que j'entre "test@email.fr" dans le champ "email" du formulaire usurpation non connecté
    Et que j'entre "+33612345678" dans le champ "phone" du formulaire usurpation non connecté
    Et que je continue avec le formulaire usurpation non connecté
    Et que je suis sur la page récapitulatif du formulaire usurpation non connecté
    Et que l'étape 6 sur 6 du formulaire usurpation non connecté est affichée
    Et que l'étape du formulaire usurpation non connecté est "Récapitulatif des informations saisies"
    Et que je coche la case de consentement du formulaire usurpation non connecté
    Quand je valide le formulaire usurpation non connecté
    Alors je suis sur la page confirmation du formulaire usurpation non connecté
    Et le mail "demande de support" est envoyé à "test@email.fr"
    Et le sujet est "Demande de support - signalement usurpation d’identité" dans le mail "demande de support"
    Et le destinataire est le "Support Sécurité" dans le mail "demande de support"
    Et "familyName" est "Family Name" dans le mail "demande de support"
    Et "givenName" est "Given Name" dans le mail "demande de support"
    Et "birthdate" est "01/01/1980" dans le mail "demande de support"
    Et "birthcountry" est "France" dans le mail "demande de support"
    Et "birthplace" est "Melun" dans le mail "demande de support"
    Et "contactEmail" est "test@email.fr" dans le mail "demande de support"
    Et "idpEmail" est "test@email.fr" dans le mail "demande de support"
    Et "phoneNumber" est "+33612345678" dans le mail "demande de support"
    Et "fraudCaseId" est présent dans le mail "demande de support"
    Et "fraudSurveyOrigin" est "identite-inconnue" dans le mail "demande de support"
    Et "authenticationEventId" est "1a344d7d-fb1f-432f-99df-01b374c93687" dans le mail "demande de support"
    Et "comment" est "description de l'usurpation d'identité" dans le mail "demande de support"
    Et le message d'erreur est "impossible de récupérer les account ids à partir de l’identité de l’usager" dans le mail "demande de support"
    Et le fichier "FSP - FSP1-LOW_connexions.csv" est joint dans le mail "demande de support"
    Et le fichier "fip1-low_connexions.csv" est joint dans le mail "demande de support"

  Scénario: Formulaire usurpation non connecté - cas passant FC v1 et mauvais code
    Etant donné que je supprime les mails envoyés à "support.test@franceconnect.gouv.fr"
    Et que je navigue vers la page formulaire usurpation non connecté
    Et que je suis redirigé vers la page description du formulaire usurpation non connecté
    Et que l'étape 1 sur 6 du formulaire usurpation non connecté est affichée
    Et que l'étape du formulaire usurpation non connecté est "Description de l’usurpation"
    Et que j'entre "description de l'usurpation d'identité" dans le champ "description" du formulaire usurpation non connecté
    Et que je continue avec le formulaire usurpation non connecté
    Et que je suis sur la page identification de connexion du formulaire usurpation non connecté
    Et que l'étape 2 sur 6 du formulaire usurpation non connecté est affichée
    Et que l'étape du formulaire usurpation non connecté est "Identification de la connexion"
    Et que j'entre "05695ca2-d711-408d-988f-2e1f6fdf4869" dans le champ "code" du formulaire usurpation non connecté
    Et que je continue avec le formulaire usurpation non connecté
    Et que l'étape 2 sur 6 du formulaire usurpation non connecté est affichée
    Et que l'étape du formulaire usurpation non connecté est "Identification de la connexion"
    Et que aucune connexion existante n'a été trouvée avec le code d'identification
    Et que je suis sur la page identification de connexion du formulaire usurpation non connecté
    Et que l'étape 2 sur 6 du formulaire usurpation non connecté est affichée
    Et que j'entre "f6e5ad20-cb60-488a-9466-c852e2f0785e" dans le champ "code" du formulaire usurpation non connecté
    Et que je continue avec le formulaire usurpation non connecté
    Et que je suis sur la page connexions existantes du formulaire usurpation non connecté
    Et que l'étape 3 sur 6 du formulaire usurpation non connecté est affichée
    Et que l'étape du formulaire usurpation non connecté est "Identification de la connexion"
    Et que 2 connexions existantes ont été trouvées avec le code d'identification
    Et que je valide les connexions correspondantes
    Et que je suis sur la page identitée usurpée du formulaire usurpation non connecté
    Et que l'étape 4 sur 6 du formulaire usurpation non connecté est affichée
    Et que l'étape du formulaire usurpation non connecté est "Identité de la personne usurpée"
    Et que j'entre "Family Name" dans le champ "family_name" du formulaire usurpation non connecté
    Et que j'entre "Given Name" dans le champ "given_name" du formulaire usurpation non connecté
    Et que j'entre "01/01/1980" dans le champ "rawBirthdate" du formulaire usurpation non connecté
    Et que j'entre "France" dans le champ "rawBirthcountry" du formulaire usurpation non connecté
    Et que j'entre "Melun" dans le champ "rawBirthplace" du formulaire usurpation non connecté
    Et que je continue avec le formulaire usurpation non connecté
    Et que je suis sur la page contact du formulaire usurpation non connecté
    Et que l'étape 5 sur 6 du formulaire usurpation non connecté est affichée
    Et que l'étape du formulaire usurpation non connecté est "Moyens de contact"
    Et que j'entre "test@email.fr" dans le champ "email" du formulaire usurpation non connecté
    Et que j'entre "+33612345678" dans le champ "phone" du formulaire usurpation non connecté
    Et que je continue avec le formulaire usurpation non connecté
    Et que je suis sur la page récapitulatif du formulaire usurpation non connecté
    Et que l'étape 6 sur 6 du formulaire usurpation non connecté est affichée
    Et que l'étape du formulaire usurpation non connecté est "Récapitulatif des informations saisies"
    Et que je coche la case de consentement du formulaire usurpation non connecté
    Quand je valide le formulaire usurpation non connecté
    Alors je suis sur la page confirmation du formulaire usurpation non connecté
    Et le mail "demande de support" est envoyé à "test@email.fr"
    Et le sujet est "Demande de support - signalement usurpation d’identité" dans le mail "demande de support"
    Et le destinataire est le "Support Sécurité" dans le mail "demande de support"
    Et "familyName" est "Family Name" dans le mail "demande de support"
    Et "givenName" est "Given Name" dans le mail "demande de support"
    Et "birthdate" est "01/01/1980" dans le mail "demande de support"
    Et "birthcountry" est "France" dans le mail "demande de support"
    Et "birthplace" est "Melun" dans le mail "demande de support"
    Et "contactEmail" est "test@email.fr" dans le mail "demande de support"
    Et "idpEmail" est "test@email.fr" dans le mail "demande de support"
    Et "phoneNumber" est "+33612345678" dans le mail "demande de support"
    Et "fraudCaseId" est présent dans le mail "demande de support"
    Et "fraudSurveyOrigin" est "identite-inconnue" dans le mail "demande de support"
    Et "authenticationEventId" est "f6e5ad20-cb60-488a-9466-c852e2f0785e" dans le mail "demande de support"
    Et "comment" est "description de l'usurpation d'identité" dans le mail "demande de support"
    Et le message d'erreur est "impossible de récupérer les account ids à partir de l’identité de l’usager" dans le mail "demande de support"
    Et le fichier "Service Provider Example_connexions.csv" est joint dans le mail "demande de support"
    Et le fichier "fip1-no-discovery_connexions.csv" est joint dans le mail "demande de support"

  Scénario: Formulaire usurpation - identification de connexion - accordéon
    Etant donné que je navigue vers la page formulaire usurpation non connecté
    Et que je suis redirigé vers la page description du formulaire usurpation non connecté
    Et que j'entre "description de l'usurpation d'identité" dans le champ "description" du formulaire usurpation non connecté
    Et que je continue avec le formulaire usurpation non connecté
    Et que je suis sur la page identification de connexion du formulaire usurpation non connecté
    Et que le contenu de l'accordéon de code d'identification n'est pas affiché
    Quand je clique sur l'accordéon de code d'identification
    Et le contenu de l'accordéon de code d'identification est affiché
    Et je clique sur l'accordéon de code d'identification
    Alors le contenu de l'accordéon de code d'identification n'est pas affiché
