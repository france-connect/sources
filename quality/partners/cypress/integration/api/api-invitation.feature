#language: fr
@api @invitation @ci
Fonctionnalité: API - Invitation

  Scénario: API invitation - échec pas de signature"
    Etant donné que je prépare une requête "invitation-default-user"
    Et que je retire "X-Hub-Signature-256" de l'entête de la requête
    Quand je lance la requête
    Alors le statut de la réponse est 403

  Scénario: API invitation - échec vérification signature"
    Etant donné que je prépare une requête "invitation-default-user"
    Et que je mets la valeur "sha256=5ca92657e7de96d606d6fe956cf6fe6da8e9d55deaba42247035a1f4497b404c" dans l'entête "X-Hub-Signature-256" de la requête
    Quand je lance la requête
    Alors le statut de la réponse est 403

  @ignoreInteg01
  Scénario: API invitation - succès nouvel utilisateur
    Etant donné que je prépare une requête "invitation-new-user"
    Quand je lance la requête
    Alors le statut de la réponse est 201
    Et je me connecte à l'espace partenaires avec un utilisateur "partenaire invité"
    Et je suis redirigé vers la page liste des instances
    Et la tuile de création d'instance n'est pas affichée
    Et 1 instance est affichée
    Et l'instance "Mon unique instance" est affichée

  @ignoreInteg01
  Scénario: API invitation - succès utilisateur existant
    Etant donné que je prépare une requête "invitation-default-user"
    Quand je lance la requête
    Alors le statut de la réponse est 201
    Et je me connecte à l'espace partenaires
    Et je suis redirigé vers la page liste des instances
    Et la tuile de création d'instance n'est pas affichée
    # Et 1 instance est affichée
    Et l'instance "Mon unique instance" est affichée
