#language: fr
@validationVisuelle
Fonctionnalité: Validation Visuelle - Espace Partenaires - Fournisseurs de Service

  Plan du Scénario: Validation Visuelle - Liste des fournisseurs de service vide sur <device>
    Etant donné que j'utilise un navigateur web sur "<device>"
    Et que je me connecte à l'espace partenaires avec un utilisateur "partenaire sans fournisseur de service"
    Quand je navigue sur la page fournisseurs de service de l'espace partenaires
    Alors je suis redirigé vers la page fournisseurs de service
    Et la copie d'écran "fournisseurs-de-service" correspond à la page actuelle sur "<device>"

    Exemples:
      | device           |
      | desktop          |

  Plan du Scénario: Validation Visuelle - Liste des fournisseurs de service sur <device>
    Etant donné que j'utilise un navigateur web sur "<device>"
    Et que je me connecte à l'espace partenaires avec un utilisateur "partenaire avec deux fournisseurs de service"
    Quand je navigue sur la page fournisseurs de service de l'espace partenaires
    Alors je suis redirigé vers la page fournisseurs de service
    Et la copie d'écran "fournisseurs-de-service" correspond à la page actuelle sur "<device>"

    Exemples:
      | device           |
      | desktop          |

  Plan du Scénario: Validation Visuelle - Page d'un fournisseur de service avec bacs à sable vides sur <device>
    Etant donné que j'utilise un navigateur web sur "<device>"
    Et que je me connecte à l'espace partenaires avec un utilisateur "partenaire avec deux fournisseurs de service"
    Quand je navigue sur la page fournisseurs de service de l'espace partenaires
    Et que je clique sur le fournisseur de service "SP3 - Fournisseur de service de test sans instance"
    Alors je suis redirigé vers la page détails du fournisseur de service
    Et la copie d'écran "fournisseur-de-service-details-bacs-vides" correspond à la page actuelle sur "<device>"

    Exemples:
      | device           |
      | desktop          |

  Plan du Scénario: Validation Visuelle - Page d'un fournisseur de service avec accès aux bacs à sable sur <device>
    Etant donné que j'utilise un navigateur web sur "<device>"
    Et que je me connecte à l'espace partenaires avec un utilisateur "partenaire avec deux fournisseurs de service"
    Quand je navigue sur la page fournisseurs de service de l'espace partenaires
    Et que je clique sur le fournisseur de service "SP2 - Fournisseur de service de test avec 1 instance"
    Alors je suis redirigé vers la page détails du fournisseur de service
    Et la copie d'écran "fournisseur-de-service-details-bacs-avec-acces" correspond à la page actuelle sur "<device>"

    Exemples:
      | device           |
      | desktop          |

  Plan du Scénario: Validation Visuelle - Page d'un fournisseur de service avec boutons créer un accès et relier les instances sur <device>
    Etant donné que j'utilise un navigateur web sur "<device>"
    Et que je me connecte à l'espace partenaires avec un utilisateur "partenaire avec au moins un fournisseur de service"
    Et que je navigue sur la page fournisseurs de service de l'espace partenaires
    Et que je clique sur le fournisseur de service "SP5 - FS pour lier les instances"
    Alors je suis redirigé vers la page détails du fournisseur de service
    Et la copie d'écran "fournisseur-de-service-details-bouton-relier-instances" correspond à la page actuelle sur "<device>"

    Exemples:
      | device           |
      | desktop          |

  Plan du Scénario: Validation Visuelle - Page de liaison des instances d'un fournisseur de service sur <device>
    Etant donné que j'utilise un navigateur web sur "<device>"
    Et que je me connecte à l'espace partenaires avec un utilisateur "partenaire avec au moins un fournisseur de service"
    Et que je navigue sur la page fournisseurs de service de l'espace partenaires
    Et que je clique sur le fournisseur de service "SP5 - FS pour lier les instances"
    Quand je clique sur le bouton "relier les instances"
    Alors je suis redirigé vers la page de liaison des instances
    Et la copie d'écran "fournisseur-de-service-liaison-instances" correspond à la page actuelle sur "<device>"

    Exemples:
      | device           |
      | desktop          |

  Plan du Scénario: Validation Visuelle - Formulaire de création d'instance depuis le FS sur <device>
    Etant donné que j'utilise un navigateur web sur "<device>"
    Et que je me connecte à l'espace partenaires avec un utilisateur "partenaire avec deux fournisseurs de service"
    Et que je navigue sur la page fournisseurs de service de l'espace partenaires
    Et que je clique sur le fournisseur de service "SP3 - Fournisseur de service de test sans instance"
    Et que je suis redirigé vers la page détails du fournisseur de service
    Quand je clique sur le bouton "créer une instance"
    Alors je suis redirigé vers la page création d'instance depuis un fournisseur de service
    Et la copie d'écran "fournisseur-de-service-création-instance" correspond à la page actuelle sur "<device>"

    Exemples:
      | device           |
      | desktop          |

  Plan du Scénario: Validation Visuelle - Page d'un fournisseur de service non accessible sur <device>
    Etant donné que j'utilise un navigateur web sur "<device>"
    Et que je me connecte à l'espace partenaires avec un utilisateur "partenaire avec deux fournisseurs de service"
    Quand je navigue sur la page fournisseurs de service introuvable
    Alors je suis redirigé vers la page d'erreur du fournisseur de service
    Et la copie d'écran "fournisseur-de-service-introuvable-details" correspond à la page actuelle sur "<device>"

    Exemples:
      | device           |
      | desktop          |
