#language:fr
@ci
Fonctionnalité: Connexion Espace Partenaires

  Scénario: Espace Partenaires - Redirection vers page login
    Quand je navigue sur la page d'accueil de l'espace partenaires
    Alors je suis redirigé vers la page login de l'espace partenaires
    Et je suis déconnecté de l'espace partenaires
    Et le bouton AgentConnect est visible

  Scénario: Espace Partenaires - Connexion
    Quand je me connecte à l'espace partenaires
    Alors je suis connecté à l'espace partenaires
    Et le nom de l'usager de l'espace partenaires est affiché

  Scénario: Espace Partenaires - Déconnexion
    Etant donné que je me connecte à l'espace partenaires
    Et que je suis connecté à l'espace partenaires
    Quand je me déconnecte de l'espace partenaires
    Alors je suis redirigé vers la page login de l'espace partenaires
    Et je suis déconnecté de l'espace partenaires
