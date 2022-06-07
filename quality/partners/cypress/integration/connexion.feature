#language:fr
@connexionPartenaires @ci
Fonctionnalité: Connexion Partenaires


    Scénario: Connexion Partenaires - utilisateur standard
        Etant donné que j'utilise un compte partenaire "standard"
        Et que je navigue sur la page d'accueil du site partenaire
        Quand je me connecte au site partenaire
        Alors je suis redirigé vers la page d'accueil utilisateur standard
        Et je suis connecté au site partenaire
        Et le nom complet de l'utilisateur est affiché dans le header

