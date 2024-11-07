#language: fr
@userDashboard @fraude @fraudeConnexion @ci
Fonctionnalité: Connexion Formulaire Usurpation
  # En tant qu'usager de FranceConnect,
  # je veux me connecter au formulaire usurpation
  # afin de signaler un cas d'usurpation d'identité

  Scénario: Formulaire Usurpation - Redirection vers le questionnaire fraude
    Etant donné que je navigue sur la page de connexion du formulaire usurpation
    Et que je me connecte pour accéder au formulaire usurpation
    Et que je suis redirigé vers la page formulaire usurpation
    Et que le bouton vers le questionnaire fraude est affiché
    Quand je clique sur le button vers le questionnaire fraude
    Alors je suis redirigé vers le questionnaire fraude

  Scénario: Formulaire Usurpation - Connexion avec fraudSurveyOrigin dans le local storage
    Etant donné que je navigue sur la page de connexion du formulaire usurpation
    Et que je force la donnée "fraudSurveyOrigin" à "identite-inconnue" dans le localStorage
    Quand je me connecte pour accéder au formulaire usurpation
    Alors je suis redirigé vers la page formulaire usurpation
    Et le formulaire usurpation est affiché
    Et le lien de déconnexion du tableau de bord usager est affiché
    Et je me déconnecte du tableau de bord usager

  Scénario: Formulaire Usurpation - Connexion avec fraudSurveyOrigin expiré dans le local storage
    Etant donné que je navigue sur la page de connexion du formulaire usurpation
    Et que je force la donnée "fraudSurveyOrigin" à "identite-inconnue" dans le localStorage datée d'il y a 31 minutes
    Quand je me connecte pour accéder au formulaire usurpation
    Alors je suis redirigé vers la page formulaire usurpation
    Et le bouton vers le questionnaire fraude est affiché
    Et le localStorage ne contient pas la donnée "fraudSurveyOrigin"

  Scénario: Formulaire Usurpation - Connexion avec le paramètre fraudSurveyOrigin
    Etant donné que je navigue directement vers la page formulaire usurpation avec le paramètre fraudSurveyOrigin égal à "identite-inconnue"
    Et que je suis redirigé vers la page de connexion du formulaire usurpation
    Quand je me connecte pour accéder au formulaire usurpation
    Alors je suis redirigé vers la page formulaire usurpation avec le paramètre fraudSurveyOrigin égal à "identite-inconnue"
    Et le formulaire usurpation est affiché
    Et le localStorage contient la donnée "fraudSurveyOrigin" égale à "identite-inconnue"
    Et le lien de déconnexion du tableau de bord usager est affiché
    Et je me déconnecte du tableau de bord usager

  Scénario: Formulaire Usurpation - Présence du lien vers le Formulaire Usager sur la page de connexion
    Etant donné que je navigue directement vers la page formulaire usurpation avec le paramètre fraudSurveyOrigin égal à "identite-inconnue"
    Quand je suis redirigé vers la page de connexion du formulaire usurpation
    Alors le lien vers l'application Formulaire Usager est affiché sur la page de connexion du formulaire usurpation
    Et le lien vers l'application Formulaire Usager comporte la valeur "identite-inconnue" pour le paramètre fraudSurveyOrigin

  Scénario: Formulaire Usurpation - Déconnexion
    Etant donné que je navigue sur la page de connexion du formulaire usurpation
    Et que je force la donnée "fraudSurveyOrigin" à "identite-inconnue" dans le localStorage
    Et que je me connecte pour accéder au formulaire usurpation
    Et que je suis redirigé vers la page formulaire usurpation
    Quand je me déconnecte du tableau de bord usager
    Alors je suis redirigé vers la page de connexion du formulaire usurpation
    Et le localStorage ne contient pas la donnée "fraudSurveyOrigin"
    Et le message d'alerte "session expirée" n'est pas affiché sur la page de connexion du formulaire usurpation
    Et je ne suis plus connecté au tableau de bord usager avec FranceConnect

  Scénario: Formulaire Usurpation - Chargement du formulaire usurpation après déconnexion
    Etant donné que je navigue sur la page de connexion du formulaire usurpation
    Et que je force la donnée "fraudSurveyOrigin" à "identite-inconnue" dans le localStorage
    Et que je me connecte pour accéder au formulaire usurpation
    Et que je suis redirigé vers la page formulaire usurpation
    Et que je me déconnecte du tableau de bord usager
    Et que je suis redirigé vers la page de connexion du formulaire usurpation
    Quand je navigue directement vers la page formulaire usurpation
    Alors je suis redirigé vers la page de connexion du formulaire usurpation
    Et le message d'alerte "session expirée" n'est pas affiché sur la page de connexion du formulaire usurpation
    Et je ne suis plus connecté au tableau de bord usager avec FranceConnect
