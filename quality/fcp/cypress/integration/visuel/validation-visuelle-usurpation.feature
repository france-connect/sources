#language: fr
@validationVisuelle @userDashboard
Fonctionnalité: Validation Visuelle - User Dashboard - Usurpation

  Contexte: Initialisation des traces dans elasticsearch
    Etant donné que j'initialise les traces dans elasticsearch pour le test "fraude-usurpation-non-connecte"

  Plan du Scénario: Usurpation connecté - Connexion usurpation sur <device>
    Etant donné que j'utilise un compte usager "par défaut"
    Et que j'utilise un navigateur web sur "<device>"
    Quand je navigue sur la page de connexion du formulaire usurpation
    Alors la copie d'écran "udFraudConnected_login" correspond à la page actuelle sur "<device>"

    Exemples:
      | device           |
      | mobile           |
      | tablet portrait  |
      | tablet landscape |
      | desktop          |

  Plan du Scénario: Usurpation connecté - Redirection vers le questionnaire fraude sur <device>
    Etant donné que j'utilise un compte usager "par défaut"
    Et que j'utilise un navigateur web sur "<device>"
    Et que je navigue sur la page de connexion du formulaire usurpation
    Quand je me connecte pour accéder au formulaire usurpation
    Alors je suis redirigé vers la page formulaire usurpation
    Et le bouton vers le questionnaire fraude est affiché
    Et la copie d'écran "udFraudConnected_redirection" correspond à la page actuelle sur "<device>"

    Exemples:
      | device           |
      | mobile           |
      | tablet portrait  |
      | tablet landscape |
      | desktop          |

  Plan du Scénario: Usurpation connecté - Formulaire usurpation sur <device>
    Etant donné que j'utilise un compte usager "par défaut"
    Et que j'utilise un navigateur web sur "<device>"
    Et que je navigue directement vers la page formulaire usurpation avec le paramètre fraudSurveyOrigin égal à "identite-inconnue"
    Et que je suis redirigé vers la page de connexion du formulaire usurpation
    Quand je me connecte pour accéder au formulaire usurpation
    Alors je suis redirigé vers la page formulaire usurpation
    Et le formulaire usurpation est affiché
    Et la copie d'écran "udFraudConnected_form" correspond à la page actuelle sur "<device>"

    Exemples:
      | device           |
      | mobile           |
      | tablet portrait  |
      | tablet landscape |
      | desktop          |

  Plan du Scénario: Usurpation connecté - Confirmation d'envoie du formulaire usurpation sur <device>
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
    Et la copie d'écran "udFraudConnected_success" correspond à la page actuelle sur "<device>"

    Exemples:
      | device           |
      | mobile           |
      | tablet portrait  |
      | tablet landscape |
      | desktop          |

  Plan du Scénario: Usurpation connecté - Erreurs formulaire usurpation
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
    Et la copie d'écran "udFraudConnected_error" correspond à la page actuelle sur "<device>"

    Exemples:
      | device           |
      | mobile           |
      | tablet portrait  |
      | tablet landscape |
      | desktop          |

  Plan du Scénario: Usurpation connecté - Ticket OTRS FC+ sur <device>
    Etant donné que j'utilise un compte usager "pour les tests de traces"
    Et que je supprime les mails envoyés à l'usager
    Et que j'utilise un navigateur web sur "<device>"
    Et que je navigue sur la page de connexion du formulaire usurpation
    Et que je force la donnée "fraudSurveyOrigin" à "identite-inconnue" dans le localStorage
    Et que je me connecte pour accéder au formulaire usurpation
    Et que je suis redirigé vers la page formulaire usurpation
    Et que le formulaire usurpation est affiché
    Quand j'entre les valeurs par défaut sur le formulaire usurpation
    Et j'entre "f9c4cb30-1b84-47b3-9438-d5ecb5b5a11d" dans le champ "authenticationEventId" du formulaire usurpation
    Et je coche la case de consentement du formulaire usurpation
    Et je valide le formulaire usurpation
    Alors le mail "demande de support" est envoyé
    Et la copie d'écran "udFraudConnected_FCHigh_mail" correspond à la page actuelle sur "<device>"

    Exemples:
      | device           |
      # | tablet portrait  | Deactivated because of diff issues between CI and local stack
      | tablet landscape |
      | desktop          |

  Plan du Scénario: Usurpation connecté - Ticket OTRS FC v2 sur <device>
    Etant donné que j'utilise un compte usager "pour les tests de traces"
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
    Et la copie d'écran "udFraudConnected_FCLow_mail" correspond à la page actuelle sur "<device>"

    Exemples:
      | device           |
      | tablet portrait  |
      | tablet landscape |
      | desktop          |

  Plan du Scénario: Usurpation non connecté - cas passant FC+ sur <device>
    Etant donné que je supprime les mails envoyés à "support.test@franceconnect.gouv.fr"
    Et que j'utilise un navigateur web sur "<device>"
    Et que je navigue vers la page formulaire usurpation non connecté
    Et que je suis redirigé vers la page description du formulaire usurpation non connecté
    Et que la copie d'écran "udFraudNotConnected_step1" correspond à la page actuelle sur "<device>"
    Et que j'entre dans le champ "description" du formulaire usurpation non connecté le texte multi ligne :
    """
    description de l'usurpation d'identité
    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
    plusieurs
    lignes
    merci.
    """
    Et que je continue avec le formulaire usurpation non connecté
    Et que je suis sur la page identification de connexion du formulaire usurpation non connecté
    Et que la copie d'écran "udFraudNotConnected_step2" correspond à la page actuelle sur "<device>"
    Et que j'entre "f9c4cb30-1b84-47b3-9438-d5ecb5b5a11d" dans le champ "code" du formulaire usurpation non connecté
    Et que je continue avec le formulaire usurpation non connecté
    Et que je suis sur la page connexions existantes du formulaire usurpation non connecté
    Et que la copie d'écran "udFraudNotConnected_step3_1connection" correspond à la page actuelle sur "<device>"
    Et que je valide les connexions correspondantes
    Et que je suis sur la page identitée usurpée du formulaire usurpation non connecté
    Et que la copie d'écran "udFraudNotConnected_step4" correspond à la page actuelle sur "<device>"
    Et que j'entre "Family Name" dans le champ "family_name" du formulaire usurpation non connecté
    Et que j'entre "Given Name" dans le champ "given_name" du formulaire usurpation non connecté
    Et que j'entre "01/01/1980" dans le champ "rawBirthdate" du formulaire usurpation non connecté
    Et que j'entre "France" dans le champ "rawBirthcountry" du formulaire usurpation non connecté
    Et que j'entre "Melun" dans le champ "rawBirthplace" du formulaire usurpation non connecté
    Et que je continue avec le formulaire usurpation non connecté
    Et que je suis sur la page contact du formulaire usurpation non connecté
    Et que la copie d'écran "udFraudNotConnected_step5" correspond à la page actuelle sur "<device>"
    Et que j'entre "test@email.fr" dans le champ "email" du formulaire usurpation non connecté
    Et que j'entre "+33612345678" dans le champ "phone" du formulaire usurpation non connecté
    Et que je continue avec le formulaire usurpation non connecté
    Et que je suis sur la page récapitulatif du formulaire usurpation non connecté
    Et que la copie d'écran "udFraudNotConnected_step6_1connection" correspond à la page actuelle sur "<device>"
    Et que je coche la case de consentement du formulaire usurpation non connecté
    Quand je valide le formulaire usurpation non connecté
    Alors je suis sur la page confirmation du formulaire usurpation non connecté
    Et la copie d'écran "udFraudNotConnected_FCHigh_success" correspond à la page actuelle sur "<device>"
    Et le mail "demande de support" est envoyé à "test@email.fr"
    Et la copie d'écran "udFraudNotConnected_FCHigh_mail" correspond à la page actuelle sur "<device>"

    Exemples:
      | device  |
      | mobile  |
      | desktop |

  Plan du Scénario: Usurpation non connecté - cas passant FC v2 sur <device>
    Etant donné que je supprime les mails envoyés à "support.test@franceconnect.gouv.fr"
    Et que j'utilise un navigateur web sur "<device>"
    Et que je navigue vers la page formulaire usurpation non connecté
    Et que je suis redirigé vers la page description du formulaire usurpation non connecté
    Et que j'entre "description de l'usurpation d'identité" dans le champ "description" du formulaire usurpation non connecté
    Et que je continue avec le formulaire usurpation non connecté
    Et que je suis sur la page identification de connexion du formulaire usurpation non connecté
    Et que j'entre "05695ca2-d711-408d-988f-2e1f6fdf4869" dans le champ "code" du formulaire usurpation non connecté
    Et que je continue avec le formulaire usurpation non connecté
    Et que je suis sur la page identification de connexion du formulaire usurpation non connecté
    # Deactivated because of diff issues between CI and local stack
    # Et que la copie d'écran "udFraudNotConnected_step3_no_connection" correspond à la page actuelle sur "<device>"
    Et que j'entre "1a344d7d-fb1f-432f-99df-01b374c93687" dans le champ "code" du formulaire usurpation non connecté
    Et que je continue avec le formulaire usurpation non connecté
    Et que je suis sur la page connexions existantes du formulaire usurpation non connecté
    Et que la copie d'écran "udFraudNotConnected_step3_3connections" correspond à la page actuelle sur "<device>"
    Et que 3 connexions existantes ont été trouvées avec le code d'identification
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
    Et que la copie d'écran "udFraudNotConnected_step6_3connections" correspond à la page actuelle sur "<device>"
    Et que je coche la case de consentement du formulaire usurpation non connecté
    Quand je valide le formulaire usurpation non connecté
    Alors je suis sur la page confirmation du formulaire usurpation non connecté
    Et le mail "demande de support" est envoyé à "test@email.fr"
    Et la copie d'écran "udFraudNotConnected_FCLow_mail" correspond à la page actuelle sur "<device>"

    Exemples:
      | device  |
      | mobile  |
      | desktop |
