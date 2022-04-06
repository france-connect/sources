#language: fr
@accessibilite @ci
Fonctionnalité: Accessibilité

  Plan du Scénario: Accessibilité - page sélection FI sur <device>
    Etant donné que j'utilise un navigateur web sur "<device>"
    Et que le fournisseur de service requiert l'accès aux informations des scopes "tous les scopes"
    Et que je navigue sur la page fournisseur de service
    Et que je clique sur le bouton AgentConnect
    Et que je suis redirigé vers la page sélection du fournisseur d'identité
    Quand je vérifie l'accessibilité sur cette page
    Alors aucune erreur d'accessibilité n'est présente

    Exemples:
      | device           |
      | mobile           |
      | tablet portrait  |
      | tablet landscape |
      | desktop          |

  Plan du Scénario: Accessibilité - page sélection FI avec résultat sur <device>
    Etant donné que j'utilise un navigateur web sur "<device>"
    Et que j'utilise le fournisseur de service "par défaut"
    Et que je navigue sur la page fournisseur de service
    Et que je clique sur le bouton AgentConnect
    Et que je suis redirigé vers la page sélection du fournisseur d'identité
    Et que j'utilise un fournisseur d'identité "actif"
    Et que je cherche le fournisseur d'identité avec "identity provider"
    Et que le fournisseur d'identité est affiché dans la liste
    Quand je vérifie l'accessibilité sur cette page
    Alors aucune erreur d'accessibilité n'est présente

    Exemples:
      | device           |
      | mobile           |
      | tablet portrait  |
      | tablet landscape |
      | desktop          |

  Plan du Scénario: Accessibilité - page erreur ACR inconnu envoyé par le FI sur <device>
    Etant donné que j'utilise un navigateur web sur "<device>"
    Et que je navigue sur la page fournisseur de service
    Et que je clique sur le bouton AgentConnect
    Et que je suis redirigé vers la page sélection du fournisseur d'identité
    Et que je cherche le fournisseur d'identité par son ministère
    Et que je clique sur le fournisseur d'identité
    Et que je suis redirigé vers la page login du fournisseur d'identité
    Et que le fournisseur d'identité garantit un niveau de sécurité "inconnu"
    Et que je m'authentifie avec succès
    Et que je suis redirigé vers la page erreur technique
    Et que le code d'erreur est "Y020001"
    Quand je vérifie l'accessibilité sur cette page
    Alors aucune erreur d'accessibilité n'est présente

    Exemples:
      | device           |
      | mobile           |
      | tablet portrait  |
      | tablet landscape |
      | desktop          |
