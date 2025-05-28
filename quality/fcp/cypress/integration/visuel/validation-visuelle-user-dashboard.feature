#language: fr
@validationVisuelle @userDashboard
Fonctionnalité: Validation Visuelle - User Dashboard

  Scénario: Validation Visuelle - Réinitialiser les Préférences FI
    Etant donné que j'utilise un compte usager "pour le test de préférences FI"
    Et que je navigue sur la page d'accueil du tableau de bord usager
    Et que je me connecte au tableau de bord usager
    Et que je suis redirigé vers la page historique du tableau de bord usager
    Et que je navigue directement vers la page gestion des accès du tableau de bord usager
    Et que je suis sur la page gestion des accès du tableau de bord usager
    Quand je réinitialise les préférences de la configuration par défaut

  Plan du Scénario: Validation Visuelle - Historique des connexions sur <device>
    Etant donné que j'utilise un compte usager "pour les tests de traces"
    Et que j'utilise un navigateur web sur "<device>"
    Et que les traces "FranceConnect(CL) et FranceConnect+" contiennent "des connexions récentes et anciennes de plus de 6 mois"
    Et que je navigue sur la page d'accueil du tableau de bord usager
    Et que la copie d'écran "udHome" correspond à la page actuelle sur "<device>"
    Quand je me connecte au tableau de bord usager
    Alors je suis redirigé vers la page historique du tableau de bord usager
    Et 3 évènements "FranceConnect+" sont affichés
    Et 7 évènements "FranceConnect" sont affichés
    Et les évènements "FranceConnect+" ont moins de 6 mois
    Et les évènements "FranceConnect" ont moins de 6 mois
    Et la copie d'écran "udHistory" correspond à la page actuelle sur "<device>"
    Et j'affiche le détail de tous les évènements
    Et la copie d'écran "udHistoryDetail" correspond à la page actuelle sur "<device>"

    Exemples:
      | device           |
      | mobile           |
      | tablet portrait  |
      | tablet landscape |
      | desktop          |

  Plan du Scénario: Validation Visuelle - Connexion usurpation sur <device>
    Etant donné que j'utilise un compte usager "par défaut"
    Et que j'utilise un navigateur web sur "<device>"
    Quand je navigue sur la page de connexion du formulaire usurpation
    Alors la copie d'écran "udFraudLogin" correspond à la page actuelle sur "<device>"

    Exemples:
      | device           |
      | mobile           |
      | tablet portrait  |
      | tablet landscape |
      | desktop          |

  Plan du Scénario: Validation Visuelle - Redirection vers le questionnaire fraude sur <device>
    Etant donné que j'utilise un compte usager "par défaut"
    Et que j'utilise un navigateur web sur "<device>"
    Et que je navigue sur la page de connexion du formulaire usurpation
    Quand je me connecte pour accéder au formulaire usurpation
    Alors je suis redirigé vers la page formulaire usurpation
    Et le bouton vers le questionnaire fraude est affiché
    Et la copie d'écran "udRedirectToFraudSurvey" correspond à la page actuelle sur "<device>"

    Exemples:
      | device           |
      | mobile           |
      | tablet portrait  |
      | tablet landscape |
      | desktop          |

  Plan du Scénario: Validation Visuelle - Formulaire usurpation sur <device>
    Etant donné que j'utilise un compte usager "par défaut"
    Et que j'utilise un navigateur web sur "<device>"
    Et que je navigue directement vers la page formulaire usurpation avec le paramètre fraudSurveyOrigin égal à "identite-inconnue"
    Et que je suis redirigé vers la page de connexion du formulaire usurpation
    Quand je me connecte pour accéder au formulaire usurpation
    Alors je suis redirigé vers la page formulaire usurpation
    Et le formulaire usurpation est affiché
    Et la copie d'écran "udFraudForm" correspond à la page actuelle sur "<device>"

    Exemples:
      | device           |
      | mobile           |
      | tablet portrait  |
      | tablet landscape |
      | desktop          |

  Plan du Scénario: Validation Visuelle - Confirmation d'envoie du formulaire usurpation sur <device>
    Etant donné que j'utilise un compte usager "par défaut"
    Et que j'utilise un navigateur web sur "<device>"
    Et que je navigue directement vers la page formulaire usurpation avec le paramètre fraudSurveyOrigin égal à "identite-inconnue"
    Et que je suis redirigé vers la page de connexion du formulaire usurpation
    Et que je me connecte pour accéder au formulaire usurpation
    Et que je suis redirigé vers la page formulaire usurpation
    Et que le formulaire usurpation est affiché
    Quand j'entre les valeurs par défaut sur le formulaire usurpation
    Et je coche la case de consentement du formulaire usurpation
    Et je valide le formulaire usurpation
    Alors la demande de support est prise en compte
    Et la copie d'écran "udFraudFormSent" correspond à la page actuelle sur "<device>"

    Exemples:
      | device           |
      | mobile           |
      | tablet portrait  |
      | tablet landscape |
      | desktop          |

  Plan du Scénario: Formulaire usurpation - Erreurs formulaire usurpation
    Etant donné que j'utilise un compte usager "par défaut"
    Et que j'utilise un navigateur web sur "<device>"
    Et que je navigue directement vers la page formulaire usurpation avec le paramètre fraudSurveyOrigin égal à "identite-inconnue"
    Et que je suis redirigé vers la page de connexion du formulaire usurpation
    Et que je me connecte pour accéder au formulaire usurpation
    Et que je suis redirigé vers la page formulaire usurpation
    Et que le formulaire usurpation est affiché
    Quand j'entre "bad authentication event id" dans le champ "authenticationEventId" du formulaire usurpation
    Et je valide le formulaire usurpation
    Alors le champ "authenticationEventId" a une erreur "Le code est erroné, veuillez vérifier sa valeur" dans le formulaire usurpation
    Et le champ "acceptTransmitData" a une erreur "Veuillez cocher cette case si vous souhaitez continuer" dans le formulaire usurpation
    Et la copie d'écran "udFraudFormError" correspond à la page actuelle sur "<device>"

    Exemples:
      | device           |
      | mobile           |
      | tablet portrait  |
      | tablet landscape |
      | desktop          |

  @ignoreInteg01
  Plan du Scénario: Validation Visuelle - Ticket OTRS avec 1 trace sur <device>
    Etant donné que les traces "FranceConnect(v2)" contiennent "1 connexion"
    Et que j'utilise un compte usager "pour les tests de traces"
    Et que je supprime les mails envoyés à l'usager
    Et que j'utilise un navigateur web sur "<device>"
    Et que je navigue sur la page de connexion du formulaire usurpation
    Et que je force la donnée "fraudSurveyOrigin" à "identite-inconnue" dans le localStorage
    Et que je me connecte pour accéder au formulaire usurpation
    Et que je suis redirigé vers la page formulaire usurpation
    Et que le formulaire usurpation est affiché
    Quand j'entre les valeurs par défaut sur le formulaire usurpation
    Et j'entre "1a344d7d-fb1f-432f-99df-01b374c93687" dans le champ "authenticationEventId" du formulaire usurpation
    Et je coche la case de consentement du formulaire usurpation
    Et je valide le formulaire usurpation
    Alors le mail "demande de support" est envoyé
    Et la copie d'écran "udFraudTicketWithOneTrack" correspond à la page actuelle sur "<device>"

    Exemples:
      | device           |
      # | tablet portrait  | Deactivated because of diff issues between CI and local stack
      | tablet landscape |
      | desktop          |

  @ignoreInteg01
  Plan du Scénario: Validation Visuelle - Ticket OTRS avec 2 traces sur <device>
    Etant donné que les traces "FranceConnect(v2)" contiennent "2 connexions"
    Et que j'utilise un compte usager "pour les tests de traces"
    Et que je supprime les mails envoyés à l'usager
    Et que j'utilise un navigateur web sur "<device>"
    Et que je navigue sur la page de connexion du formulaire usurpation
    Et que je force la donnée "fraudSurveyOrigin" à "identite-inconnue" dans le localStorage
    Et que je me connecte pour accéder au formulaire usurpation
    Et que je suis redirigé vers la page formulaire usurpation
    Et que le formulaire usurpation est affiché
    Quand j'entre les valeurs par défaut sur le formulaire usurpation
    Et j'entre "1a344d7d-fb1f-432f-99df-01b374c93687" dans le champ "authenticationEventId" du formulaire usurpation
    Et je coche la case de consentement du formulaire usurpation
    Et je valide le formulaire usurpation
    Alors le mail "demande de support" est envoyé
    Et la copie d'écran "udFraudTicketWithTwoTracks" correspond à la page actuelle sur "<device>"

    Exemples:
      | device           |
      | tablet portrait  |
      | tablet landscape |
      | desktop          |

  Plan du Scénario: Validation Visuelle - Préférences FI sur <device>
    Etant donné que j'utilise un compte usager "pour le test de préférences FI"
    Et que j'utilise un navigateur web sur "<device>"
    Et que je navigue sur la page d'accueil du tableau de bord usager
    Et que je me connecte au tableau de bord usager
    Et que je suis redirigé vers la page historique du tableau de bord usager
    Quand je navigue directement vers la page gestion des accès du tableau de bord usager
    Alors la copie d'écran "udPreferences" correspond à la page actuelle sur "<device>"

    Exemples:
      | device           |
      | tablet portrait  |
      | tablet landscape |
      | desktop          |

  Scénario: Validation Visuelle - Préférences FI sur mobile
    Etant donné que j'utilise un compte usager "pour le test de préférences FI"
    Et que j'utilise un navigateur web sur "mobile"
    Et que je navigue sur la page d'accueil du tableau de bord usager
    Et que je me connecte au tableau de bord usager
    Et que je suis redirigé vers la page historique du tableau de bord usager
    Quand j'ouvre le menu de navigation mobile du tableau de bord usager
    Et la copie d'écran "udNavMobile" correspond à la page actuelle sur "mobile"
    Et je clique sur le lien gérer mes accés dans le menu de navigation mobile
    Alors je suis redirigé vers la page gestion des accès du tableau de bord usager
    Et la copie d'écran "udPreferences" correspond à la page actuelle sur "mobile"

  Plan du Scénario: Validation Visuelle - Mail de modification des Préférences FI sur <device>
    Etant donné que j'utilise un compte usager "pour le test de préférences FI"
    Et que j'utilise un navigateur web sur "<device>"
    Et que je navigue sur la page d'accueil du tableau de bord usager
    Et que je me connecte au tableau de bord usager
    Et que je suis redirigé vers la page historique du tableau de bord usager
    Et que je navigue directement vers la page gestion des accès du tableau de bord usager
    Et que je suis sur la page gestion des accès du tableau de bord usager
    Et que je réinitialise les préférences de la configuration par défaut
    Et que je supprime les mails envoyés à l'usager
    Et que j'utilise le fournisseur d'identité "pour le test de préférences FI"
    Et que je décide de bloquer le fournisseur d'identité
    Et que je décide d'autoriser les futurs fournisseurs d'identité par défaut
    Et que je confirme le message "autorisation des futurs fournisseurs d'identité"
    Quand je clique sur le bouton "enregistrer mes réglages"
    Alors le message "notification de modifications envoyée" est affiché
    Et le mail "modification de préférences FI" est envoyé
    Et la copie d'écran "udPreferencesMail" correspond à la page actuelle sur "<device>"

    Exemples:
      | device           |
      | mobile           |
      | tablet portrait  |
      | tablet landscape |
      | desktop          |

  Plan du Scénario: Validation Visuelle - Page Mentions Légales sur <device>
    Etant donné que j'utilise un navigateur web sur "<device>"
    Et que je navigue sur la page d'accueil du tableau de bord usager
    Quand je clique sur le lien "Mentions légales" dans le footer
    Alors je suis redirigé vers la page mentions légales
    Et la copie d'écran "legal-notices" correspond à la page actuelle sur "<device>"

    Exemples:
      | device           |
      | mobile           |
      | tablet portrait  |
      | tablet landscape |
      | desktop          |

  # @TODO
  # Plan du Scénario: Validation Visuelle - Page Signalement Usurpation sur <device>
  #   Etant donné que j'utilise un navigateur web sur "<device>"
  #   Et que je navigue sur la page d'accueil du tableau de bord usager
  #   Quand je clique sur le lien "Signaler une usurpation" dans le footer
  #   Alors je suis redirigé vers la page signalement usurpation
  #   Et la copie d'écran "fishing-report" correspond à la page actuelle sur "<device>"

  #   Exemples:
  #     | device           |
  #     | mobile           |
  #     | tablet portrait  |
  #     | tablet landscape |
  #     | desktop          |
