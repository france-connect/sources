#language: fr
@userDashboard @fraude @fraudeFormulaireUsurpation @ci @ignoreInteg01
Fonctionnalité: Formulaire Usurpation non connecté - Erreur

  Contexte: Initialisation des traces dans elasticsearch
    Etant donné que j'initialise les traces dans elasticsearch pour le test "fraude-usurpation-non-connecte"

  Scénario: Formulaire usurpation - description - erreur
    Etant donné que je navigue vers la page formulaire usurpation non connecté
    Et que je suis redirigé vers la page description du formulaire usurpation non connecté
    Et que l'étape 1 sur 6 du formulaire usurpation non connecté est affichée
    Et que l'étape du formulaire usurpation non connecté est "Description de l’usurpation"
    Quand je continue avec le formulaire usurpation non connecté
    Alors je suis sur la page description du formulaire usurpation non connecté
    Et le champ "description" a une erreur "Veuillez renseigner l’information demandée. Seuls les lettres et chiffres sont autorisés." dans le formulaire usurpation non connecté

  Scénario: Formulaire usurpation - identification de connexion - erreur
    Etant donné que je navigue vers la page formulaire usurpation non connecté
    Et que je suis redirigé vers la page description du formulaire usurpation non connecté
    Et que j'entre "description de l'usurpation d'identité" dans le champ "description" du formulaire usurpation non connecté
    Et que je continue avec le formulaire usurpation non connecté
    Et que je suis sur la page identification de connexion du formulaire usurpation non connecté
    Quand je continue avec le formulaire usurpation non connecté
    Et le champ "code" a une erreur "Le code renseigné n’est pas valide" dans le formulaire usurpation non connecté
    Et j'entre "123" dans le champ "code" du formulaire usurpation non connecté
    Et je continue avec le formulaire usurpation non connecté
    Alors le champ "code" a une erreur "Le code renseigné n’est pas valide" dans le formulaire usurpation non connecté

  Scénario: Formulaire usurpation - identitée usurpée - erreur
    Etant donné que je navigue vers la page formulaire usurpation non connecté
    Et que je suis redirigé vers la page description du formulaire usurpation non connecté
    Et que j'entre "description de l'usurpation d'identité" dans le champ "description" du formulaire usurpation non connecté
    Et que je continue avec le formulaire usurpation non connecté
    Et que je suis sur la page identification de connexion du formulaire usurpation non connecté
    Et que j'entre "f9c4cb30-1b84-47b3-9438-d5ecb5b5a11d" dans le champ "code" du formulaire usurpation non connecté
    Et que je continue avec le formulaire usurpation non connecté
    Et que je suis sur la page connexions existantes du formulaire usurpation non connecté
    Et que je valide les connexions correspondantes
    Et que je suis sur la page identitée usurpée du formulaire usurpation non connecté
    Quand je continue avec le formulaire usurpation non connecté
    Alors le champ "family_name" a une erreur "Veuillez renseigner l'information demandée." dans le formulaire usurpation non connecté
    Et le champ "given_name" a une erreur "Veuillez renseigner l'information demandée." dans le formulaire usurpation non connecté
    Et le champ "rawBirthdate" a une erreur "Veuillez renseigner l'information demandée." dans le formulaire usurpation non connecté
    Et le champ "rawBirthcountry" a une erreur "Veuillez renseigner l'information demandée." dans le formulaire usurpation non connecté
    Et le champ "rawBirthplace" a une erreur "Veuillez renseigner l'information demandée." dans le formulaire usurpation non connecté

  Scénario: Formulaire usurpation - contact - erreur
    Etant donné que je navigue vers la page formulaire usurpation non connecté
    Et que je suis redirigé vers la page description du formulaire usurpation non connecté
    Et que j'entre "description de l'usurpation d'identité" dans le champ "description" du formulaire usurpation non connecté
    Et que je continue avec le formulaire usurpation non connecté
    Et que je suis sur la page identification de connexion du formulaire usurpation non connecté
    Et que j'entre "f9c4cb30-1b84-47b3-9438-d5ecb5b5a11d" dans le champ "code" du formulaire usurpation non connecté
    Et que je continue avec le formulaire usurpation non connecté
    Et que je suis sur la page connexions existantes du formulaire usurpation non connecté
    Et que je valide les connexions correspondantes
    Et que je suis sur la page identitée usurpée du formulaire usurpation non connecté
    Et que j'entre "Family Name" dans le champ "family_name" du formulaire usurpation non connecté
    Et que j'entre "Given Name" dans le champ "given_name" du formulaire usurpation non connecté
    Et que j'entre "01/01/1980" dans le champ "rawBirthdate" du formulaire usurpation non connecté
    Et que j'entre "France" dans le champ "rawBirthcountry" du formulaire usurpation non connecté
    Et que j'entre "Melun" dans le champ "rawBirthplace" du formulaire usurpation non connecté
    Et que je continue avec le formulaire usurpation non connecté
    Et que je suis sur la page contact du formulaire usurpation non connecté
    Quand je continue avec le formulaire usurpation non connecté
    Et le champ "email" a une erreur "Veuillez renseigner l'information demandée." dans le formulaire usurpation non connecté
    Et le champ "phone" n'a pas d'erreur dans le formulaire usurpation non connecté
    Et j'entre "mauvais email" dans le champ "email" du formulaire usurpation non connecté
    Et j'entre "+33634567890" dans le champ "phone" du formulaire usurpation non connecté
    Et je continue avec le formulaire usurpation non connecté
    Alors le champ "email" a une erreur "Veuillez renseigner l'information demandée." dans le formulaire usurpation non connecté
    Et le champ "phone" n'a pas d'erreur dans le formulaire usurpation non connecté

  Scénario: Formulaire usurpation - récapitualitif - erreur
    Etant donné que je supprime les mails envoyés à "support.test@franceconnect.gouv.fr"
    Et que je navigue vers la page formulaire usurpation non connecté
    Et que je suis redirigé vers la page description du formulaire usurpation non connecté
    Et que j'entre "description de l'usurpation d'identité" dans le champ "description" du formulaire usurpation non connecté
    Et que je continue avec le formulaire usurpation non connecté
    Et que je suis sur la page identification de connexion du formulaire usurpation non connecté
    Et que j'entre "f9c4cb30-1b84-47b3-9438-d5ecb5b5a11d" dans le champ "code" du formulaire usurpation non connecté
    Et que je continue avec le formulaire usurpation non connecté
    Et que je suis sur la page connexions existantes du formulaire usurpation non connecté
    Et que je valide les connexions correspondantes
    Et que je suis sur la page identitée usurpée du formulaire usurpation non connecté
    Et que j'entre "Family Name" dans le champ "family_name" du formulaire usurpation non connecté
    Et que j'entre "Given Name" dans le champ "given_name" du formulaire usurpation non connecté
    Et que j'entre "01/01/1980" dans le champ "rawBirthdate" du formulaire usurpation non connecté
    Et que j'entre "France" dans le champ "rawBirthcountry" du formulaire usurpation non connecté
    Et que j'entre "Melun" dans le champ "rawBirthplace" du formulaire usurpation non connecté
    Et que je continue avec le formulaire usurpation non connecté
    Et que je suis sur la page contact du formulaire usurpation non connecté
    Et que j'entre "test@email.fr" dans le champ "email" du formulaire usurpation non connecté
    Et que j'entre "+33612345678" dans le champ "phone" du formulaire usurpation non connecté
    Et que je continue avec le formulaire usurpation non connecté
    Et que je suis sur la page récapitulatif du formulaire usurpation non connecté
    Quand je valide le formulaire usurpation non connecté
    Alors le champ "consent" a une erreur "Veuillez accepter la demande pour envoyer votre signalement" dans le formulaire usurpation non connecté

  Scénario: Formulaire usurpation - récapitulatif - erreur après décochage
    Etant donné que je supprime les mails envoyés à "support.test@franceconnect.gouv.fr"
    Et que je navigue vers la page formulaire usurpation non connecté
    Et que je suis redirigé vers la page description du formulaire usurpation non connecté
    Et que j'entre "description de l'usurpation d'identité" dans le champ "description" du formulaire usurpation non connecté
    Et que je continue avec le formulaire usurpation non connecté
    Et que je suis sur la page identification de connexion du formulaire usurpation non connecté
    Et que j'entre "f9c4cb30-1b84-47b3-9438-d5ecb5b5a11d" dans le champ "code" du formulaire usurpation non connecté
    Et que je continue avec le formulaire usurpation non connecté
    Et que je suis sur la page connexions existantes du formulaire usurpation non connecté
    Et que je valide les connexions correspondantes
    Et que je suis sur la page identitée usurpée du formulaire usurpation non connecté
    Et que j'entre "Family Name" dans le champ "family_name" du formulaire usurpation non connecté
    Et que j'entre "Given Name" dans le champ "given_name" du formulaire usurpation non connecté
    Et que j'entre "01/01/1980" dans le champ "rawBirthdate" du formulaire usurpation non connecté
    Et que j'entre "France" dans le champ "rawBirthcountry" du formulaire usurpation non connecté
    Et que j'entre "Melun" dans le champ "rawBirthplace" du formulaire usurpation non connecté
    Et que je continue avec le formulaire usurpation non connecté
    Et que je suis sur la page contact du formulaire usurpation non connecté
    Et que j'entre "test@email.fr" dans le champ "email" du formulaire usurpation non connecté
    Et que j'entre "+33612345678" dans le champ "phone" du formulaire usurpation non connecté
    Et que je continue avec le formulaire usurpation non connecté
    Et que je suis sur la page récapitulatif du formulaire usurpation non connecté
    Et que je coche la case de consentement du formulaire usurpation non connecté
    Et que je décoche la case de consentement du formulaire usurpation non connecté
    Quand je valide le formulaire usurpation non connecté
    Alors le champ "consent" a une erreur "Veuillez accepter la demande pour envoyer votre signalement" dans le formulaire usurpation non connecté
