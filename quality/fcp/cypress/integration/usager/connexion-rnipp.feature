#language: fr
@usager @connexionRnipp
Fonctionnalité: Connexion Usager - RNIPP
  # En tant qu'usager d'un fournisseur de service,
  # je veux me connecter en utilisant un fournisseur d'identité et récupérer mes informations du RNIPP
  # afin de les communiquer au fournisseur de service

  @fcpLow
  Plan du Scénario: Connexion d'un usager - rnipp <userType>
    Etant donné que le fournisseur de service requiert l'accès aux informations des scopes "tous les scopes"
    Et que je navigue sur la page fournisseur de service
    Et que je clique sur le bouton FranceConnect
    Et que je suis redirigé vers la page sélection du fournisseur d'identité
    Et que j'utilise un fournisseur d'identité "actif"
    Et que je clique sur le fournisseur d'identité
    Et que je suis redirigé vers la page login du fournisseur d'identité
    Et que j'utilise un compte usager "<userType>"
    Quand je m'authentifie avec succès
    Et je suis redirigé vers la page confirmation de connexion
    Et les informations demandées par le fournisseur de service correspondent aux scopes "tous les scopes"
    Et je continue sur le fournisseur de service
    Alors je suis redirigé vers la page fournisseur de service
    Et je suis connecté au fournisseur de service
    Et le fournisseur de service a accès aux informations des scopes "tous les scopes"

    @ci
    Exemples:
      | userType                |
      | présumé né jour         |
      | présumé né jour et mois |
      | né en Corse             |

    # FC Low va appeler le RNIPP avec le COG fourni pour le lieu de naissance (si au format COG)
    # Lorsque le RNIPP mock reçoit un lieu de naissance ne commençant par "99", il considère que l'usager est né en France.
    # Le test avec usager "né à l'étranger avec un lieu de naissance (COG)" renverra un usager né en France.
    Exemples:
      | userType                                          |
      | né à l'étranger avec un lieu de naissance (COG)   |
      | né à l'étranger avec un lieu de naissance (texte) |

  @fcpHigh
  Plan du Scénario: Connexion d'un usager - tous les claims rnipp avec usager <userType>
    Etant donné que le fournisseur de service requiert l'accès aux informations des scopes "tous les scopes rnipp (authorize)"
    Et que je navigue sur la page fournisseur de service
    Et que je clique sur le bouton FranceConnect
    Et que je suis redirigé vers la page sélection du fournisseur d'identité
    Et que j'utilise un fournisseur d'identité "actif"
    Et que je clique sur le fournisseur d'identité
    Et que je suis redirigé vers la page login du fournisseur d'identité
    Et que j'utilise un compte usager "<userType>"
    Quand je m'authentifie avec succès
    Et je suis redirigé vers la page confirmation de connexion
    Et les informations demandées par le fournisseur de service correspondent aux scopes "tous les scopes rnipp (authorize)"
    Et je continue sur le fournisseur de service
    Alors je suis redirigé vers la page fournisseur de service
    Et je suis connecté au fournisseur de service
    Et le fournisseur de service a accès aux informations des scopes "tous les scopes rnipp (userinfo)"

    @ci
    Exemples:
      | userType                |
      | présumé né jour         |
      | présumé né jour et mois |
      | né en Corse             |

    # FC+ va appeler le RNIPP avec le COG fourni pour le lieu de naissance (si au format COG)
    # Lorsque le RNIPP mock reçoit un lieu de naissance ne commençant par "99", il considère que l'usager est né en France.
    # Le test avec usager "né à l'étranger avec un lieu de naissance (COG)" renverra strictement les données fournies par le FI.
    # Dans le cas usager "né à l'étranger avec un lieu de naissance (COG)", le claim rnipp_birthcountry sera 99100.
    # Dans le cas usager "né à l'étranger avec un lieu de naissance (texte)", le claim birthplace contient le texte fourni par le FI.
    Exemples:
      | userType                                          |
      | né à l'étranger avec un lieu de naissance (COG)   |
      | né à l'étranger avec un lieu de naissance (texte) |

  @fcpLow @fcpHigh
  Plan du Scénario: Connexion avec erreur Y600006 identité <description> renvoyée par le FI
    Etant donné que je navigue sur la page fournisseur de service
    Et que je clique sur le bouton FranceConnect
    Et que je suis redirigé vers la page sélection du fournisseur d'identité
    Et que je clique sur le fournisseur d'identité
    Et que je suis redirigé vers la page login du fournisseur d'identité
    Quand je m'authentifie avec "<username>"
    Alors je suis redirigé vers la page erreur technique FranceConnect
    Et le code d'erreur FranceConnect est "Y600006"
    Et le message d'erreur FranceConnect est "Une erreur technique est survenue, fermez l’onglet de votre navigateur et reconnectez-vous"
    Et l'événement "FC_REQUESTED_IDP_USERINFO" est journalisé avec "idpId" "non null"
    Et l'événement "FC_REQUESTED_RNIPP" n'est pas journalisé

    Exemples:
      | username         | description                            |
      | sans_genre       | sans genre                             |
      | sans_mail        | sans adresse e-mail                    |
      | test_INVALID_COG | avec lieu de naissance non valide      |
      | sans_birthplace  | né en France et sans lieu de naissance |

  Plan du Scénario: Connexion avec erreur RNIPP <errorCode> <scenario>
    Etant donné que je navigue sur la page fournisseur de service
    Et que je clique sur le bouton FranceConnect
    Et que je suis redirigé vers la page sélection du fournisseur d'identité
    Et que je clique sur le fournisseur d'identité
    Et que je suis redirigé vers la page login du fournisseur d'identité
    Quand je m'authentifie avec "<username>"
    Alors je suis redirigé vers la page erreur technique FranceConnect
    Et le code d'erreur FranceConnect est "<errorCode>"
    Et l'événement "<event>" est journalisé avec "idpId" "non null"

    @fcpLow @fcpHigh
    Exemples:
      | scenario                       | username | errorCode | event                     |
      | non trouvé avec un echo        | E010004  | Y010004   | FC_RECEIVED_INVALID_RNIPP |
      | non trouvé plusieurs echos     | E010006  | Y010006   | FC_RECEIVED_INVALID_RNIPP |
      | echo avec le nom d'usage       | E010007  | Y010007   | FC_RECEIVED_INVALID_RNIPP |
      | mauvais format de requête      | E010009  | Y010009   | FC_FAILED_RNIPP           |
      | pas de réponse du RNIPP        | E010011  | Y010011   | FC_FAILED_RNIPP           |
      | impossible de joindre le RNIPP | E010012  | Y010012   | FC_FAILED_RNIPP           |
      | citoyen sans nom dans le RNIPP | E010013  | Y010013   | FC_RECEIVED_INVALID_RNIPP |
      | statut non valide              | E010099  | Y010013   | FC_RECEIVED_INVALID_RNIPP |

    @fcpLow @fcpHigh @exceptions
    Exemples:
      | scenario      | username | errorCode | event                      |
      | usager décédé | E010015  | Y010015   | FC_RECEIVED_DECEASED_RNIPP |

    @fcpLow
    Exemples:
      | scenario          | username | errorCode | event                     |
      | aucun echo trouvé | E010008  | Y010008   | FC_RECEIVED_INVALID_RNIPP |

  @fcpHigh @exceptions
  Plan du Scénario: Connexion avec erreur RNIPP <errorCode> <scenario>
    Etant donné que je navigue sur la page fournisseur de service
    Et que je clique sur le bouton FranceConnect
    Et que je suis redirigé vers la page sélection du fournisseur d'identité
    Et que je clique sur le fournisseur d'identité
    Et que je suis redirigé vers la page login du fournisseur d'identité
    Quand je m'authentifie avec "<username>"
    Alors je suis redirigé vers la page erreur technique FranceConnect
    Et le code d'erreur FranceConnect est "<errorCode>"
    Et le sous-titre de la page d'erreur est "Besoin d'aide ?"
    Et le message d'erreur FranceConnect est "Merci de consulter notre page d’aide FranceConnect."
    Et le bouton "consulter la faq" est affiché
    Et le lien vers la faq contient le code d'erreur "<errorCode>"

    Exemples:
      | scenario          | username | errorCode | event                     |
      | aucun echo trouvé | E010008  | Y010008   | FC_RECEIVED_INVALID_RNIPP |
