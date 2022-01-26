#language: fr
@accessibilite @ci
Fonctionnalité: Accessibilité

  Plan du Scénario: Accessibilité - page sélection FI sur <device>
    Etant donné que j'utilise un navigateur web sur "<device>"
    Et que j'utilise un fournisseur de service "public"
    Et que le fournisseur de service requiert l'accès aux informations du scope "identite_pivot sans alias"
    Et que je navigue sur la page fournisseur de service
    Et que je clique sur le bouton FranceConnect
    Et que je suis redirigé vers la page sélection du fournisseur d'identité
    Quand je vérifie l'accessibilité sur cette page
    Alors aucune erreur d'accessibilité n'est présente

    Exemples:
      | device           |
      | mobile           |
      | tablet portrait  |
      | tablet landscape |
      | desktop          |

  Plan du Scénario: Accessibilité - page d'information sur <device>
    Etant donné que j'utilise un navigateur web sur "<device>"
    Et que j'utilise un fournisseur de service "public"
    Et que le fournisseur de service requiert l'accès aux informations du scope "identite_pivot sans alias"
    Et que je navigue sur la page fournisseur de service
    Et que je clique sur le bouton FranceConnect
    Et que je suis redirigé vers la page sélection du fournisseur d'identité
    Et que je clique sur le fournisseur d'identité
    Et que je suis redirigé vers la page login du fournisseur d'identité
    Et que je m'authentifie avec succès
    Et que je suis redirigé vers la page d'information
    Quand je vérifie l'accessibilité sur cette page
    Et je clique pour afficher les claims
    Et je vérifie l'accessibilité sur cette page
    Alors aucune erreur d'accessibilité n'est présente

    Exemples:
      | device           |
      | mobile           |
      | tablet portrait  |
      | tablet landscape |
      | desktop          |

  @ignoreLow
  Plan du Scénario: Accessibilité - page consentement sur <device>
    Etant donné que j'utilise un navigateur web sur "<device>"
    Et que j'utilise un fournisseur de service "privé avec consentement obligatoire"
    Et que le fournisseur de service requiert l'accès aux informations du scope "identite_pivot sans alias"
    Et que je navigue sur la page fournisseur de service
    Et que je clique sur le bouton FranceConnect
    Et que je suis redirigé vers la page sélection du fournisseur d'identité
    Et que je clique sur le fournisseur d'identité
    Et que je suis redirigé vers la page login du fournisseur d'identité
    Et que je m'authentifie avec succès
    Et que je suis redirigé vers la page de consentement
    Quand je vérifie l'accessibilité sur cette page
    Et je consens à transmettre mes informations au fournisseur de service
    Et je vérifie l'accessibilité sur cette page
    Alors aucune erreur d'accessibilité n'est présente

    Exemples:
      | device           |
      | mobile           |
      | tablet portrait  |
      | tablet landscape |
      | desktop          |

  Plan du Scénario: Accessibilité - page d'information avec scope anonyme sur <device>
    Etant donné que j'utilise un navigateur web sur "<device>"
    Et que le fournisseur de service requiert l'accès aux informations du scope "anonyme"
    Et que je navigue sur la page fournisseur de service
    Et que je clique sur le bouton FranceConnect
    Et que je suis redirigé vers la page sélection du fournisseur d'identité
    Et que j'utilise un fournisseur d'identité "actif"
    Et que je clique sur le fournisseur d'identité
    Et que je suis redirigé vers la page login du fournisseur d'identité
    Et que je m'authentifie avec succès
    Et que je suis redirigé vers la page confirmation de connexion
    Quand je vérifie l'accessibilité sur cette page
    Alors aucune erreur d'accessibilité n'est présente

    Exemples:
      | device           |
      | mobile           |
      | tablet portrait  |
      | tablet landscape |
      | desktop          |

  @ignoreLow
  Plan du Scénario: Accessibilité - page d'erreur (usager désactivé) sur <device>
    Etant donné que j'utilise un navigateur web sur "<device>"
    Et que j'utilise un compte usager "désactivé"
    Et que je navigue sur la page fournisseur de service
    Et que je clique sur le bouton FranceConnect
    Et que je suis redirigé vers la page sélection du fournisseur d'identité
    Et que j'utilise un fournisseur d'identité "actif"
    Et que je clique sur le fournisseur d'identité
    Et que je suis redirigé vers la page login du fournisseur d'identité
    Et que je m'authentifie avec succès
    Et que je suis redirigé vers la page erreur technique
    Et que le code d'erreur est "Y180001"
    Quand je vérifie l'accessibilité sur cette page
    Et aucune erreur d'accessibilité n'est présente

    Exemples:
      | device           |
      | mobile           |
      | tablet portrait  |
      | tablet landscape |
      | desktop          |
