#language:fr
@ci
Fonctionnalité: Instance - Modification avec erreurs
  # En tant que partenaire,
  # je veux être guidé pour corriger mon formulaire de modification
  # afin de finaliser la modification d'une instance de FS

  @ci
  Scénario: Instance Modification - Erreur champ obligatoires
    Etant donné que je me connecte à l'espace partenaires
    Et que je suis sur la page liste des instances
    Et que je clique sur la première instance
    Et que je suis sur la page modification d'instance
    Quand j'entre les valeurs dans les champs suivants du formulaire de modification d'instance
      | name                          | value |
      | name                          |       |
      | signupId                      |       |
      | site[0]                       |       |
      | redirect_uris[0]              |       |
      | post_logout_redirect_uris[0]  |       |
      | IPServerAddressesAndRanges[0] |       |
      | entityId                      |       |
    Et je valide le formulaire de modification d'instance
    Alors je suis sur la page modification d'instance
    Et les champs suivants sont en erreur dans le formulaire de modification d'instance
      | name                         | errorMessage                                             |
      | name                         | Veuillez saisir le nom de votre instance                 |
      | redirect_uris[0]             | Veuillez saisir votre url de connexion (url de callback) |
      | post_logout_redirect_uris[0] | Veuillez saisir votre url de déconnexion (url de logout) |
    Et les champs suivants ne sont pas en erreur dans le formulaire de modification d'instance
      | name                          |
      | platform                      |
      | site[0]                       |
      | signupId                      |
      | IPServerAddressesAndRanges[0] |
      | entityId                      |

  Scénario: Instance Modification - Erreur champs trop longs
    Etant donné que je me connecte à l'espace partenaires
    Et que je suis sur la page liste des instances
    Et que je clique sur la première instance
    Et que je suis sur la page modification d'instance
    Quand j'entre les chaines de caractères longues dans les champs suivants du formulaire de modification d'instance
      | name                         | totalLength | prefix                         | suffix    |
      | name                         | 257         | bdd_                           |           |
      | signupId                     | 8           | 12345678                       |           |
      | site[0]                      | 1025        | https://franceconnect.gouv.fr/ |           |
      | redirect_uris[0]             | 1025        | https://franceconnect.gouv.fr/ | /callback |
      | post_logout_redirect_uris[0] | 1025        | https://franceconnect.gouv.fr/ | /callback |
      | entityId                     | 65          |                                |           |
    Et je valide le formulaire de modification d'instance
    Alors je suis sur la page modification d'instance
    Et les champs suivants sont en erreur dans le formulaire de modification d'instance
      | name                         | errorMessage                                                       |
      | name                         | Le nom de l’instance doit être de 256 caractères maximum           |
      | signupId                     | Le numéro de la demande datapass doit être de 7 caractères maximum |
      | site[0]                      | L’url de site doit être de 1024 caractères maximum                 |
      | redirect_uris[0]             | L’url de connexion doit être de 1024 caractères maximum            |
      | post_logout_redirect_uris[0] | L’url de déconnexion doit être de 1024 caractères maximum          |
      | entityId                     | Le client id doit être compris entre 36 et 64 caractères           |

  @ci
  Scénario: Instance Modification - Erreur autres validations
    Etant donné que je me connecte à l'espace partenaires
    Et que je suis sur la page liste des instances
    Et que je clique sur la première instance
    Et que je suis sur la page modification d'instance
    Quand j'entre les valeurs dans les champs suivants du formulaire de modification d'instance
      | name                          | value                                 |
      | name                          | L'instance ^$1ù*µ-=+#$                |
      | signupId                      | abcdefg                               |
      | site[0]                       | franceconnect.gouv.fr                 |
      | redirect_uris[0]              | http://localhost/callback             |
      | post_logout_redirect_uris[0]  | ftp://testIsUrl.com                   |
      | IPServerAddressesAndRanges[0] | 1.1.1.1/32                            |
      | entityId                      | _4a858a99-5baf-4068-bd59-ff551ede3619 |
    Et je valide le formulaire de modification d'instance
    Alors je suis sur la page modification d'instance
    Et les champs suivants sont en erreur dans le formulaire de modification d'instance
      | name                         | errorMessage                                                                  |
      | signupId                     | Veuillez saisir un numéro valide                                              |
      | site[0]                      | Veuillez saisir une url valide                                                |
      | post_logout_redirect_uris[0] | Veuillez saisir une url valide                                                |
      | entityId                     | Veuillez saisir le client id de votre fournisseur de service FranceConnect v1 |
    Et les champs suivants ne sont pas en erreur dans le formulaire de modification d'instance
      | name                          |
      | name                          |
      | platform                      |
      | redirect_uris[0]              |
      | IPServerAddressesAndRanges[0] |

  @ci
  Scénario: Instance Modification - Défiler vers la première erreur
    Etant donné que je me connecte à l'espace partenaires
    Et que je suis sur la page liste des instances
    Et que je clique sur la première instance
    Et que je suis sur la page modification d'instance
    Quand j'entre les valeurs dans les champs suivants du formulaire de modification d'instance
      | name     | value                                 |
      | name     |                                       |
      | entityId | _4a858a99-5baf-4068-bd59-ff551ede3619 |
    Et je valide le formulaire de modification d'instance
    Alors je suis sur la page modification d'instance
    Et les champs suivants sont en erreur dans le formulaire de modification d'instance
      | name     | errorMessage                                                                  |
      | name     | Veuillez saisir le nom de votre instance                                      |
      | entityId | Veuillez saisir le client id de votre fournisseur de service FranceConnect v1 |
    Et le champ "name" est visible à l'écran dans le formulaire de modification d'instance
    Et le champ "entityId" n'est pas visible à l'écran dans le formulaire de modification d'instance

  @ci
  Scénario: Instance Modification - Modification après correction
    Etant donné que je me connecte à l'espace partenaires
    Et que je suis sur la page liste des instances
    Et que je clique sur la première instance
    Et que je suis sur la page modification d'instance
    Et que j'utilise l'instance de FS "avec entityId"
    Et que j'entre les valeurs par défaut pour mon instance
    Et que j'entre "abcdef" dans le champ "signupId" du formulaire de modification d'instance
    Et que je valide le formulaire de modification d'instance
    Et que je suis sur la page modification d'instance
    Et que l'erreur du champ "signupId" contient "Veuillez saisir un numéro valide" dans le formulaire de modification d'instance
    Quand j'entre "123000" dans le champ "signupId" du formulaire de modification d'instance
    Et je valide le formulaire de modification d'instance
    Alors je suis redirigé vers la page liste des instances
    Et la confirmation de modification de l'instance est affichée
    Et l'instance modifiée est affichée
