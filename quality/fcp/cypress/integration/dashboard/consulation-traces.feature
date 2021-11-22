#language: fr
@userDashboard @consulationTraces @ignoreLow
Fonctionnalité: Consulation Traces
  # En tant qu'usager d'un fournisseur de service,
  # je veux me connecter en utilisant un fournisseur d'identité
  # afin d'accéder à mon service

  @ignoreDocker @ignoreHigh
  Scénario: Consulation Traces - Connexion d'un usager
    Etant donné que j'utilise un compte usager "par défaut"
    Et que j'utilise le fournisseur de service "par défaut"
    Et que j'utilise le fournisseur d'identité "par défaut"
    Et que je me connecte à FranceConnect
    Et que je navigue sur la page d'accueil du dashboard usager
    Quand je me connecte au dashboard usager
    Alors je suis redirigé vers la page historique du dashboard usager
    Et le nom de l'usager est affiché sur la page historique du dashboard usager
    Et les traces de connexion sont affichées

  @ignoreInteg01
  Scénario: Consulation Traces - Traces affichées
    Etant donné que j'utilise un compte usager "pour les tests de traces"
    Et que les traces contiennent "différents types de traces"
    Et que je navigue sur la page d'accueil du dashboard usager
    Quand je me connecte au dashboard usager
    Alors je suis redirigé vers la page historique du dashboard usager
    Et le nom de l'usager est affiché sur la page historique du dashboard usager
    Et les traces de connexion sont affichées
