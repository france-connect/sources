#language: fr
@userDashboard @consultationTraces @ignoreHigh @ignoreLow
Fonctionnalité: Consultation Traces
  # En tant qu'usager d'un fournisseur de service,
  # je veux me connecter en utilisant un fournisseur d'identité
  # afin d'accéder à mon service


  @ignoreInteg01
  Scénario: Consultation Traces - Traces affichées
    Etant donné que j'utilise un compte usager "pour les tests de traces"
    Et que les traces FranceConnect+ contiennent "différents types de traces"
    Et que les traces FranceConnect contiennent "différents types de traces"
    Et que je navigue sur la page d'accueil du dashboard usager
    Quand je me connecte au dashboard usager
    Alors je suis redirigé vers la page historique du dashboard usager
    Et le nom de l'usager est affiché sur la page historique du dashboard usager
    Et les 3 traces de FranceConnect+ sont affichées
    Et les 3 traces de FranceConnect de moins de 6 mois sont affichées
    Et les 6 traces sont affichées par ordre décroissant
    Et le fournisseur d'identité de la première trace FC+ est "IDP1 - Identity Provider - eIDAS élevé - nodiscov - crypt"