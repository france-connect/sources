#language:fr
@ci
Fonctionnalité: Perte de session Espace Partenaires

  Scénario: Liste mes Instances - Click sur la carte d'une instance après expiration de la session
    Etant donné que je me connecte à l'espace partenaires
    Et que je suis sur la page liste des instances
    Et que je supprime tous les cookies
    Quand je clique sur la première instance
    Alors je suis redirigé vers la page login de l'espace partenaires
    Et le message d'alerte "session expirée" est affiché

  Scénario: Liste mes Instances - Rechargement de la page après expiration de la session
    Etant donné que je me connecte à l'espace partenaires
    Et que je suis sur la page liste des instances
    Et que je supprime tous les cookies
    Quand je rafraîchis la page
    Alors je suis redirigé vers la page login de l'espace partenaires
    Et le message d'alerte "session expirée" n'est pas affiché

  Scénario: Création d'une instance - Click sur le bouton submit après expiration de la session
    Etant donné que je me connecte à l'espace partenaires
    Et que je suis sur la page liste des instances
    Et que je clique sur le lien d'ajout d'une instance
    Et que j'utilise l'instance de FS "avec entityId"
    Et que j'entre les valeurs par défaut pour mon instance
    Et que je supprime tous les cookies
    Quand je valide le formulaire de création d'instance
    Alors je suis redirigé vers la page login de l'espace partenaires
    Et le message d'alerte "session expirée" est affiché

  Scénario: Création d'une instance - Rechargement de la page après expiration de la session
    Etant donné que je me connecte à l'espace partenaires
    Et que je suis sur la page liste des instances
    Et que je clique sur le lien d'ajout d'une instance
    Et que je supprime tous les cookies
    Quand je rafraîchis la page
    Alors je suis redirigé vers la page login de l'espace partenaires
    Et le message d'alerte "session expirée" n'est pas affiché

  Scénario: Modification d'une instance - Click sur le bouton submit après expiration de la session
    Etant donné que je me connecte à l'espace partenaires
    Et que je suis sur la page liste des instances
    Et que je clique sur la première instance
    Et que je suis sur la page modification d'instance
    Et que je supprime tous les cookies
    Quand je valide le formulaire de modification d'instance
    Alors je suis redirigé vers la page login de l'espace partenaires
    Et le message d'alerte "session expirée" est affiché

  Scénario: Modification d'une instance - Rechargement de la page après expiration de la session
    Etant donné que je me connecte à l'espace partenaires
    Et que je suis sur la page liste des instances
    Et que je clique sur la première instance
    Et que je supprime tous les cookies
    Quand je rafraîchis la page
    Alors je suis redirigé vers la page login de l'espace partenaires
    Et le message d'alerte "session expirée" n'est pas affiché
