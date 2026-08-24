#language:fr
@ci @datapass
Fonctionnalité: Datapass - Création / Modification d'un fournisseur de service
  # En tant que partenaire,
  # je veux que mon fournisseur de service soit mise à jour avec les données de Datapass
  # afin d'avoir les données de Datapass dans mon espace partenaires

  Scénario: Nouveau Datapass - Echec niveau eidas non supporté
    Etant donné que j'utilise le fournisseur de service "par défaut"
    Et que le fournisseur de service a pour niveau eidas "eidas_2"
    Quand je navigue sur la page mock Datapass
    Et je déclenche un événement "approve" Datapass pour le fournisseur de service
    Alors le statut de la réponse du webhook Datapass est "500"
    Et le corps de la réponse du webhook Datapass contient "P500004"
    Et le corps de la réponse du webhook Datapass contient "Datapass.exceptions.eidasLevelFailed"

  Scénario: Nouveau Datapass - Echec de validation du Datapass
    Etant donné que j'utilise le fournisseur de service "par défaut"
    Et que le fournisseur de service a pour nom ""
    Quand je navigue sur la page mock Datapass
    Et je déclenche un événement "approve" Datapass pour le fournisseur de service
    Alors le statut de la réponse du webhook Datapass est "500"
    Et le corps de la réponse du webhook Datapass contient "P500002"
    Et le corps de la réponse du webhook Datapass contient "Datapass.exceptions.validationFailed"

  Scénario: Nouveau Datapass - Nouveau FS avec nouvelle organisation et nouveaux comptes
    Etant donné que j'utilise le fournisseur de service "par défaut"
    Et que le fournisseur de service a un nouveau numéro de demande datapass
    Et que le fournisseur de service a un nouveau numéro d'habilitation datapass
    Et que le fournisseur de service a pour nom "Nouveau FS avec nouvelle organisation et nouveaux comptes"
    Et que le fournisseur de service a pour organisation "Nouvelle organisation" avec un nouveau siret
    Et que le fournisseur de service a pour scopes "openid,given_name,family_name,email,preferred_username"
    Et que le fournisseur de service a pour demandeur datapass "demandeur datapass"
    Et que le fournisseur de service a pour contact technique datapass "contact technique datapass"
    Quand je navigue sur la page mock Datapass
    Et je déclenche un événement "approve" Datapass pour le fournisseur de service
    Alors le statut de la réponse du webhook Datapass est "201"
    Et je suis le demandeur du datapass pour le fournisseur de service
    Et je me connecte à l'espace partenaires
    Et je navigue sur la page fournisseurs de service de l'espace partenaires
    Et je suis redirigé vers la page fournisseurs de service
    Et je clique sur le fournisseur de service créé par datapass
    Et je suis redirigé vers la page détails du fournisseur de service
    Et le fournisseur de service est à jour avec les informations Datapass
    Et les scopes Datapass suivants sont affichés:
      | Identifiant technique |
      | Prénoms               |
      | Nom de famille        |
      | Adresse électronique  |
      | Nom d'usage           |

  Scénario: Nouveau Datapass - Nouveau FS avec organisation existante et comptes existants
    Etant donné que j'utilise le fournisseur de service "par défaut"
    Et que le fournisseur de service a un nouveau numéro de demande datapass
    Et que le fournisseur de service a un nouveau numéro d'habilitation datapass
    Et que le fournisseur de service a pour nom "Nouveau FS avec organisation existante et comptes existants"
    Et que le fournisseur de service a pour organisation "DIRECTION INTERMINISTERIELLE DU NUMERIQUE" avec siret "13002526500013"
    Et que le fournisseur de service a pour scopes "openid,given_name,family_name,email"
    Et que le fournisseur de service a pour demandeur datapass "demandeur datapass"
    Et que le fournisseur de service a pour contact technique datapass "contact technique datapass"
    Quand je navigue sur la page mock Datapass
    Et je déclenche un événement "approve" Datapass pour le fournisseur de service
    Alors le statut de la réponse du webhook Datapass est "201"
    Et je suis le demandeur du datapass pour le fournisseur de service
    Et je me connecte à l'espace partenaires
    Et je navigue sur la page fournisseurs de service de l'espace partenaires
    Et je suis redirigé vers la page fournisseurs de service
    Et je clique sur le fournisseur de service créé par datapass
    Et je suis redirigé vers la page détails du fournisseur de service
    Et le fournisseur de service est à jour avec les informations Datapass
    Et les scopes Datapass suivants sont affichés:
      | Identifiant technique |
      | Prénoms               |
      | Nom de famille        |
      | Adresse électronique  |

  Scénario: Datapass Modifié - FS existant avec nouvelle organisation et comptes existants
    Etant donné que j'utilise le fournisseur de service "par défaut"
    Et que le fournisseur de service a pour nom "SP4 - Fournisseur de service par défaut modifié"
    Et que le fournisseur de service a pour scopes "openid,given_name"
    Et que le fournisseur de service a pour organisation "Nouvelle organisation pour FS existant" avec un nouveau siret
    Et que le fournisseur de service a pour demandeur datapass "demandeur datapass par défaut"
    Et que le fournisseur de service a pour contact technique datapass "contact technique datapass par défaut"
    Quand je navigue sur la page mock Datapass
    Et je déclenche un événement "approve" Datapass pour le fournisseur de service
    Alors le statut de la réponse du webhook Datapass est "201"
    Et je suis le demandeur du datapass pour le fournisseur de service
    Et je me connecte à l'espace partenaires
    Et je navigue sur la page fournisseurs de service de l'espace partenaires
    Et je suis redirigé vers la page fournisseurs de service
    Et je clique sur le fournisseur de service créé par datapass
    Et je suis redirigé vers la page détails du fournisseur de service
    Et le fournisseur de service est à jour avec les informations Datapass
    Et les scopes Datapass suivants sont affichés:
      | Identifiant technique |
      | Prénoms               |
    Et les instances du fournisseur de service sont à jour avec les informations Datapass

  Scénario: Datapass Modifié - FS existant avec organisation existante et comptes existants
    Etant donné que j'utilise le fournisseur de service "par défaut"
    Et que le fournisseur de service a pour nom "SP4 - Fournisseur de service par défaut"
    Et que le fournisseur de service a pour scopes "openid,given_name"
    Et que le fournisseur de service a pour organisation "DIRECTION INTERMINISTERIELLE DU NUMERIQUE" avec siret "13002526500013"
    Et que le fournisseur de service a pour demandeur datapass "demandeur datapass par défaut"
    Et que le fournisseur de service a pour contact technique datapass "contact technique datapass par défaut"
    Quand je navigue sur la page mock Datapass
    Et je déclenche un événement "approve" Datapass pour le fournisseur de service
    Alors le statut de la réponse du webhook Datapass est "201"
    Et je suis le demandeur du datapass pour le fournisseur de service
    Et je me connecte à l'espace partenaires
    Et je navigue sur la page fournisseurs de service de l'espace partenaires
    Et je suis redirigé vers la page fournisseurs de service
    Et je clique sur le fournisseur de service créé par datapass
    Et je suis redirigé vers la page détails du fournisseur de service
    Et le fournisseur de service est à jour avec les informations Datapass
    Et les scopes Datapass suivants sont affichés:
      | Identifiant technique |
      | Prénoms               |
    Et les instances du fournisseur de service sont à jour avec les informations Datapass

  Scénario: Datapass Modifié - FS existant avec scopes mis à jour jusqu'aux accès bac à sable
    Etant donné que j'utilise le fournisseur de service "par défaut"
    Et que le fournisseur de service a pour nom "SP4 - Fournisseur de service par défaut"
    Et que le fournisseur de service a pour scopes "openid,given_name,family_name,email,gender,birthdate,birthplace,birthcountry,preferred_username"
    Et que le fournisseur de service a pour demandeur datapass "demandeur datapass par défaut"
    Et que le fournisseur de service a pour contact technique datapass "contact technique datapass par défaut"
    Quand je navigue sur la page mock Datapass
    Et je déclenche un événement "approve" Datapass pour le fournisseur de service
    Alors le statut de la réponse du webhook Datapass est "201"
    Et je suis le demandeur du datapass pour le fournisseur de service
    Et je me connecte à l'espace partenaires
    Et je navigue sur la page fournisseurs de service de l'espace partenaires
    Et je suis redirigé vers la page fournisseurs de service
    Et je clique sur le fournisseur de service créé par datapass
    Et je suis redirigé vers la page détails du fournisseur de service
    Et le fournisseur de service est à jour avec les informations Datapass
    Et les scopes Datapass suivants sont affichés:
      | Identifiant technique |
      | Prénoms               |
      | Nom de famille        |
      | Adresse électronique  |
      | Sexe                  |
      | Date de naissance     |
      | Ville de naissance    |
      | Pays de naissance     |
      | Nom d'usage           |
    Et les instances du fournisseur de service sont à jour avec les informations Datapass
