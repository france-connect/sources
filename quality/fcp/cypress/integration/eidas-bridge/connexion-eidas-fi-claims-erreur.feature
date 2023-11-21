#language: fr
@eidasBridge @connexionEidasFiClaimsErreur
Fonctionnalité: Connexion eIDAS - Validation des claims renvoyés par le fournisseur d'identité
  # En tant que Product Owner,
  # je veux m'assurer que les claims obligatoires sont correctement renvoyés par les FI
  # afin que le noeud eIDAS français soit opérationnel

  Scénario: Connexion FS Européen - Erreur quand FI FR ne renvoit pas un claim obligatoire
    Etant donné que j'utilise un compte usager "par défaut"
    Et que j'utilise le fournisseur de service "eidas-be"
    Et que je navigue sur la page fournisseur de service eidas
    Et que le fournisseur de service requiert l'accès aux informations des scopes "eidas"
    Et que je configure un fournisseur de service sur eidas mock
    Et que je suis redirigé vers la page sélection du fournisseur d'identité
    Et que j'utilise un fournisseur d'identité "français"
    Et que je paramètre un intercepteur pour retirer le scope "email" au prochain appel au fournisseur d'identité
    Et que je clique sur le fournisseur d'identité
    Et que je suis redirigé vers la page login du fournisseur d'identité
    Quand je m'authentifie avec succès
    Alors je suis redirigé vers la page erreur technique FranceConnect
    Et le code d'erreur FranceConnect est "Y000006"
    Et le message d'erreur FranceConnect est "Une erreur technique est survenue, fermez l’onglet de votre navigateur et reconnectez-vous"

  Scénario: Connexion FS Européen - Pas d'erreur si FI FR ne renvoit pas un claim optionnel
    Etant donné que j'utilise un compte usager "par défaut"
    Et que j'utilise le fournisseur de service "eidas-be"
    Et que je navigue sur la page fournisseur de service eidas
    Et que le fournisseur de service requiert l'accès aux informations des scopes "eidas"
    Et que je configure un fournisseur de service sur eidas mock
    Et que je suis redirigé vers la page sélection du fournisseur d'identité
    Et que j'utilise un fournisseur d'identité "français"
    Et que je paramètre un intercepteur pour retirer le scope "preferred_username" au prochain appel au fournisseur d'identité
    Et que je clique sur le fournisseur d'identité
    Et que je suis redirigé vers la page login du fournisseur d'identité
    Quand je m'authentifie avec succès
    Et je suis redirigé vers la page confirmation de connexion
    Et je continue sur le fournisseur de service
    Et je suis redirigé vers la page fournisseur de service eidas mock
    Et le fournisseur de service eidas mock a accès aux informations des scopes "eidas sans preferred_username"
    Et le sub transmis au fournisseur de service eidas commence par "FR/BE"

  Scénario: Connexion FS Européen - Pas d'erreur si FI FR ne renvoit pas un claim inconnu
    Etant donné que j'utilise un compte usager "par défaut"
    Et que j'utilise le fournisseur de service "eidas-be"
    Et que je navigue sur la page fournisseur de service eidas
    Et que le fournisseur de service requiert l'accès aux informations des scopes "eidas"
    Et que je configure un fournisseur de service sur eidas mock
    Et que je suis redirigé vers la page sélection du fournisseur d'identité
    Et que j'utilise un fournisseur d'identité "français"
    Et que je paramètre un intercepteur pour ajouter le scope "unknown_prop_for_test" au prochain appel au fournisseur d'identité
    Et que je clique sur le fournisseur d'identité
    Et que je suis redirigé vers la page login du fournisseur d'identité
    Quand je m'authentifie avec succès
    Et je suis redirigé vers la page confirmation de connexion
    Et je continue sur le fournisseur de service
    Et je suis redirigé vers la page fournisseur de service eidas mock
    Et le fournisseur de service eidas mock a accès aux informations des scopes "eidas"
    Et le sub transmis au fournisseur de service eidas commence par "FR/BE"

  Scénario: Connexion FS français - Erreur si FI EU ne renvoit pas un claim obligatoire
    Etant donné que j'utilise un compte usager "pour les tests eidas-bridge"
    Et que le fournisseur de service requiert l'accès aux informations des scopes "eidas"
    Et que je navigue sur la page fournisseur de service
    Et que je clique sur le bouton FranceConnect
    Et que je suis redirigé vers la page sélection du fournisseur d'identité
    Et que j'utilise le fournisseur d'identité "eidas-bridge"
    Et que je paramètre un intercepteur pour retirer le scope "family_name" au prochain appel au fournisseur d'identité
    Et que je clique sur le fournisseur d'identité
    Et que je suis redirigé vers la page sélection du pays
    Et que je clique sur le pays "Mock Node"
    Quand je m'authentifie avec succès sur le fournisseur d'identité étranger
    Alors je suis redirigé vers la page erreur technique FranceConnect
    Et le code d'erreur FranceConnect est "Y000006"
    Et le message d'erreur FranceConnect est "Une erreur technique est survenue, fermez l’onglet de votre navigateur et reconnectez-vous"

  Scénario: Connexion FS français - Pas d'erreur si FI FR ne renvoit pas un claim optionnel
    Etant donné que j'utilise un compte usager "pour les tests eidas-bridge"
    Et que le fournisseur de service requiert l'accès aux informations des scopes "eidas"
    Et que je navigue sur la page fournisseur de service
    Et que je clique sur le bouton FranceConnect
    Et que je suis redirigé vers la page sélection du fournisseur d'identité
    Et que j'utilise le fournisseur d'identité "eidas-bridge"
    Et que je paramètre un intercepteur pour retirer le scope "birthplace" au prochain appel au fournisseur d'identité
    Et que je clique sur le fournisseur d'identité
    Et que je suis redirigé vers la page sélection du pays
    Et que je clique sur le pays "Mock Node"
    Quand je m'authentifie avec succès sur le fournisseur d'identité étranger
    Et je suis redirigé vers la page confirmation de connexion
    Et je continue sur le fournisseur de service
    Alors je suis redirigé vers la page fournisseur de service
    Et je suis connecté au fournisseur de service
    Et la cinématique a utilisé le niveau de sécurité "eidas2"
    Et le fournisseur de service a accès aux informations des scopes "eidas sans birthplace"
    Et la cinématique a renvoyé l'amr "eidas"

  Scénario: Connexion FS français - Pas d'erreur si FI FR ne renvoit pas un claim inconnu
    Etant donné que j'utilise un compte usager "pour les tests eidas-bridge"
    Et que le fournisseur de service requiert l'accès aux informations des scopes "eidas"
    Et que je navigue sur la page fournisseur de service
    Et que je clique sur le bouton FranceConnect
    Et que je suis redirigé vers la page sélection du fournisseur d'identité
    Et que j'utilise le fournisseur d'identité "eidas-bridge"
    Et que je paramètre un intercepteur pour ajouter le scope "unknown_prop_for_test" au prochain appel au fournisseur d'identité
    Et que je clique sur le fournisseur d'identité
    Et que je suis redirigé vers la page sélection du pays
    Et que je clique sur le pays "Mock Node"
    Quand je m'authentifie avec succès sur le fournisseur d'identité étranger
    Et je suis redirigé vers la page confirmation de connexion
    Et je continue sur le fournisseur de service
    Alors je suis redirigé vers la page fournisseur de service
    Et je suis connecté au fournisseur de service
    Et la cinématique a utilisé le niveau de sécurité "eidas2"
    Et le fournisseur de service a accès aux informations des scopes "eidas"
    Et la cinématique a renvoyé l'amr "eidas"
