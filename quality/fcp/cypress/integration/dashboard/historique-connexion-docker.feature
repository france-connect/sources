#language: fr
@userDashboard @historiqueConnexion @ignoreInteg01 @ignoreHigh @ignoreLow
Fonctionnalité: Historique Connexion FC Legacy et FC+ (docker)
  # En tant qu'usager de FranceConnect,
  # je veux me connecter au user-dashboard
  # afin de consulter mon historique de connexion FC Legacy et FC+

  Scénario: Historique Connexion - FC Legacy et FC+ connexions sont affichées
    Etant donné que j'utilise un compte usager "pour les tests de traces"
    Et que les traces FranceConnect+ contiennent "différents types de traces"
    Et que les traces FranceConnect contiennent "différents types de traces"
    Et que je navigue sur la page d'accueil du dashboard usager
    Quand je me connecte au dashboard usager
    Alors je suis redirigé vers la page historique du dashboard usager
    Et les 3 traces de FranceConnect+ sont affichées
    Et les 7 traces de FranceConnect de moins de 6 mois sont affichées
    Et les 10 traces sont affichées par ordre décroissant
