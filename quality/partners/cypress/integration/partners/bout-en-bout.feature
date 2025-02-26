#language:fr
@ci @ignoreCI
Fonctionnalité: Bout-en-Bout
  # En tant que partenaire,
  # je veux créer une instance
  # afin de configurer mon fournisseur d'identité dans l'environnement sandbox

# client_id : 6925fb8143c76eded44d32b40c0cb1006065f7f003de52712b78985704f39950
# client_secret : ffabf84ed1bfe1f94097b66495d1760282053ab01e77c8c9c65de65b61f0c73a

  Plan du Scénario: Création d'une instance et utilisation dans FC Low
    Etant donné que je me connecte à l'espace partenaires
    Et que je suis sur la page liste des instances
    Et que je clique sur le lien d'ajout d'une instance
    Et que j'utilise l'instance de FS "avec entityId"
    Quand j'entre les valeurs par défaut pour mon instance
    Et j'entre "bdd creation instance bout en bout" dans le champ "name" du formulaire de création d'instance
    Et je valide le formulaire de création d'instance
    Alors je suis redirigé vers la page liste des instances
    Et la confirmation de création de l'instance est affichée
    Et je prépare une requête "authorize"
    Et je mets "<clientId>" dans le paramètre "client_id" de la requête
    Et je lance la requête
    Et le statut de la réponse est 200
    Et le corps de la réponse contient une page web
    Et je suis redirigé vers la page sélection du fournisseur d'identité

    Exemples:
    | clientId |
    | 6925fb8143c76eded44d32b40c0cb1006065f7f003de52712b78985704f39950 |

