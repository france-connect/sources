#language:fr
@connexionPartenaires @ci
Fonctionnalité: Connexion Partenaires

  Scénario: Connexion Partenaires - utilisateur standard
    Etant donné que j'utilise un compte partenaire "par défaut"
    Et que je navigue sur la page d'accueil du site partenaire
    Quand je me connecte au site partenaire
    Alors je suis redirigé vers la page liste des fournisseurs de service
    Et je suis connecté au site partenaire
    Et le nom complet de l'utilisateur est affiché dans le header
    Et le nom de la plateforme est affiché dans le header
