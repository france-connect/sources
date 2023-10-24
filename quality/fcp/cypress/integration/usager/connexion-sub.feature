#language: fr
# On ignore les tests le temps que la deconnexion soit mis en place
# @see https://gitlab.dev-franceconnect.fr/france-connect/fc/-/issues/1214
@usager @connexionSub @ci @ignoreLow
Fonctionnalité: Connexion Usager - Sub
  # En tant qu'usager,
  # je veux transmettre un sub unique au fournisseur de service
  # afin d'accéder à mon compte

  # un fs a été configuré avec un sub sur la stack locale uniquement
  @ignoreInteg01
  Scénario: Connexion Usager - Sub issu de la base de données
    Etant donné que j'utilise un fournisseur de service "avec un sub existant"
    Et que le fournisseur de service requiert l'accès aux informations du scope "anonyme"
    Et que je navigue sur la page fournisseur de service
    Quand je me connecte à FranceConnect
    Alors je suis redirigé vers la page fournisseur de service
    Et je suis connecté au fournisseur de service
    Et le sub transmis au fournisseur de service est "fff725a2ab2971fa9e5329b2ac30d0fb3a063db332b9ffd69d7f186deacffa63v1"

  # fsp1v2 et fsp2v2 ont des entityId différents
  @ignoreInteg01
  Scénario: Connexion Usager - Sub identique pour 2 fs avec le même entityId
    Etant donné que j'utilise un fournisseur de service "avec un entityId"
    Et que le fournisseur de service requiert l'accès aux informations du scope "anonyme"
    Et que je navigue sur la page fournisseur de service
    Et que je me connecte à FranceConnect
    Et que je suis redirigé vers la page fournisseur de service
    Et que je suis connecté au fournisseur de service
    Et que je mémorise le sub envoyé au fournisseur de service
    Et que je me déconnecte du fournisseur de service
    Et que j'utilise un fournisseur de service "avec le même entityId"
    Et que je navigue sur la page fournisseur de service
    Quand je me connecte à FranceConnect
    Alors je suis redirigé vers la page fournisseur de service
    Et je suis connecté au fournisseur de service
    Et le sub transmis au fournisseur de service est identique au sub mémorisé

  Scénario: Connexion Usager - Sub différent pour 2 fs avec différents entityId
    Etant donné que j'utilise un fournisseur de service "avec un entityId"
    Et que le fournisseur de service requiert l'accès aux informations du scope "anonyme"
    Et que je navigue sur la page fournisseur de service
    Et que je me connecte à FranceConnect
    Et que je suis redirigé vers la page fournisseur de service
    Et que je suis connecté au fournisseur de service
    Et que je mémorise le sub envoyé au fournisseur de service
    Et que je me déconnecte du fournisseur de service
    Et que j'utilise un fournisseur de service "avec un entityId différent"
    Et que je navigue sur la page fournisseur de service
    Quand je me connecte à FranceConnect
    Alors je suis redirigé vers la page fournisseur de service
    Et je suis connecté au fournisseur de service
    Et le sub transmis au fournisseur de service est différent du sub mémorisé
