#language:fr
@nexus @api @ci @ignoreInteg01
Fonctionnalité: API - Nexus

  Scénario: API nexus - statut OK
    Quand j'appelle l'API de Nexus
    Alors le statut de la réponse est 200
    Et le corps de la réponse a une propriété "status" égale à "OK"
