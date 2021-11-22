#language: fr
@usager @affichageFournisseurIdentité
Fonctionnalité: Affichage Fournisseur Identité
  # En tant qu'agent,
  # je veux visualiser la liste des fournisseurs d'identité disponibles
  # afin de me connecter au service de mon ministère

  Scénario: Affichage des FI lors de la recherche - aucun FI désactivé et non visible
    Etant donné que j'utilise un fournisseur d'identité "désactivé et non visible"
    Et que je navigue sur la page fournisseur de service
    Et que je clique sur le bouton AgentConnect
    Et que je suis redirigé vers la page sélection du fournisseur d'identité
    Quand je cherche le fournisseur d'identité par son ministère
    Alors le fournisseur d'identité n'est pas affiché dans la liste

  # @todo Bug: Les FI non visibles sont quand même affichés si actifs
  @ignore
  Scénario: Affichage des FI lors de la recherche - aucun FI actif et non visible
    Etant donné que j'utilise un fournisseur d'identité "actif et non visible"
    Et que je navigue sur la page fournisseur de service
    Et que je clique sur le bouton AgentConnect
    Et que je suis redirigé vers la page sélection du fournisseur d'identité
    Quand je cherche le fournisseur d'identité par son ministère
    Alors le fournisseur d'identité n'est pas affiché dans la liste

  Scénario: Affichage des FI lors de la recherche - FI actif sélectionnable
    Etant donné que j'utilise un fournisseur d'identité "actif"
    Et que je navigue sur la page fournisseur de service
    Et que je clique sur le bouton AgentConnect
    Et que je suis redirigé vers la page sélection du fournisseur d'identité
    Et que je cherche le fournisseur d'identité par son ministère
    Et que le fournisseur d'identité est actif dans la liste
    Quand je clique sur le fournisseur d'identité
    Alors je suis redirigé vers la page login du fournisseur d'identité

  # @todo Feature: Les FI désactivés et visibles devraient être affichés temporairement indisponibles
  # Scénario: Affichage des FI lors de la recherche - FI désactivé non sélectionnable
  #   Etant donné que j'utilise un fournisseur d'identité "désactivé et visible"
  #   Et que je navigue sur la page fournisseur de service
  #   Et que je clique sur le bouton AgentConnect
  #   Et que je suis redirigé vers la page sélection du fournisseur d'identité
  #   Et que je cherche le fournisseur d'identité par son ministère
  #   Et que le fournisseur d'identité est désactivé dans la liste
  #   Quand je clique sur le fournisseur d'identité
  #   Alors je ne suis pas redirigé vers la page login du fournisseur d'identité
  Scénario: Affichage des FI lors de la recherche - aucun FI désactivé et visible
    Etant donné que j'utilise un fournisseur d'identité "désactivé et visible"
    Et que je navigue sur la page fournisseur de service
    Et que je clique sur le bouton AgentConnect
    Et que je suis redirigé vers la page sélection du fournisseur d'identité
    Quand je cherche le fournisseur d'identité par son ministère
    Alors le fournisseur d'identité n'est pas affiché dans la liste

  Scénario: Affichage des FI lors de la recherche - seulement les FI de whitelist du FS
    Etant donné que j'utilise un fournisseur de service "avec une whitelist de FI"
    Et que le fournisseur de service requiert l'accès aux informations des scopes "obligatoires"
    Et que je navigue sur la page fournisseur de service
    Quand je clique sur le bouton AgentConnect
    Alors je suis redirigé vers la page sélection du fournisseur d'identité
    Et j'utilise un fournisseur d'identité "non whitelisté"
    Et je cherche le fournisseur d'identité par son ministère
    Et le fournisseur d'identité n'est pas affiché dans la liste
    Et j'utilise un fournisseur d'identité "whitelisté"
    Et je cherche le fournisseur d'identité par son ministère
    Et le fournisseur d'identité est affiché dans la liste

  # Les blacklists ne sont en pratique pas utilisées sur AgentConnect
  # puisque les échanges de claims dépendent de la coordination entre les FS et FI.
  # Les FI accessibles par un FS sont limités en utilisant une whitelist.
  Scénario: Affichage des FI lors de la recherche - aucun FI de blacklist du FS
    Etant donné que j'utilise un fournisseur de service "avec une blacklist de FI"
    Et que le fournisseur de service requiert l'accès aux informations des scopes "obligatoires"
    Et que je navigue sur la page fournisseur de service
    Quand je clique sur le bouton AgentConnect
    Alors je suis redirigé vers la page sélection du fournisseur d'identité
    Et j'utilise un fournisseur d'identité "blacklisté"
    Et je cherche le fournisseur d'identité par son ministère
    Et le fournisseur d'identité n'est pas affiché dans la liste
    Et j'utilise un fournisseur d'identité "non blacklisté"
    Et je cherche le fournisseur d'identité par son ministère
    Et le fournisseur d'identité est affiché dans la liste
