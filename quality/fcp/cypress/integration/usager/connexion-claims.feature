#language: fr
@usager @connexionClaims @ci
Fonctionnalité: Connexion avec Claims
  # En tant qu'usager d'un fournisseur de service,
  # je veux me connecter en utilisant des claims
  # afin de passer des informations supplémentaires au FS

  Plan du Scénario: Connexion avec claims - avec claim AMR fc
    Etant donné que le fournisseur de service requiert le claim "amr"
    Et que j'utilise un fournisseur d'identité "<idpDescription>"
    Et que je navigue sur la page fournisseur de service
    Et que je clique sur le bouton FranceConnect
    Et que je suis redirigé vers la page sélection du fournisseur d'identité
    Et que je clique sur le fournisseur d'identité
    Et que je suis redirigé vers la page login du fournisseur d'identité
    Quand je m'authentifie avec succès
    Et je suis redirigé vers la page confirmation de connexion
    Et je continue sur le fournisseur de service
    Alors je suis redirigé vers la page fournisseur de service
    Et je suis connecté au fournisseur de service
    Et la cinématique a renvoyé l'amr "<amr>"

    @fcpHigh
    Exemples:
      | idpDescription                       | amr            |
      | par défaut avec amr 'fc pop mfa pin' | fc pop mfa pin |

    @fcpLow
    Exemples:
      | idpDescription               | amr    |
      | par défaut avec amr 'fc pwd' | fc pwd |

  Scénario: Connexion avec claims - claim AMR absent si non demandé
    Etant donné que le fournisseur de service ne requiert pas le claim "amr"
    Et que je navigue sur la page fournisseur de service
    Et que je clique sur le bouton FranceConnect
    Et que je suis redirigé vers la page sélection du fournisseur d'identité
    Et que je clique sur le fournisseur d'identité
    Et que je suis redirigé vers la page login du fournisseur d'identité
    Quand je m'authentifie avec succès
    Et je suis redirigé vers la page confirmation de connexion
    Et je continue sur le fournisseur de service
    Alors je suis redirigé vers la page fournisseur de service
    Et je suis connecté au fournisseur de service
    Et la cinématique n'a pas renvoyé d'amr

  Plan du Scénario: Connexion SSO - le premier FS ne demande pas l'amr
    Etant donné que j'utilise un fournisseur de service "avec accès au FI par défaut (deuxième FS)"
    Et que le fournisseur de service ne requiert pas le claim "amr"
    Et que le fournisseur de service requiert l'accès aux informations des scopes "profile sans alias"
    Et que j'utilise un fournisseur d'identité "<idpDescription>"
    Et que je navigue sur la page fournisseur de service
    Et que je me connecte à FranceConnect
    Et que je suis redirigé vers la page fournisseur de service
    Et que je suis connecté au fournisseur de service
    Et que la cinématique n'a pas renvoyé d'amr
    Quand j'utilise un fournisseur de service "avec accès au FI par défaut (premier FS)"
    Et le fournisseur de service requiert le claim "amr"
    Et je navigue sur la page fournisseur de service
    Et je me connecte à FranceConnect en SSO
    Alors je suis connecté au fournisseur de service
    Et la cinématique a renvoyé l'amr "<amr>"

    @fcpHigh
    Exemples:
      | idpDescription                       | amr            |
      | par défaut avec amr 'fc pop mfa pin' | fc pop mfa pin |

    @fcpLow
    Exemples:
      | idpDescription               | amr    |
      | par défaut avec amr 'fc pwd' | fc pwd |

  @ignoreInteg01
  Scénario: Connexion avec claims - erreur FS non habilité pour amr
    Etant donné que j'utilise le fournisseur de service "non habilité à demander le claim amr"
    Et que le fournisseur de service requiert le claim "amr"
    Et que je navigue sur la page fournisseur de service
    Et que je clique sur le bouton FranceConnect
    Alors je suis redirigé vers la page erreur technique FranceConnect
    Et le code d'erreur FranceConnect est "Y030009"
