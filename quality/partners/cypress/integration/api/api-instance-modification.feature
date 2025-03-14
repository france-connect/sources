#language: fr
@api @apiInstanceModification
Fonctionnalité: API - instance modification

  Scénario: API instance modification - création succès
    Etant donné que je me connecte à l'espace partenaires
    Et que je prépare une requête "instance-modification"
    Quand je lance la requête avec le csrf-token
    Alors le statut de la réponse est 200
    Et l'entête de la réponse a une propriété "content-type" contenant "application/json"
    Et le corps de la réponse a 2 propriétés
    Et le corps de la réponse a une propriété "type" égale à "INSTANCE"
    Et le corps de la réponse a une propriété "payload" avec 0 attribut

  Scénario: API instance modification - erreur instance inexistante
    Etant donné que je me connecte à l'espace partenaires
    Et que je prépare une requête "instance-modification"
    Et que je mets le chemin "/api/instances/aaaaaaaa-aaaa-4aaa-aaaa-aaaaaaaaaaaa" dans l'url de la requête
    Quand je lance la requête avec le csrf-token
    Alors le statut de la réponse est 403
    Et l'entête de la réponse a une propriété "content-type" contenant "application/json"
    Et le corps de la réponse a 3 propriétés
    Et le corps de la réponse a une propriété "code" égale à "P000000"
    Et le corps de la réponse a une propriété "id"
    Et le corps de la réponse a une propriété "message" égale à "exceptions.default_message"

  Scénario: API instance modification - erreur instance sans droit de modification
    Etant donné que je me connecte à l'espace partenaires
    Et que je prépare une requête "instance-modification"
    Et que je mets le chemin "/api/instances/50b70101-0e1f-419a-9365-81754c2de689" dans l'url de la requête
    Quand je lance la requête avec le csrf-token
    Alors le statut de la réponse est 403
    Et l'entête de la réponse a une propriété "content-type" contenant "application/json"
    Et le corps de la réponse a 3 propriétés
    Et le corps de la réponse a une propriété "code" égale à "P000000"
    Et le corps de la réponse a une propriété "id"
    Et le corps de la réponse a une propriété "message" égale à "exceptions.default_message"

  Scénario: API instance modification - erreur csrf-token manquant
    Etant donné que je me connecte à l'espace partenaires
    Et que je prépare une requête "instance-modification"
    Et je retire "x-csrf-token" de l'entête de la requête
    Quand je lance la requête
    Alors le statut de la réponse est 400
    Et l'entête de la réponse a une propriété "content-type" contenant "application/json"
    Et le corps de la réponse a 3 propriétés
    Et le corps de la réponse a une propriété "code" égale à "P470002"
    Et le corps de la réponse a une propriété "id"
    Et le corps de la réponse a une propriété "message" égale à "Csrf.exceptions.csrfMissingToken"

  Scénario: API instance modification - erreur csrf-token non valide
    Etant donné que je me connecte à l'espace partenaires
    Et que je prépare une requête "instance-modification"
    Quand je lance la requête
    Alors le statut de la réponse est 401
    Et l'entête de la réponse a une propriété "content-type" contenant "application/json"
    Et le corps de la réponse a 3 propriétés
    Et le corps de la réponse a une propriété "code" égale à "P470001"
    Et le corps de la réponse a une propriété "id"
    Et le corps de la réponse a une propriété "message" égale à "Csrf.exceptions.csrfBadToken"

  Scénario: API instance modification - erreur csrf-token déjà utilisé
    Etant donné que je me connecte à l'espace partenaires
    Et que je prépare une requête "instance-modification"
    Et que je lance la requête avec le csrf-token
    Et que le statut de la réponse est 200
    Quand je lance la requête
    Alors le statut de la réponse est 401
    Et l'entête de la réponse a une propriété "content-type" contenant "application/json"
    Et le corps de la réponse a 3 propriétés
    Et le corps de la réponse a une propriété "code" égale à "P470004"
    Et le corps de la réponse a une propriété "id"
    Et le corps de la réponse a une propriété "message" égale à "Csrf.exceptions.csrfConsumedSessionToken"

  Scénario: API instance modification - erreur champ obligatoire manquant
    Etant donné que je me connecte à l'espace partenaires
    Et que je prépare une requête "instance-modification"
    Et je retire "name" du corps de la requête
    Quand je lance la requête avec le csrf-token
    Alors le statut de la réponse est 422
    Et l'entête de la réponse a une propriété "content-type" contenant "application/json"
    Et le corps de la réponse a 4 propriétés
    Et le corps de la réponse a une propriété "code" égale à "P480003"
    Et le corps de la réponse a une propriété "id"
    Et le corps de la réponse a une propriété "message" égale à "Dto2form.exceptions.dto2formValidationError"
    Et le corps de la réponse a une propriété "payload" avec 1 attribut
    Et le corps de la réponse a une propriété "payload.name" avec 1 élément
    Et le corps de la réponse a une propriété "payload.name[0]" égale à "Veuillez saisir le nom de votre instance"

  Scénario: API instance modification - erreur champ non valide
    Etant donné que je me connecte à l'espace partenaires
    Et que je prépare une requête "instance-modification"
    Et je mets "abcdef" dans la propriété "signupId" du corps de la requête
    Quand je lance la requête avec le csrf-token
    Alors le statut de la réponse est 422
    Et l'entête de la réponse a une propriété "content-type" contenant "application/json"
    Et le corps de la réponse a 4 propriétés
    Et le corps de la réponse a une propriété "code" égale à "P480003"
    Et le corps de la réponse a une propriété "id"
    Et le corps de la réponse a une propriété "message" égale à "Dto2form.exceptions.dto2formValidationError"
    Et le corps de la réponse a une propriété "payload" avec 1 attribut
    Et le corps de la réponse a une propriété "payload.signupId" avec 1 élément
    Et le corps de la réponse a une propriété "payload.signupId[0]" égale à "Veuillez saisir un numéro valide"

  Scénario: API instance modification - plusieurs erreurs sur différentes propriétés
    Etant donné que je me connecte à l'espace partenaires
    Et que je prépare une requête "instance-modification"
    Et je retire "name" du corps de la requête
    Et je mets "abcdef" dans la propriété "signupId" du corps de la requête
    Et je mets "abcdef" dans la propriété "site[]" du corps de la requête
    Quand je lance la requête avec le csrf-token
    Alors le statut de la réponse est 422
    Et l'entête de la réponse a une propriété "content-type" contenant "application/json"
    Et le corps de la réponse a 4 propriétés
    Et le corps de la réponse a une propriété "code" égale à "P480003"
    Et le corps de la réponse a une propriété "id"
    Et le corps de la réponse a une propriété "message" égale à "Dto2form.exceptions.dto2formValidationError"
    Et le corps de la réponse a une propriété "payload" avec 3 attributs
    Et le corps de la réponse a une propriété "payload.name" avec 1 élément
    Et le corps de la réponse a une propriété "payload.name[0]" égale à "Veuillez saisir le nom de votre instance"
    Et le corps de la réponse a une propriété "payload.signupId" avec 1 élément
    Et le corps de la réponse a une propriété "payload.signupId[0]" égale à "Veuillez saisir un numéro valide"
    Et le corps de la réponse a une propriété "payload.site" avec 1 élément
    Et le corps de la réponse a une propriété "payload.site[0]" avec 1 élément
    Et le corps de la réponse a une propriété "payload.site[0][0]" égale à "Veuillez saisir une url valide"

  Scénario: API instance modification - plusieurs erreurs sur une propriété
    Etant donné que je me connecte à l'espace partenaires
    Et que je prépare une requête "instance-modification"
    Et je mets "abcdefghij" dans la propriété "signupId" du corps de la requête
    Quand je lance la requête avec le csrf-token
    Alors le statut de la réponse est 422
    Et l'entête de la réponse a une propriété "content-type" contenant "application/json"
    Et le corps de la réponse a 4 propriétés
    Et le corps de la réponse a une propriété "code" égale à "P480003"
    Et le corps de la réponse a une propriété "id"
    Et le corps de la réponse a une propriété "message" égale à "Dto2form.exceptions.dto2formValidationError"
    Et le corps de la réponse a une propriété "payload" avec 1 attribut
    Et le corps de la réponse a une propriété "payload.signupId" avec 2 éléments
    Et le corps de la réponse a une propriété "payload.signupId[0]" égale à "Le numéro de la demande datapass doit être de 7 caractères maximum"
    Et le corps de la réponse a une propriété "payload.signupId[1]" égale à "Veuillez saisir un numéro valide"
