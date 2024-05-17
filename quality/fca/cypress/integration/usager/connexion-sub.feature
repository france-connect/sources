#language: fr
@usager @connexionSub @ci
Fonctionnalité: Connexion Usager - Sub
  # En tant qu'usager,
  # je veux transmettre un sub unique au fournisseur de service
  # afin d'accéder à mon compte
  Scénario: Connexion Usager - deux FS avec accès au même FI génèrent le même sub
    Etant donné que j'utilise un fournisseur de service "avec accès au FI par défaut (premier FS)"
    Et que j'utilise le fournisseur d'identité "par défaut"
    Et que je navigue sur la page fournisseur de service
    Et que je me connecte à AgentConnect
    Et que je suis redirigé vers la page fournisseur de service
    Et que je suis connecté au fournisseur de service
    Et que je mémorise le sub envoyé au fournisseur de service
    Et que je me déconnecte du fournisseur de service
    Quand j'utilise un fournisseur de service "avec accès au FI par défaut (deuxième FS)"
    Et que j'utilise le fournisseur d'identité "par défaut"
    Et que je navigue sur la page fournisseur de service
    Et que je me connecte à AgentConnect
    Et que je suis redirigé vers la page fournisseur de service
    Et que je suis connecté au fournisseur de service
    Alors le sub transmis au fournisseur de service est identique au sub mémorisé

  Scénario: Connexion Usager - deux FS avec accès à deux FI génèrent deux subs
    Etant donné que j'utilise un fournisseur de service "avec accès au FI par défaut (premier FS)"
    Et que j'utilise le fournisseur d'identité "par défaut"
    Et que je navigue sur la page fournisseur de service
    Et que je me connecte à AgentConnect
    Et que je suis redirigé vers la page fournisseur de service
    Et que je suis connecté au fournisseur de service
    Et que je mémorise le sub envoyé au fournisseur de service    
    Et que je me déconnecte du fournisseur de service
    Quand j'utilise un fournisseur de service "avec accès au FI par défaut (deuxième FS)"
    Et que j'utilise le fournisseur d'identité "différent"
    Et que je navigue sur la page fournisseur de service
    Et que je me connecte à AgentConnect
    Et que je suis redirigé vers la page fournisseur de service
    Et que je suis connecté au fournisseur de service
    Alors le sub transmis au fournisseur de service est différent du sub mémorisé

  Scénario: Connexion Usager - un FS avec accès à deux FI génèrent deux subs
    Etant donné que j'utilise un fournisseur de service "avec accès au FI par défaut (premier FS)"
    Et que j'utilise le fournisseur d'identité "par défaut"
    Et que je navigue sur la page fournisseur de service
    Et que je me connecte à AgentConnect
    Et que je suis redirigé vers la page fournisseur de service
    Et que je suis connecté au fournisseur de service
    Et que je mémorise le sub envoyé au fournisseur de service    
    Et que je me déconnecte du fournisseur de service
    Quand j'utilise un fournisseur de service "avec accès au FI par défaut (premier FS)"
    Et que j'utilise le fournisseur d'identité "différent"
    Et que je navigue sur la page fournisseur de service
    Et que je me connecte à AgentConnect
    Et que je suis redirigé vers la page fournisseur de service
    Et que je suis connecté au fournisseur de service
    Alors le sub transmis au fournisseur de service est différent du sub mémorisé

  Scénario: Connexion Usager - un FS avec accès au même FI génèrent un sub
    Etant donné que j'utilise un fournisseur de service "avec accès au FI par défaut (premier FS)"
    Et que j'utilise le fournisseur d'identité "par défaut"
    Et que je navigue sur la page fournisseur de service
    Et que je me connecte à AgentConnect
    Et que je suis redirigé vers la page fournisseur de service
    Et que je suis connecté au fournisseur de service
    Et que je mémorise le sub envoyé au fournisseur de service    
    Et que je me déconnecte du fournisseur de service
    Quand j'utilise un fournisseur de service "avec accès au FI par défaut (premier FS)"
    Et que j'utilise le fournisseur d'identité "par défaut"
    Et que je navigue sur la page fournisseur de service
    Et que je me connecte à AgentConnect
    Et que je suis redirigé vers la page fournisseur de service
    Et que je suis connecté au fournisseur de service
    Alors le sub transmis au fournisseur de service est identique au sub mémorisé

 @ignoreInteg01
 Scénario: Connexion Usager - connexion via un user qui a déjà un account avec un sub
    Etant donné que j'utilise un fournisseur de service "avec accès au FI par défaut (premier FS)"
    Et que je navigue sur la page fournisseur de service
    Et que je clique sur le bouton AgentConnect
    Et que je suis redirigé vers la page interaction
    Et que j'entre l'email "mohamed@fia1.fr"
    Et que je clique sur le bouton de connexion
    Et que je suis redirigé vers la page login du fournisseur d'identité
    Quand je m'authentifie avec succès avec l'identifiant "12355"
    Et que je suis redirigé vers la page fournisseur de service
    Et que je suis connecté au fournisseur de service
    Alors le sub transmis au fournisseur de service est le suivant "d68cec59-ed65-48ab-bfbf-1ca65dd807f8"
