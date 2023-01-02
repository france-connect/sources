#language: fr
@validationVisuelle @fcpHigh
Fonctionnalité: Validation Visuelle

  Plan du Scénario: Validation Visuelle - cinématique depuis un FS public sur <device>
    Etant donné que j'utilise un navigateur web sur "<device>"
    Et que j'utilise un fournisseur de service "public"
    Et que le fournisseur de service requiert l'accès aux informations du scope "identite_pivot sans alias"
    Et que je navigue sur la page fournisseur de service
    Et que je clique sur le bouton FranceConnect
    Et que je suis redirigé vers la page sélection du fournisseur d'identité
    Et que la copie d'écran "selectionFI" correspond à la page actuelle sur "<device>"
    Et que je clique sur le fournisseur d'identité
    Et que je suis redirigé vers la page login du fournisseur d'identité
    Et que je m'authentifie avec succès
    Et que je suis redirigé vers la page d'information
    Et que la copie d'écran "information" correspond à la page actuelle sur "<device>"
    Et que les informations demandées par le fournisseur de service correspondent au scope "identite_pivot sans alias"
    Et que la copie d'écran "informationAvecScope" correspond à l'élément web "article" sur "<device>"
    Quand je continue sur le fournisseur de service
    Alors je suis redirigé vers la page fournisseur de service
    Et je suis connecté
    Et le fournisseur de service a accès aux informations du scope "identite_pivot sans alias"

    Exemples:
      | device           |
      | mobile           |
      | tablet portrait  |
      | tablet landscape |
      | desktop          |

  Plan du Scénario: Validation Visuelle - cinématique depuis un FS privé avec consentement obligatoire sur <device>
    Etant donné que j'utilise un navigateur web sur "<device>"
    Et que j'utilise un fournisseur de service "privé avec consentement obligatoire"
    Et que le fournisseur de service requiert l'accès aux informations du scope "identite_pivot sans alias"
    Et que je navigue sur la page fournisseur de service
    Et que je clique sur le bouton FranceConnect
    Et que je suis redirigé vers la page sélection du fournisseur d'identité
    Et que la copie d'écran "selectionFI" correspond à la page actuelle sur "<device>"
    Et que je clique sur le fournisseur d'identité
    Et que je suis redirigé vers la page login du fournisseur d'identité
    Et que je m'authentifie avec succès
    Et que je suis redirigé vers la page de consentement
    Et que la copie d'écran "consentement" correspond à la page actuelle sur "<device>"
    Et que les informations demandées par le fournisseur de service correspondent au scope "identite_pivot sans alias"
    Et que le bouton continuer sur le FS est désactivé
    Quand je consens à transmettre mes informations au fournisseur de service
    Et le bouton continuer sur le FS est actif
    Et la copie d'écran "consentementActif" correspond à la page actuelle sur "<device>"
    Et je continue sur le fournisseur de service
    Alors je suis redirigé vers la page fournisseur de service
    Et je suis connecté
    Et le fournisseur de service a accès aux informations du scope "identite_pivot sans alias"

    Exemples:
      | device           |
      | mobile           |
      | tablet portrait  |
      | tablet landscape |
      | desktop          |

  Plan du Scénario: Connexion d'un usager - scope anonyme sur <device>
    Etant donné que j'utilise un navigateur web sur "<device>"
    Et que le fournisseur de service requiert l'accès aux informations du scope "anonyme"
    Et que je navigue sur la page fournisseur de service
    Et que je clique sur le bouton FranceConnect
    Et que je suis redirigé vers la page sélection du fournisseur d'identité
    Et que la copie d'écran "selectionFIScopeAnonyme" correspond à la page actuelle sur "<device>"
    Et que j'utilise un fournisseur d'identité "actif"
    Et que je clique sur le fournisseur d'identité
    Et que je suis redirigé vers la page login du fournisseur d'identité
    Quand je m'authentifie avec succès
    Et je suis redirigé vers la page confirmation de connexion
    Et aucune information n'est demandée par le fournisseur de service pour le scope "anonyme"
    Et la copie d'écran "scopeAnonyme" correspond à la page actuelle sur "<device>"
    Et je continue sur le fournisseur de service
    Alors je suis redirigé vers la page fournisseur de service
    Et je suis connecté
    Et le fournisseur de service a accès aux informations du scope "anonyme"

    Exemples:
      | device           |
      | mobile           |
      | tablet portrait  |
      | tablet landscape |
      | desktop          |

  Plan du Scénario: Validation Visuelle - Erreur usager désactivé sur <device>
    Etant donné que j'utilise un navigateur web sur "<device>"
    Et que j'utilise un compte usager "désactivé"
    Et que je navigue sur la page fournisseur de service
    Et que je clique sur le bouton FranceConnect
    Et que je suis redirigé vers la page sélection du fournisseur d'identité
    Et que j'utilise un fournisseur d'identité "actif"
    Et que je clique sur le fournisseur d'identité
    Et que je suis redirigé vers la page login du fournisseur d'identité
    Quand je m'authentifie avec succès
    Alors je suis redirigé vers la page erreur technique
    Et le code d'erreur est "Y180001"
    Et la copie d'écran "erreurUsagerDesactive" correspond à la page actuelle sur "<device>"

    Exemples:
      | device           |
      | mobile           |
      | tablet portrait  |
      | tablet landscape |
      | desktop          |
