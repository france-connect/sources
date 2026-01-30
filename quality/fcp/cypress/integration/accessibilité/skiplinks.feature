#language: fr
@accessibilite @skiplinks @fcpLow @fcpHigh @ci
Fonctionnalité: Liens d'évitements (Skiplinks)

  Plan du scénario: Liens d'évitements - page sélection FI
    Etant donné que j'utilise un navigateur web sur "<device>"
    Et que j'utilise un fournisseur de service "public"
    Et que je navigue sur la page fournisseur de service
    Et que je clique sur le bouton FranceConnect
    Et que je suis redirigé vers la page sélection du fournisseur d'identité
    Et que je simule l'utilisation d'un outil d'accessibilité en naviguant avec Tab
    Quand je vérifie la présence des liens d'évitements FranceConnect
    Alors les liens d'évitements sont présents sur la page
    Et les liens d'évitements contiennent un lien vers le contenu principal
    Et les liens d'évitements contiennent un lien vers le pied de page

    Exemples:
      | device  |
      | desktop |
      | mobile  |

  Plan du scénario: Liens d'évitements - navigation au focus sur page sélection FI
    Etant donné que j'utilise un navigateur web sur "<device>"
    Et que j'utilise un fournisseur de service "public"
    Et que je navigue sur la page fournisseur de service
    Et que je clique sur le bouton FranceConnect
    Et que je suis redirigé vers la page sélection du fournisseur d'identité
    Quand je simule l'utilisation d'un outil d'accessibilité en naviguant avec Tab
    Alors les liens d'évitements deviennent visibles
    Et le premier élément en focus est un lien d'évitement

    Exemples:
      | device  |
      | desktop |
      | mobile  |

  Plan du scénario: Liens d'évitements - fonctionnalité du lien vers contenu principal
    Etant donné que j'utilise un navigateur web sur "<device>"
    Et que j'utilise un fournisseur de service "public"
    Et que je navigue sur la page fournisseur de service
    Et que je clique sur le bouton FranceConnect
    Et que je suis redirigé vers la page sélection du fournisseur d'identité
    Et que je simule l'utilisation d'un outil d'accessibilité en naviguant avec Tab
    Et que les liens d'évitements deviennent visibles
    Quand je clique sur le lien d'évitement vers le contenu principal
    Alors le focus est déplacé vers le contenu principal

    Exemples:
      | device  |
      | desktop |
      | mobile  |

  Plan du scénario: Liens d'évitements - fonctionnalité du lien vers le pied de page
    Etant donné que j'utilise un navigateur web sur "<device>"
    Et que j'utilise un fournisseur de service "public"
    Et que je navigue sur la page fournisseur de service
    Et que je clique sur le bouton FranceConnect
    Et que je suis redirigé vers la page sélection du fournisseur d'identité
    Et que je simule l'utilisation d'un outil d'accessibilité en naviguant avec Tab
    Et que les liens d'évitements deviennent visibles
    Quand je clique sur le lien d'évitement vers le pied de page
    Alors le focus est déplacé vers le pied de page

    Exemples:
      | device  |
      | desktop |
      | mobile  |

  Plan du scénario: Liens d'évitements - page d'information
    Etant donné que j'utilise un navigateur web sur "<device>"
    Et que j'utilise un fournisseur de service "public"
    Et que je navigue sur la page fournisseur de service
    Et que je clique sur le bouton FranceConnect
    Et que je suis redirigé vers la page sélection du fournisseur d'identité
    Et que je clique sur le fournisseur d'identité
    Et que je suis redirigé vers la page login du fournisseur d'identité
    Et que je m'authentifie avec succès
    Et que je suis redirigé vers la page d'information
    Et que je simule l'utilisation d'un outil d'accessibilité en naviguant avec Tab
    Quand je vérifie la présence des liens d'évitements FranceConnect
    Alors les liens d'évitements sont présents sur la page
    Et les liens d'évitements contiennent un lien vers le contenu principal
    Et les liens d'évitements contiennent un lien vers le pied de page

    Exemples:
      | device  |
      | desktop |
      | mobile  |

  Plan du scénario: Liens d'évitements - page consentement
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
    Et que je simule l'utilisation d'un outil d'accessibilité en naviguant avec Tab
    Quand je vérifie la présence des liens d'évitements FranceConnect
    Alors les liens d'évitements sont présents sur la page
    Et les liens d'évitements contiennent un lien vers le contenu principal
    Et les liens d'évitements contiennent un lien vers le pied de page

    Exemples:
      | device  |
      | desktop |
      | mobile  |

  Plan du scénario: Liens d'évitements - attributs ARIA et sémantique HTML
    Etant donné que j'utilise un navigateur web sur "<device>"
    Et que j'utilise un fournisseur de service "public"
    Et que je navigue sur la page fournisseur de service
    Et que je clique sur le bouton FranceConnect
    Et que je suis redirigé vers la page sélection du fournisseur d'identité
    Et que je simule l'utilisation d'un outil d'accessibilité en naviguant avec Tab
    Quand je vérifie la présence des liens d'évitements FranceConnect
    Alors les liens d'évitements ont l'attribut "role" avec la valeur "navigation"
    Et les liens d'évitements ont l'attribut "aria-label" avec la valeur "Accès rapide"
    Et chaque lien d'évitement a la classe CSS "fr-link"

    Exemples:
      | device  |
      | desktop |
      | mobile  |

  @exceptions
  Plan du scénario: Liens d'évitements - page d'erreur
    Etant donné que j'utilise un navigateur web sur "<device>"
    Et que j'utilise un compte usager "désactivé"
    Et que je navigue sur la page fournisseur de service
    Et que je clique sur le bouton FranceConnect
    Et que je suis redirigé vers la page sélection du fournisseur d'identité
    Et que j'utilise un fournisseur d'identité "actif"
    Et que je clique sur le fournisseur d'identité
    Et que je suis redirigé vers la page login du fournisseur d'identité
    Et que je m'authentifie avec succès
    Et que je suis redirigé vers la page erreur technique FranceConnect
    Et que je simule l'utilisation d'un outil d'accessibilité en naviguant avec Tab
    Quand je vérifie la présence des liens d'évitements FranceConnect
    Alors les liens d'évitements sont présents sur la page
    Et les liens d'évitements contiennent un lien vers le contenu principal
    Et les liens d'évitements contiennent un lien vers le pied de page

    Exemples:
      | device  |
      | desktop |
      | mobile  |
