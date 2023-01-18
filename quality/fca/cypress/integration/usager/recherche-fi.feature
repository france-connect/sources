#language: fr
@usager @rechercheFi @ci
Fonctionnalité: Recherche FI
  # En tant qu'usager d'un fournisseur de service,
  # je veux rechercher un FI par ministère ou par son nom,
  # afin de m'authentifier

  Scénario: Recherche FI - par son nom
    Etant donné que j'utilise le fournisseur de service "par défaut"
    Et que je navigue sur la page fournisseur de service
    Et que je clique sur le bouton AgentConnect
    Et que je suis redirigé vers la page sélection du fournisseur d'identité
    Et que j'utilise un fournisseur d'identité "actif"
    Quand je cherche le fournisseur d'identité par son nom
    Alors le fournisseur d'identité est affiché dans la liste
    Et le ministère du FI est affiché dans la liste

  @ignoreInteg01
  Plan du Scénario: Recherche FI - par son nom partiel <recherche>
    Etant donné que j'utilise le fournisseur de service "par défaut"
    Et que je navigue sur la page fournisseur de service
    Et que je clique sur le bouton AgentConnect
    Et que je suis redirigé vers la page sélection du fournisseur d'identité
    Et que j'utilise un fournisseur d'identité "actif"
    Quand je cherche le fournisseur d'identité avec "<recherche>"
    Alors le fournisseur d'identité est affiché dans la liste
    Et le ministère du FI est affiché dans la liste

    # Nom du FI: Identity Provider 1 - eIDAS faible - ES256
    Exemples:
      | recherche           |
      | identity provider   |
      | IdenTiTy ProVider 1 |
      | eidas faible        |
      | es256               |

  Scénario: Recherche FI - par son ministère
    Etant donné que j'utilise le fournisseur de service "par défaut"
    Et que je navigue sur la page fournisseur de service
    Et que je clique sur le bouton AgentConnect
    Et que je suis redirigé vers la page sélection du fournisseur d'identité
    Et que j'utilise un fournisseur d'identité "actif"
    Quand je cherche le fournisseur d'identité par son ministère
    Alors le fournisseur d'identité est affiché dans la liste
    Et le ministère du FI est affiché dans la liste
    Et le nombre de ministère affiché est 1

  @ignoreInteg01
  Plan du Scénario: Recherche FI - par nom partiel de son ministère <recherche>
    Etant donné que j'utilise le fournisseur de service "par défaut"
    Et que je navigue sur la page fournisseur de service
    Et que je clique sur le bouton AgentConnect
    Et que je suis redirigé vers la page sélection du fournisseur d'identité
    Et que j'utilise un fournisseur d'identité "actif"
    Quand je cherche le fournisseur d'identité par son ministère avec "<recherche>"
    Alors le fournisseur d'identité est affiché dans la liste
    Et le ministère du FI est affiché dans la liste

    # Ministère du FI: MOCK - Ministère de la transition écologique - ALL FIS - SORT 2
    Exemples:
      | recherche                                    |
      | mock                                         |
      | sort 2                                       |
      | ALL FIS                                      |
      | MOCK - Ministère de la transition écologique |
      | ministere de la transition ecolo             |
      | ministere ecologique                         |

  # TODO La recherche par acronyme ne fonctionne qu'en utilisant l'id
  @ignore
  Scénario: Recherche FI - par l'acronyme de son ministère
    Etant donné que j'utilise le fournisseur de service "par défaut"
    Et que je navigue sur la page fournisseur de service
    Et que je clique sur le bouton AgentConnect
    Et que je suis redirigé vers la page sélection du fournisseur d'identité
    Et que j'utilise un fournisseur d'identité "actif"
    Quand je cherche le fournisseur d'identité par son ministère avec "MO1"
    Alors le fournisseur d'identité est affiché dans la liste
    Et le ministère du FI est affiché dans la liste
    Et le nombre de ministère affiché est 1

  Scénario: Recherche FI - FI inexistant
    Etant donné que j'utilise le fournisseur de service "par défaut"
    Et que je navigue sur la page fournisseur de service
    Et que je clique sur le bouton AgentConnect
    Et que je suis redirigé vers la page sélection du fournisseur d'identité
    Et que j'utilise un fournisseur d'identité "actif"
    Quand je cherche le fournisseur d'identité par son nom avec "FI inexistant"
    Alors aucun fournisseur d'identité n'est trouvé

  Scénario: Recherche FI - ministère avec plusieurs FI
    Etant donné que j'utilise le fournisseur de service "par défaut"
    Et que je navigue sur la page fournisseur de service
    Et que je clique sur le bouton AgentConnect
    Et que je suis redirigé vers la page sélection du fournisseur d'identité
    Et que j'utilise un fournisseur d'identité "rattaché à un ministère avec plusieurs FI"
    Quand je cherche le fournisseur d'identité par son ministère
    Alors le fournisseur d'identité est affiché dans la liste
    Et le ministère du FI est affiché dans la liste
    Et plusieurs fournisseurs d'identité sont affichés dans la liste

  Scénario: Recherche FI - FI avec plusieurs ministères
    Etant donné que j'utilise le fournisseur de service "par défaut"
    Et que je navigue sur la page fournisseur de service
    Et que je clique sur le bouton AgentConnect
    Et que je suis redirigé vers la page sélection du fournisseur d'identité
    Et que j'utilise un fournisseur d'identité "rattaché à plusieurs ministères"
    Quand je cherche le fournisseur d'identité par son nom
    Alors le fournisseur d'identité est affiché dans la liste
    Et plusieurs ministères sont affichés dans la liste
