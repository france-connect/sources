#language: fr
@validationVisuelle
Fonctionnalité: Validation Visuelle - Espace Partenaires

  Plan du Scénario: Validation Visuelle - Page Accueil sur <device>
    Etant donné que j'utilise un navigateur web sur "<device>"
    Quand je navigue sur la page d'accueil de l'espace partenaires
    Alors je suis redirigé vers la page login de l'espace partenaires
    Et la copie d'écran "homepage" correspond à la page actuelle sur "<device>"

    Exemples:
      | device           |
      | mobile           |
      | tablet portrait  |
      | tablet landscape |
      | desktop          |

  Plan du Scénario: Validation Visuelle - Liste des instances sur <device>
    Etant donné que j'utilise un navigateur web sur "<device>"
    Quand je navigue sur la page d'accueil de l'espace partenaires
    Et que je me connecte à l'espace partenaires
    Alors je suis sur la page liste des instances
    Et la copie d'écran "liste des instances" correspond à la page actuelle sur "<device>"

    Exemples:
      | device           |
      | mobile           |
      | tablet portrait  |
      | tablet landscape |
      | desktop          |

  Plan du Scénario: Validation Visuelle - Liste des instances vierge sur <device>
    Etant donné que j'utilise un navigateur web sur "<device>"
    Quand je me connecte à l'espace partenaires avec un utilisateur "partenaire sans instance"
    Alors je suis sur la page liste des instances
    Et la copie d'écran "liste des instances vierge" correspond à la page actuelle sur "<device>"

    Exemples:
      | device           |
      | mobile           |
      | tablet portrait  |
      | tablet landscape |
      | desktop          |

  Plan du Scénario: Validation Visuelle - Formulaire de création sur <device>
    Etant donné que j'utilise un navigateur web sur "<device>"
    Et que je me connecte à l'espace partenaires
    Et que je suis sur la page liste des instances
    Quand je clique sur le lien d'ajout d'une instance
    Alors je suis redirigé vers la page création d'instance
    Et la copie d'écran "formulaire de création" correspond à la page actuelle sur "<device>"

    Exemples:
      | device           |
      | mobile           |
      | tablet portrait  |
      | tablet landscape |
      | desktop          |

  Plan du Scénario: Validation Visuelle - Formulaire de modification sur <device>
    Etant donné que j'utilise un navigateur web sur "<device>"
    Et que je me connecte à l'espace partenaires
    Et que je suis sur la page liste des instances
    Quand je clique sur la première instance
    Alors je suis redirigé vers la page modification d'instance
    Et la copie d'écran "formulaire de modification" correspond à la page actuelle sur "<device>"

    Exemples:
      | device           |
      | mobile           |
      | tablet portrait  |
      | tablet landscape |
      | desktop          |

  Plan du Scénario: Validation Visuelle - Expiration de session
    Etant donné que j'utilise un navigateur web sur "<device>"
    Et que je me connecte à l'espace partenaires
    Et que je suis sur la page liste des instances
    Et que je supprime tous les cookies
    Quand je clique sur la première instance
    Alors je suis redirigé vers la page login de l'espace partenaires
    Et la copie d'écran "expiration de session" correspond à la page actuelle sur "<device>"

    Exemples:
      | device           |
      | mobile           |
      | tablet portrait  |
      | tablet landscape |
      | desktop          |

  Plan du Scénario: Validation Visuelle - Page Plan du Site sur <device>
    Etant donné que j'utilise un navigateur web sur "<device>"
    Et que je navigue sur la page d'accueil de l'espace partenaires
    Et que je suis redirigé vers la page login de l'espace partenaires
    Quand je clique sur le lien "Plan du site" dans le footer
    Alors je suis redirigé vers la page plan du site
    Et la copie d'écran "sitemap" correspond à la page actuelle sur "<device>"

    Exemples:
      | device           |
      | mobile           |
      | tablet portrait  |
      | tablet landscape |
      | desktop          |

  Plan du Scénario: Validation Visuelle - Page Mentions Légales sur <device>
    Etant donné que j'utilise un navigateur web sur "<device>"
    Et que je navigue sur la page d'accueil de l'espace partenaires
    Et que je suis redirigé vers la page login de l'espace partenaires
    Quand je clique sur le lien "Mentions légales" dans le footer
    Alors je suis redirigé vers la page mentions légales
    Et la copie d'écran "legal-notices" correspond à la page actuelle sur "<device>"

    Exemples:
      | device           |
      | mobile           |
      | tablet portrait  |
      | tablet landscape |
      | desktop          |
