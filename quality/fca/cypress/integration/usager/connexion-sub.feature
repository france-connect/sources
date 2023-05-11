#language: fr
@usager @connexionSub @ci
Fonctionnalité: Connexion Usager - Sub
  # En tant qu'usager,
  # je veux transmettre un sub unique au fournisseur de service
  # afin d'accéder à mon compte
  Scénario: Connexion Usager - deux FS avec accès au même FI ayant chacun son propre sub
    Etant donné que j'utilise un fournisseur de service "avec accès au FI par défaut (premier FS)"
    Et que j'utilise le fournisseur d'identité "par défaut"
    Et que je navigue sur la page fournisseur de service
    Et que je me connecte à AgentConnect
    Et que je suis redirigé vers la page fournisseur de service
    Et que je suis connecté au fournisseur de service
    Et que je mémorise le sub envoyé au fournisseur de service
    Et que j'utilise un fournisseur de service "avec accès au FI par défaut (deuxième FS)"
    Et que je navigue sur la page fournisseur de service
    Et que je clique sur le bouton AgentConnect
    Et que je suis redirigé vers la page fournisseur de service
    Et que je suis connecté au fournisseur de service
    Et que le sub transmis au fournisseur de service est différent du sub mémorisé
    Et que j'utilise un fournisseur de service "avec accès au FI par défaut (premier FS)"
    Et que j'utilise le fournisseur d'identité "par défaut"
    Et que je navigue sur la page fournisseur de service
    Quand je redemande les informations de l'usager
    Alors je suis redirigé vers la page fournisseur de service
    Et le sub transmis au fournisseur de service est identique au sub mémorisé

  Scénario: Connexion Usager - Sub unique par FS
    Etant donné que j'utilise un fournisseur de service "avec accès au FI par défaut (premier FS)"
    Et que je navigue sur la page fournisseur de service
    Et que je me connecte à AgentConnect
    Et que je suis redirigé vers la page fournisseur de service
    Et que je suis connecté au fournisseur de service
    Et que je mémorise le sub envoyé au fournisseur de service
    Et que je me déconnecte du fournisseur de service
    Et que j'utilise un fournisseur de service "avec accès au FI par défaut (deuxième FS)"
    Et que le fournisseur de service requiert l'accès aux informations des scopes "obligatoires"
    Et que je navigue sur la page fournisseur de service
    Quand je me connecte à AgentConnect
    Alors je suis redirigé vers la page fournisseur de service
    Et je suis connecté au fournisseur de service
    Et le sub transmis au fournisseur de service est différent du sub mémorisé
