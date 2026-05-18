#language:fr
@ci
Fonctionnalité: Connexion Espace Partenaires
  # En tant qu'utilisateur,
  # je veux me connecter en utilisant ProConnect
  # afin d'accéder à l'Espace Partenaires

  Scénario: Espace Partenaires - Redirection vers page login
    Quand je navigue sur la page d'accueil de l'espace partenaires
    Alors je suis redirigé vers la page login de l'espace partenaires
    Et je suis déconnecté de l'espace partenaires
    Et le bouton AgentConnect est visible

  Plan du Scénario: Espace Partenaires - Connexion avec acr <acr>
    Quand je me connecte à l'espace partenaires avec un acr "<acr>"
    Alors je suis connecté à l'espace partenaires
    Et le nom de l'usager de l'espace partenaires est affiché

    Exemples:
      | acr                                                          |
      | eidas1                                                       |
      | eidas2                                                       |
      | eidas3                                                       |
      | https://proconnect.gouv.fr/assurance/self-asserted           |
      | https://proconnect.gouv.fr/assurance/self-asserted-2fa       |
      | https://proconnect.gouv.fr/assurance/consistency-checked     |
      | https://proconnect.gouv.fr/assurance/consistency-checked-2fa |
      | https://proconnect.gouv.fr/assurance/certification-dirigeant |

  Scénario: Espace Partenaires - Déconnexion
    Etant donné que je me connecte à l'espace partenaires
    Et que je suis connecté à l'espace partenaires
    Quand je me déconnecte de l'espace partenaires
    Alors je suis redirigé vers la page login de l'espace partenaires
    Et je suis déconnecté de l'espace partenaires
