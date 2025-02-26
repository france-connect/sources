#language:fr
Fonctionnalité: Instance - Création avec erreurs
  # En tant que partenaire,
  # je veux être guidé pour corriger mon formulaire de création
  # afin de finaliser la création d'une instance de FS

  @ci
  Scénario: Instance Création - Erreur champ obligatoires
    Etant donné que je me connecte à l'espace partenaires
    Et que je suis sur la page liste des instances
    Et que je clique sur le lien d'ajout d'une instance
    Et que je suis redirigé vers la page création d'instance
    Quand je valide le formulaire de création d'instance
    Alors je suis sur la page création d'instance
    Et les champs suivants sont en erreur dans le formulaire de création d'instance
      | name                         | errorMessage                                             |
      | name                         | Veuillez saisir le nom de votre instance                 |
      | site[0]                      | Veuillez saisir votre url de site                        |
      | redirect_uris[0]             | Veuillez saisir votre url de connexion (url de callback) |
      | post_logout_redirect_uris[0] | Veuillez saisir votre url de déconnexion (url de logout) |
      | id_token_signed_response_alg | Ce champ est obligatoire                                 |
    Et les champs suivants ne sont pas en erreur dans le formulaire de création d'instance
      | name                          |
      | signupId                      |
      | IPServerAddressesAndRanges[0] |
      | entityId                      |

  Scénario: Instance Création - Erreur champs trop longs
    Etant donné que je me connecte à l'espace partenaires
    Et que je suis sur la page liste des instances
    Et que je clique sur le lien d'ajout d'une instance
    Et que je suis redirigé vers la page création d'instance
    Quand j'entre les chaines de caractères longues dans les champs suivants du formulaire de création d'instance
      | name                         | totalLength | prefix                         | suffix    |
      | name                         | 257         | bdd_                           |           |
      | signupId                     | 8           | 12345678                       |           |
      | site[0]                      | 1025        | https://franceconnect.gouv.fr/ |           |
      | redirect_uris[0]             | 1025        | https://franceconnect.gouv.fr/ | /callback |
      | post_logout_redirect_uris[0] | 1025        | https://franceconnect.gouv.fr/ | /callback |
      | entityId                     | 65          |                                |           |
    Et je valide le formulaire de création d'instance
    Alors je suis sur la page création d'instance
    Et les champs suivants sont en erreur dans le formulaire de création d'instance
      | name                         | errorMessage                                                       |
      | name                         | Le nom de l’instance doit être de 256 caractères maximum           |
      | signupId                     | Le numéro de la demande datapass doit être de 7 caractères maximum |
      | site[0]                      | L’url de site doit être de 1024 caractères maximum                 |
      | redirect_uris[0]             | L’url de connexion doit être de 1024 caractères maximum            |
      | post_logout_redirect_uris[0] | L’url de déconnexion doit être de 1024 caractères maximum          |
      | entityId                     | Le client id doit être compris entre 36 et 64 caractères           |

  @ci
  Scénario: Instance Création - Erreur autres validations
    Etant donné que je me connecte à l'espace partenaires
    Et que je suis sur la page liste des instances
    Et que je clique sur le lien d'ajout d'une instance
    Et que je suis redirigé vers la page création d'instance
    Quand j'entre les valeurs dans les champs suivants du formulaire de création d'instance
      | name                          | value                                 |
      | name                          | L'instance ^$1ù*µ-=+#$                |
      | signupId                      | abcdefg                               |
      | site[0]                       | franceconnect.gouv.fr                 |
      | redirect_uris[0]              | http://localhost/callback             |
      | post_logout_redirect_uris[0]  | ftp://testIsUrl.com                   |
      | IPServerAddressesAndRanges[0] | 1.1.1.1/32                            |
      | id_token_signed_response_alg  | HS256                                 |
      | entityId                      | _4a858a99-5baf-4068-bd59-ff551ede3619 |
    Et je valide le formulaire de création d'instance
    Alors je suis sur la page création d'instance
    Et les champs suivants sont en erreur dans le formulaire de création d'instance
      | name                         | errorMessage                                                                  |
      | signupId                     | Veuillez saisir un numéro valide                                              |
      | site[0]                      | Veuillez saisir une url valide                                                |
      | post_logout_redirect_uris[0] | Veuillez saisir une url valide                                                |
      | id_token_signed_response_alg | Les algorithmes de signature autorisés sont les suivants: ES256 et RS256      |
      | entityId                     | Veuillez saisir le client id de votre fournisseur de service FranceConnect v1 |
    Et les champs suivants ne sont pas en erreur dans le formulaire de création d'instance
      | name                          |
      | name                          |
      | redirect_uris[0]              |
      | IPServerAddressesAndRanges[0] |

  # Ce scénario ne marche plus depuis que la taille du formulaire est plus petite
  # Il s'agît d'un problème Cypress non reproductible manuellement
  @ci @ignore
  Scénario: Instance Création - Défiler vers la première erreur
    Etant donné que je me connecte à l'espace partenaires
    Et que je suis sur la page liste des instances
    Et que je clique sur le lien d'ajout d'une instance
    Et que je suis redirigé vers la page création d'instance
    Et que j'utilise l'instance de FS "avec entityId"
    Quand j'entre les valeurs par défaut pour mon instance
    Et j'entre les valeurs dans les champs suivants du formulaire de création d'instance
      | name     | value                                 |
      | name     |                                       |
      | entityId | _4a858a99-5baf-4068-bd59-ff551ede3619 |
    Et je valide le formulaire de création d'instance
    Alors je suis sur la page création d'instance
    Et les champs suivants sont en erreur dans le formulaire de création d'instance
      | name     | errorMessage                                                                  |
      | name     | Veuillez saisir le nom de votre instance                                      |
      | entityId | Veuillez saisir le client id de votre fournisseur de service FranceConnect v1 |
    Et le champ "name" est visible à l'écran dans le formulaire de création d'instance
    Et le champ "entityId" n'est pas visible à l'écran dans le formulaire de création d'instance

  @ci
  Scénario: Instance Création - Création après correction
    Etant donné que je me connecte à l'espace partenaires
    Et que je suis sur la page liste des instances
    Et que je clique sur le lien d'ajout d'une instance
    Et que je suis redirigé vers la page création d'instance
    Et que j'utilise l'instance de FS "avec entityId"
    Et que j'entre les valeurs par défaut pour mon instance
    Et que j'entre "abcdef" dans le champ "signupId" du formulaire de création d'instance
    Et que je valide le formulaire de création d'instance
    Et que je suis sur la page création d'instance
    Et que l'erreur du champ "signupId" contient "Veuillez saisir un numéro valide" dans le formulaire de création d'instance
    Quand j'entre "123000" dans le champ "signupId" du formulaire de création d'instance
    Et je valide le formulaire de création d'instance
    Alors je suis redirigé vers la page liste des instances
    Et la confirmation de création de l'instance est affichée
    Et l'instance créée est affichée
