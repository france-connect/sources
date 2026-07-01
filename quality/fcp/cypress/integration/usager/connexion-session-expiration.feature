#language: fr
@usager @session @ci
Fonctionnalité: Session bientôt expirée
  # En tant qu'usager,
  # je souhaite être averti lorsque ma session est sur le point d'expirer
  # afin de finaliser ma cinématique et d'éviter d'être interrompu dans ma navigation.

  Plan du Scénario: Session bientôt expirée  - <plateform> - Alerte après <delay> minutes sur la mire
    Etant donné que je navigue sur la page fournisseur de service
    Quand je clique sur le bouton FranceConnect
    Alors je suis redirigé vers la page sélection du fournisseur d'identité
    Et l'alerte "session bientôt expirée" n'est pas affichée
    Et l'alerte "session bientôt expirée" sera affichée dans <delay> minutes

    @fcpLow
    Exemples:
      | plateform | delay |
      | FC low    | 25    |

    @fcpHigh
    Exemples:
      | plateform | delay |
      | FC+       | 7     |

  Plan du Scénario: Session bientôt expirée - <plateform> - Alerte après <delay> minutes sur la <page>
    Etant donné que j'utilise un fournisseur de service "<spType>"
    Et que je navigue sur la page fournisseur de service
    Et que je clique sur le bouton FranceConnect
    Et que je suis redirigé vers la page sélection du fournisseur d'identité
    Et que je clique sur le fournisseur d'identité
    Et que je suis redirigé vers la page login du fournisseur d'identité
    Quand je m'authentifie avec succès
    Alors je suis redirigé vers la <page>
    Et l'alerte "session bientôt expirée" n'est pas affichée
    Et l'alerte "session bientôt expirée" sera affichée dans <delay> minutes

    @fcpLow
    Exemples:
      | plateform | spType                              | page                 | delay |
      | FC low    | public                              | page d'information   | 25    |
      | FC low    | privé avec consentement obligatoire | page de consentement | 25    |

    @fcpHigh
    Exemples:
      | plateform | spType                              | page                 | delay |
      | FC+       | public                              | page d'information   | 7     |
      | FC+       | privé avec consentement obligatoire | page de consentement | 7     |

  @fcpLow @fcpHigh
  Scénario: Session bientôt expirée - Alerte affichée sur la mire
    Etant donné que je paramètre un intercepteur pour accélérer l'alerte "session bientôt expirée" sur la page sélection du fournisseur d'identité
    Et que je navigue sur la page fournisseur de service
    Et que je clique sur le bouton FranceConnect
    Et que je suis redirigé vers la page sélection du fournisseur d'identité
    Et que l'alerte "session bientôt expirée" n'est pas affichée
    Et que l'alerte "session bientôt expirée" sera affichée dans 5 secondes
    Quand j'attends 5 secondes
    Alors l'alerte "session bientôt expirée" est affichée
    Et l'alerte "session bientôt expirée" contient le texte "Votre session va bientôt expirer"

  @fcpLow @fcpHigh
  Plan du Scénario: Session bientôt expirée - Alerte affichée sur la <page>
    Etant donné que je paramètre un intercepteur pour accélérer l'alerte "session bientôt expirée" sur la <page>
    Et que j'utilise un fournisseur de service "<spType>"
    Et que je navigue sur la page fournisseur de service
    Et que je clique sur le bouton FranceConnect
    Et que je suis redirigé vers la page sélection du fournisseur d'identité
    Et que je clique sur le fournisseur d'identité
    Et que je suis redirigé vers la page login du fournisseur d'identité
    Et que je m'authentifie avec succès
    Et que je suis redirigé vers la <page>
    Et que l'alerte "session bientôt expirée" n'est pas affichée
    Et que l'alerte "session bientôt expirée" sera affichée dans 5 secondes
    Quand j'attends 5 secondes
    Alors l'alerte "session bientôt expirée" est affichée
    Et l'alerte "session bientôt expirée" contient le texte "Votre session va bientôt expirer"
    Et l'alerte "session bientôt expirée" contient le texte "<alertMessage>"

    Exemples:
      | spType                              | page                 | alertMessage                                                                                                               |
      | public                              | page d'information   | Pour poursuivre votre connexion, cliquez dès maintenant sur « Continuer ».                                                 |
      | privé avec consentement obligatoire | page de consentement | Pour continuer, acceptez dès maintenant que FranceConnect transmette vos données au service puis cliquez sur « Continuer » |
