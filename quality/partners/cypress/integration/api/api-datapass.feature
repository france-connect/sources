#language: fr
@api @datapass @ci
Fonctionnalité: API - Datapass

  Scénario: API datapass - échec pas de signature"
    Etant donné que je prépare une requête "datapass"
    Et que je retire "X-Hub-Signature-256" de l'entête de la requête
    Quand je lance la requête
    Alors le statut de la réponse est 403

  Scénario: API datapass - échec vérification signature"
    Etant donné que je prépare une requête "datapass"
    Et que je mets la valeur "sha256=5ca92657e7de96d606d6fe956cf6fe6da8e9d55deaba42247035a1f4497b404c" dans l'entête "X-Hub-Signature-256" de la requête
    Quand je lance la requête
    Alors le statut de la réponse est 403

  # Test ignoré car l'intégration avec Datapass n'est pas encore effective
  # En attente de la finalisation des migrations PostgreSQL
  # - https://gitlab.dev-franceconnect.fr/france-connect/fc/-/issues/2463
  # En attente des logs techniques pour récupérer un payload Datapass
  # - https://gitlab.dev-franceconnect.fr/france-connect/fc/-/issues/2469
  @ignoreInteg01
  Scénario: API datapass - succès vérification signature
    Etant donné que je prépare une requête "datapass"
    Quand je lance la requête
    Alors le statut de la réponse est 201
    Et le corps de la réponse a une propriété "token_id"
