#language: fr
# Non exécuté en integ01 car nous utilisons des bandeaux d'information à l'heure actuelle
@usager @messageInformation @fcpLow @fcpHigh @ci @ignoreInteg01
Fonctionnalité: Message Information
  # En tant qu'usager FranceConnect,
  # je veux être informé via le bandeau d'information des dernières notifications de FranceConnect

  Plan du Scénario: Ajout d'un message d'information <type>
    Etant donné que je navigue sur la page login d'exploitation
    Et que je me connecte à exploitation en tant que "exploitant"
    Et que je navigue vers la page de message d'information
    Et que je clique sur le bouton de modification d'un message d'information
    Et que j'utilise la configuration pour le message d'information "<type>"
    Et que j'entre les valeurs par défaut pour mon message d'information
    Quand je valide le formulaire de création du message d'information
    Alors la confirmation de modification d'un message d'information est affichée
    Et j'utilise le fournisseur de service "par défaut"
    Et je navigue sur la page fournisseur de service
    Et je clique sur le bouton FranceConnect
    Et je suis redirigé vers la page sélection du fournisseur d'identité
    Et le message d'information <isDisplayed>

    Exemples:
      | type          | isDisplayed       |
      | actif         | est affiché       |
      | expiré        | n'est pas affiché |
      | dans le futur | n'est pas affiché |
      | désactivé     | n'est pas affiché |
