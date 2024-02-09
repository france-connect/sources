#language: fr
@usager @connexionloginHint @ci
Fonctionnalité: Connexion Usager - login_hint

  Scénario: Connexion initiale + login_hint
    Etant donné que j'utilise un fournisseur de service "avec accès au FI par défaut (premier FS)"
    Et que j'utilise le fournisseur d'identité "par défaut"
    Et que je navigue sur la page fournisseur de service
    Et que je clique sur le bouton AgentConnect
    Et que je suis redirigé vers la page interaction
    Quand j'entre l'email "fia@fia1.fr"
    Et que je clique sur le bouton de connexion
    Alors je suis redirigé vers la page login du fournisseur d'identité
    Et le champ identifiant correspond à "fia@fia1.fr"
