#language: fr
@validationVisuelle @eidasBridge
Fonctionnalité: Validation Visuelle

  Plan du Scénario: Validation Visuelle - cinématique eidas depuis un FS FR sur <device>
    Etant donné que j'utilise un navigateur web sur "<device>"
    Et que j'utilise un compte usager "pour les tests eidas-bridge"
    Et que je navigue sur la page fournisseur de service
    Et que je clique sur le bouton FranceConnect
    Et que je suis redirigé vers la page sélection du fournisseur d'identité
    Et que j'utilise le fournisseur d'identité "eidas-bridge"
    Quand je clique sur le fournisseur d'identité
    Alors je suis redirigé vers la page sélection du pays
    Et la copie d'écran "countrySelection" correspond à la page actuelle sur "<device>"

    Exemples:
      | device           |
      | mobile           |
      | tablet portrait  |
      | tablet landscape |
      | desktop          |
