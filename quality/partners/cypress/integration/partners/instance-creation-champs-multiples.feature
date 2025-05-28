#language:fr
@ci
Fonctionnalité: Instance - Champs multiples

  Scénario: Champs multiples - Etat initial
    Etant donné que je me connecte à l'espace partenaires
    Et que je suis sur la page liste des instances
    Quand je clique sur le lien d'ajout d'une instance
    Alors je suis redirigé vers la page création d'instance
    Et le champ "site[0]" est affiché dans le formulaire de création d'instance
    Et le bouton "supprimer" du champ "site[0]" est désactivé dans le formulaire de création d'instance
    Et le champ "site[1]" n'est pas affiché dans le formulaire de création d'instance
    Et le champ "redirect_uris[0]" est affiché dans le formulaire de création d'instance
    Et le bouton "supprimer" du champ "redirect_uris[0]" est désactivé dans le formulaire de création d'instance
    Et le champ "redirect_uris[1]" n'est pas affiché dans le formulaire de création d'instance
    Et le champ "post_logout_redirect_uris[0]" est affiché dans le formulaire de création d'instance
    Et le bouton "supprimer" du champ "post_logout_redirect_uris[0]" est désactivé dans le formulaire de création d'instance
    Et le champ "post_logout_redirect_uris[1]" n'est pas affiché dans le formulaire de création d'instance
    Et le champ "IPServerAddressesAndRanges[0]" est affiché dans le formulaire de création d'instance
    Et le bouton "supprimer" du champ "IPServerAddressesAndRanges[0]" est désactivé dans le formulaire de création d'instance
    Et le champ "IPServerAddressesAndRanges[1]" n'est pas affiché dans le formulaire de création d'instance

  Scénario: Champs multiples - Ajout / Suppression d'un champ
    Etant donné que je me connecte à l'espace partenaires
    Et que je suis sur la page liste des instances
    Et que je clique sur le lien d'ajout d'une instance
    Et que je suis redirigé vers la page création d'instance
    Et que j'ajoute un champ "site" dans le formulaire de création d'instance
    Et que le champ "site[1]" est affiché dans le formulaire de création d'instance
    Et que le bouton "supprimer" du champ "site[0]" est actif dans le formulaire de création d'instance
    Et que le bouton "supprimer" du champ "site[1]" est actif dans le formulaire de création d'instance
    Quand je supprime le champ "site[0]" dans le formulaire de création d'instance
    Alors le champ "site[0]" est affiché dans le formulaire de création d'instance
    Et le bouton "supprimer" du champ "site[0]" est désactivé dans le formulaire de création d'instance
    Et le champ "site[1]" n'est pas affiché dans le formulaire de création d'instance

  Scénario: Champs multiples - Enregistrement de plusieurs valeurs
    Etant donné que je me connecte à l'espace partenaires
    Et que je suis sur la page liste des instances
    Et que je clique sur le lien d'ajout d'une instance
    Et que je suis redirigé vers la page création d'instance
    Et que j'utilise l'instance de FS "avec entityId"
    Et que j'entre les valeurs par défaut pour mon instance
    Et que j'entre "bdd création champs multiples" dans le champ "name" du formulaire de création d'instance
    Et que j'entre "https://test.com/site0" dans le champ "site[0]" du formulaire de création d'instance
    Et que j'ajoute un champ "site" dans le formulaire de création d'instance
    Et que j'entre "https://test.com/site1" dans le champ "site[1]" du formulaire de création d'instance
    Et que j'ajoute un champ "site" dans le formulaire de création d'instance
    Et que j'entre "https://test.com/site2" dans le champ "site[2]" du formulaire de création d'instance
    Et que j'ajoute un champ "site" dans le formulaire de création d'instance
    Et que j'entre "https://test.com/site3" dans le champ "site[3]" du formulaire de création d'instance
    Et que j'entre "https://test.com/redirect_uris0" dans le champ "redirect_uris[0]" du formulaire de création d'instance
    Et que j'ajoute un champ "redirect_uris" dans le formulaire de création d'instance
    Et que j'entre "https://test.com/redirect_uris1" dans le champ "redirect_uris[1]" du formulaire de création d'instance
    Et que j'ajoute un champ "redirect_uris" dans le formulaire de création d'instance
    Et que j'entre "https://test.com/redirect_uris2" dans le champ "redirect_uris[2]" du formulaire de création d'instance
    Et que j'ajoute un champ "redirect_uris" dans le formulaire de création d'instance
    Et que j'entre "https://test.com/redirect_uris3" dans le champ "redirect_uris[3]" du formulaire de création d'instance
    Et que j'entre "https://test.com/post_logout_redirect_uris0" dans le champ "post_logout_redirect_uris[0]" du formulaire de création d'instance
    Et que j'ajoute un champ "post_logout_redirect_uris" dans le formulaire de création d'instance
    Et que j'entre "https://test.com/post_logout_redirect_uris1" dans le champ "post_logout_redirect_uris[1]" du formulaire de création d'instance
    Et que j'ajoute un champ "post_logout_redirect_uris" dans le formulaire de création d'instance
    Et que j'entre "https://test.com/post_logout_redirect_uris2" dans le champ "post_logout_redirect_uris[2]" du formulaire de création d'instance
    Et que j'ajoute un champ "post_logout_redirect_uris" dans le formulaire de création d'instance
    Et que j'entre "https://test.com/post_logout_redirect_uris3" dans le champ "post_logout_redirect_uris[3]" du formulaire de création d'instance
    Et que j'entre "127.0.0.1/32" dans le champ "IPServerAddressesAndRanges[0]" du formulaire de création d'instance
    Et que j'ajoute un champ "IPServerAddressesAndRanges" dans le formulaire de création d'instance
    Et que j'entre "1.1.1.1" dans le champ "IPServerAddressesAndRanges[1]" du formulaire de création d'instance
    Et que j'ajoute un champ "IPServerAddressesAndRanges" dans le formulaire de création d'instance
    Et que j'entre "1.1.1.1/32" dans le champ "IPServerAddressesAndRanges[2]" du formulaire de création d'instance
    Et que j'ajoute un champ "IPServerAddressesAndRanges" dans le formulaire de création d'instance
    Et que j'entre "100.100.100.100/32" dans le champ "IPServerAddressesAndRanges[3]" du formulaire de création d'instance
    Quand je valide le formulaire de création d'instance
    Alors je suis redirigé vers la page liste des instances
    Et la confirmation de création de l'instance est affichée
    Et je clique sur l'instance "bdd création champs multiples"
    Et je suis redirigé vers la page modification d'instance
    Et les champs suivants sont initialisés dans le formulaire de création d'instance
      | name                          | value                                       |
      | site[0]                       | https://test.com/site0                      |
      | site[1]                       | https://test.com/site1                      |
      | site[2]                       | https://test.com/site2                      |
      | site[3]                       | https://test.com/site3                      |
      | redirect_uris[0]              | https://test.com/redirect_uris0             |
      | redirect_uris[1]              | https://test.com/redirect_uris1             |
      | redirect_uris[2]              | https://test.com/redirect_uris2             |
      | redirect_uris[3]              | https://test.com/redirect_uris3             |
      | post_logout_redirect_uris[0]  | https://test.com/post_logout_redirect_uris0 |
      | post_logout_redirect_uris[1]  | https://test.com/post_logout_redirect_uris1 |
      | post_logout_redirect_uris[2]  | https://test.com/post_logout_redirect_uris2 |
      | post_logout_redirect_uris[3]  | https://test.com/post_logout_redirect_uris3 |
      | IPServerAddressesAndRanges[0] | 127.0.0.1/32                                |
      | IPServerAddressesAndRanges[1] | 1.1.1.1                                     |
      | IPServerAddressesAndRanges[2] | 1.1.1.1/32                                  |
      | IPServerAddressesAndRanges[3] | 100.100.100.100/32                          |

  Scénario: Champs multiples - Suppresssion de plusieurs valeurs
    Etant donné que je me connecte à l'espace partenaires
    Et que je suis sur la page liste des instances
    Et que je clique sur l'instance "bdd création champs multiples"
    Et que je suis redirigé vers la page modification d'instance
    Et que j'entre "bdd création champs multiples" dans le champ "name" du formulaire de modification d'instance
    Et que j'entre "https://fc.com/site0" dans le champ "site[0]" du formulaire de modification d'instance
    Et que j'entre "https://fc.com/site1" dans le champ "site[1]" du formulaire de modification d'instance
    Et que je supprime le champ "site[2]" dans le formulaire de modification d'instance
    Et que je supprime le champ "site[2]" dans le formulaire de modification d'instance
    Et que j'entre "https://fc.com/redirect_uris0" dans le champ "redirect_uris[0]" du formulaire de modification d'instance
    Et que je supprime le champ "redirect_uris[3]" dans le formulaire de modification d'instance
    Et que je supprime le champ "redirect_uris[2]" dans le formulaire de modification d'instance
    Et que je supprime le champ "redirect_uris[1]" dans le formulaire de modification d'instance
    Et que je supprime le champ "post_logout_redirect_uris[2]" dans le formulaire de modification d'instance
    Et que je supprime le champ "IPServerAddressesAndRanges[1]" dans le formulaire de modification d'instance
    Et que j'entre "2.2.2.2/32" dans le champ "IPServerAddressesAndRanges[1]" du formulaire de modification d'instance
    Quand je valide le formulaire de modification d'instance
    Alors je suis redirigé vers la page liste des instances
    Et la confirmation de modification de l'instance est affichée
    Et je clique sur l'instance "bdd création champs multiples"
    Et je suis redirigé vers la page modification d'instance
    Et les champs suivants sont initialisés dans le formulaire de modification d'instance
      | name                          | value                                       |
      | site[0]                       | https://fc.com/site0                        |
      | site[1]                       | https://fc.com/site1                        |
      | redirect_uris[0]              | https://fc.com/redirect_uris0               |
      | post_logout_redirect_uris[0]  | https://test.com/post_logout_redirect_uris0 |
      | post_logout_redirect_uris[1]  | https://test.com/post_logout_redirect_uris1 |
      | post_logout_redirect_uris[2]  | https://test.com/post_logout_redirect_uris3 |
      | IPServerAddressesAndRanges[0] | 127.0.0.1/32                                |
      | IPServerAddressesAndRanges[1] | 2.2.2.2/32                                  |
      | IPServerAddressesAndRanges[2] | 100.100.100.100/32                          |
    Et les champs suivants ne sont pas affichés dans le formulaire de modification d'instance
      | name                          |
      | site[2]                       |
      | site[3]                       |
      | redirect_uris[1]              |
      | redirect_uris[2]              |
      | redirect_uris[3]              |
      | post_logout_redirect_uris[3]  |
      | IPServerAddressesAndRanges[3] |

  Scénario: Champs multiples - Erreur après ajout de champ vide
    Etant donné que je me connecte à l'espace partenaires
    Et que je suis sur la page liste des instances
    Et que je clique sur le lien d'ajout d'une instance
    Et que je suis redirigé vers la page création d'instance
    Et que j'utilise l'instance de FS "avec entityId"
    Et que j'entre les valeurs par défaut pour mon instance
    Et que j'ajoute un champ "site" dans le formulaire de création d'instance
    Et que j'ajoute un champ "redirect_uris" dans le formulaire de création d'instance
    Et que j'ajoute un champ "post_logout_redirect_uris" dans le formulaire de création d'instance
    Et que j'ajoute un champ "IPServerAddressesAndRanges" dans le formulaire de création d'instance
    Quand je valide le formulaire de création d'instance
    Alors les champs suivants sont en erreur dans le formulaire de création d'instance
      | name                          | errorMessage                          |
      | site[1]                       | Veuillez saisir une url valide        |
      | redirect_uris[1]              | Veuillez saisir une url valide        |
      | post_logout_redirect_uris[1]  | Veuillez saisir une url valide        |
      | IPServerAddressesAndRanges[1] | Veuillez saisir une adresse IP valide |
    Et les champs suivants ne sont pas en erreur dans le formulaire de création d'instance
      | name                          |
      | site[0]                       |
      | redirect_uris[0]              |
      | post_logout_redirect_uris[0]  |
      | IPServerAddressesAndRanges[0] |

  Scénario: Champs multiples - Erreur après ajout de champ au mauvais format
    Etant donné que je me connecte à l'espace partenaires
    Et que je suis sur la page liste des instances
    Et que je clique sur le lien d'ajout d'une instance
    Et que je suis redirigé vers la page création d'instance
    Et que j'utilise l'instance de FS "avec entityId"
    Et que j'entre les valeurs par défaut pour mon instance
    Et que j'ajoute un champ "site" dans le formulaire de création d'instance
    Et que j'ajoute un champ "redirect_uris" dans le formulaire de création d'instance
    Et que j'ajoute un champ "post_logout_redirect_uris" dans le formulaire de création d'instance
    Et que j'ajoute un champ "IPServerAddressesAndRanges" dans le formulaire de création d'instance
    Et que j'entre les valeurs dans les champs suivants du formulaire de création d'instance
      | name                          | value                       |
      | site[1]                       | mauvais format d'url        |
      | redirect_uris[1]              | mauvais format d'url        |
      | post_logout_redirect_uris[1]  | mauvais format d'url        |
      | IPServerAddressesAndRanges[1] | mauvais format d'adresse IP |
    Quand je valide le formulaire de création d'instance
    Alors les champs suivants sont en erreur dans le formulaire de création d'instance
      | name                          | errorMessage                          |
      | site[1]                       | Veuillez saisir une url valide        |
      | redirect_uris[1]              | Veuillez saisir une url valide        |
      | post_logout_redirect_uris[1]  | Veuillez saisir une url valide        |
      | IPServerAddressesAndRanges[1] | Veuillez saisir une adresse IP valide |
    Et les champs suivants ne sont pas en erreur dans le formulaire de création d'instance
      | name                          |
      | site[0]                       |
      | redirect_uris[0]              |
      | post_logout_redirect_uris[0]  |
      | IPServerAddressesAndRanges[0] |

  Scénario: Champs multiples - Création domaines de callback hétérogènes
    Etant donné que je me connecte à l'espace partenaires
    Et que je suis sur la page liste des instances
    Et que je clique sur le lien d'ajout d'une instance
    Et que je suis redirigé vers la page création d'instance
    Et que j'utilise l'instance de FS "avec entityId"
    Et que j'entre les valeurs par défaut pour mon instance
    Et que j'entre "https://test-1.com/callback" dans le champ "redirect_uris[0]" du formulaire de création d'instance
    Et que j'ajoute un champ "redirect_uris" dans le formulaire de création d'instance
    Et que j'entre "https://test-2.com/callback" dans le champ "redirect_uris[1]" du formulaire de création d'instance
    Quand je valide le formulaire de création d'instance
    Alors l'erreur du champ "redirect_uris[0]" contient "Veuillez renseigner un seul nom de domaine et de sous domaine" dans le formulaire de création d'instance
    Et l'erreur du champ "redirect_uris[1]" contient "Veuillez renseigner un seul nom de domaine et de sous domaine" dans le formulaire de création d'instance

  Scénario: Champs multiples - Modification domaines de callback hétérogènes
    Etant donné que je me connecte à l'espace partenaires
    Et que je suis sur la page liste des instances
    Et que je clique sur l'instance "bdd création champs multiples"
    Et que je suis redirigé vers la page modification d'instance
    Et que j'entre "https://test-1.com/callback" dans le champ "redirect_uris[0]" du formulaire de création d'instance
    Et que j'ajoute un champ "redirect_uris" dans le formulaire de création d'instance
    Et que j'entre "https://test-2.com/callback" dans le champ "redirect_uris[1]" du formulaire de création d'instance
    Quand je valide le formulaire de modification d'instance
    Alors l'erreur du champ "redirect_uris[0]" contient "Veuillez renseigner un seul nom de domaine et de sous domaine" dans le formulaire de création d'instance
    Et l'erreur du champ "redirect_uris[1]" contient "Veuillez renseigner un seul nom de domaine et de sous domaine" dans le formulaire de création d'instance

  Scénario: Champs multiples - Création domaines de callback hétérogènes avec sector_identifier_uri
    Etant donné que je me connecte à l'espace partenaires
    Et que je suis sur la page liste des instances
    Et que je clique sur le lien d'ajout d'une instance
    Et que je suis redirigé vers la page création d'instance
    Et que j'utilise l'instance de FS "avec entityId"
    Et que j'entre les valeurs par défaut pour mon instance
    Et que j'entre "création avec sector_identifier_uri" dans le champ "name" du formulaire de création d'instance
    Et que j'entre "https://test-1.com/callback" dans le champ "redirect_uris[0]" du formulaire de création d'instance
    Et que j'ajoute un champ "redirect_uris" dans le formulaire de création d'instance
    Et que j'entre "https://test-2.com/callback" dans le champ "redirect_uris[1]" du formulaire de création d'instance
    Et que j'entre "https://test-1.com/sector-identifier" dans le champ "sector_identifier_uri" du formulaire de création d'instance
    Quand je valide le formulaire de création d'instance
    Alors je suis redirigé vers la page liste des instances
    Et la confirmation de création de l'instance est affichée
    Et je clique sur l'instance "création avec sector_identifier_uri"
    Et je suis redirigé vers la page modification d'instance
    Et les champs suivants sont initialisés dans le formulaire de création d'instance
      | name                  | value                                |
      | redirect_uris[0]      | https://test-1.com/callback          |
      | redirect_uris[1]      | https://test-2.com/callback          |
      | sector_identifier_uri | https://test-1.com/sector-identifier |

  Scénario: Champs multiples - Modification domaines de callback hétérogènes avec sector_identifier_uri
    Etant donné que je me connecte à l'espace partenaires
    Et que je suis sur la page liste des instances
    Et que je clique sur l'instance "création avec sector_identifier_uri"
    Et que je suis redirigé vers la page modification d'instance
    Et que j'entre "https://test-3.com/callback" dans le champ "redirect_uris[0]" du formulaire de création d'instance
    Et que j'entre "https://test-4.com/callback" dans le champ "redirect_uris[1]" du formulaire de création d'instance
    Et que j'entre "https://test-3.com/sector-identifier" dans le champ "sector_identifier_uri" du formulaire de création d'instance
    Quand je valide le formulaire de modification d'instance
    Alors je suis redirigé vers la page liste des instances
    Et la confirmation de modification de l'instance est affichée
    Et je clique sur l'instance "création avec sector_identifier_uri"
    Et je suis redirigé vers la page modification d'instance
    Et les champs suivants sont initialisés dans le formulaire de création d'instance
      | name                  | value                                |
      | redirect_uris[0]      | https://test-3.com/callback          |
      | redirect_uris[1]      | https://test-4.com/callback          |
      | sector_identifier_uri | https://test-3.com/sector-identifier |

  Scénario: Champs multiples - Erreur entre deux valeurs valides
    Etant donné que je me connecte à l'espace partenaires
    Et que je suis sur la page liste des instances
    Et que je clique sur le lien d'ajout d'une instance
    Et que je suis redirigé vers la page création d'instance
    Et que j'entre "https://test.com/site0" dans le champ "site[0]" du formulaire de création d'instance
    Et que j'ajoute un champ "site" dans le formulaire de création d'instance
    Et que j'ajoute un champ "site" dans le formulaire de création d'instance
    Et que j'entre "https://test.com/site2" dans le champ "site[2]" du formulaire de création d'instance
    Quand je valide le formulaire de création d'instance
    Alors l'erreur du champ "site[1]" contient "Veuillez saisir une url valide" dans le formulaire de création d'instance
    Et les champs suivants ne sont pas en erreur dans le formulaire de création d'instance
      | name    |
      | site[0] |
      | site[2] |

  Scénario: Champs multiples - Suppression d'un champ en erreur
    Etant donné que je me connecte à l'espace partenaires
    Et que je suis sur la page liste des instances
    Et que je clique sur le lien d'ajout d'une instance
    Et que je suis redirigé vers la page création d'instance
    Et que j'entre "https://test.com/site0" dans le champ "site[0]" du formulaire de création d'instance
    Et que j'ajoute un champ "site" dans le formulaire de création d'instance
    Et que j'entre "non valide" dans le champ "site[1]" du formulaire de création d'instance
    Et que je valide le formulaire de création d'instance
    # Et que l'erreur du champ "site[1]" contient "Veuillez saisir une url valide" dans le formulaire de création d'instance
    Quand je supprime le champ "site[1]" dans le formulaire de création d'instance
    Alors le champ "site[1]" n'est pas affiché dans le formulaire de création d'instance
    Et le champ "site[1]" n'est pas en erreur dans le formulaire de création d'instance
    Et le champ "site[0]" contient "https://test.com/site0" dans le formulaire de création d'instance
    Et le champ "site[0]" n'est pas en erreur dans le formulaire de création d'instance
