#language:fr
@ci @datapass
Fonctionnalité: Datapass - Création / Modification des contacts liés à un fournisseur de service
  # En tant que partenaire,
  # je veux que les contacts de mon fournisseur de service soit mise à jour avec les données de Datapass
  # afin de contrôler les accès à mon fournisseur de service dans Espace Partenaires

  #TA01 - Validation initiale d’une habilitation
  Scénario: Nouveau Datapass - avec nouveaux contacts jamais connectés
    Etant donné que j'utilise le fournisseur de service "pour la modification des contacts"
    Et que l'utilisateur "demandeur datapass" a une nouvelle adresse email
    Et que l'utilisateur "demandeur datapass" a un nouveau prénom
    Et que l'utilisateur "demandeur datapass" a un nouveau nom d'usage
    Et que l'utilisateur "demandeur datapass" a un nouveau numéro de téléphone
    Et que l'utilisateur "contact technique datapass" a une nouvelle adresse email
    Et que l'utilisateur "contact technique datapass" a un nouveau prénom
    Et que l'utilisateur "contact technique datapass" a un nouveau nom d'usage
    Et que l'utilisateur "contact technique datapass" a un nouveau numéro de téléphone
    Et que le fournisseur de service a un nouveau numéro d'habilitation datapass
    Et que le fournisseur de service a pour nom "Nouveau Datapass - avec nouveaux contacts jamais connectés"
    Et que le fournisseur de service a pour demandeur datapass "demandeur datapass"
    Et que le fournisseur de service a pour contact technique datapass "contact technique datapass"
    Quand je navigue sur la page mock Datapass
    Et je déclenche un événement "approve" Datapass pour le fournisseur de service
    Alors le statut de la réponse du webhook Datapass est "201"
    Et je mémorise l'identifiant du fournisseur de service de la réponse du webhook Datapass
    Et je suis le demandeur du datapass pour le fournisseur de service
    Et je me connecte à l'espace partenaires avec une identité personnalisée
    Et les permissions du fournisseur de service sont à jour avec les informations Datapass
    Et le compte du demandeur est à jour avec les informations Datapass
    Et le compte du contact technique est à jour avec les informations Datapass

  #TA02 - Changement du responsable technique
  Scénario: Modification Datapass - avec nouveau contact technique jamais connecté
    Etant donné que j'utilise le fournisseur de service "pour la modification des contacts"
    Et que je navigue sur la page mock Datapass
    Et que je déclenche un événement "approve" Datapass pour le fournisseur de service
    Et que le statut de la réponse du webhook Datapass est "201"
    Et que l'utilisateur "contact technique datapass" a une nouvelle adresse email
    Et que l'utilisateur "contact technique datapass" a un nouveau prénom
    Et que l'utilisateur "contact technique datapass" a un nouveau nom d'usage
    Et que l'utilisateur "contact technique datapass" a un nouveau numéro de téléphone
    Et que le fournisseur de service a un nouveau numéro d'habilitation datapass
    Et que le fournisseur de service a pour nom "Modification Datapass - avec nouveau contact technique jamais connecté"
    Et que le fournisseur de service a pour demandeur datapass "demandeur datapass"
    Et que le fournisseur de service a pour contact technique datapass "contact technique datapass"
    Quand je navigue sur la page mock Datapass
    Et je déclenche un événement "approve" Datapass pour le fournisseur de service
    Alors le statut de la réponse du webhook Datapass est "201"
    Et je mémorise l'identifiant du fournisseur de service de la réponse du webhook Datapass
    Et je suis le demandeur du datapass pour le fournisseur de service
    Et je me connecte à l'espace partenaires avec une identité personnalisée
    Et les permissions du fournisseur de service sont à jour avec les informations Datapass
    Et le compte du demandeur est à jour avec les informations Datapass
    Et le compte du contact technique est à jour avec les informations Datapass

  #TA03 - Changement du demandeur
  Scénario: Modification Datapass - avec nouveau demandeur jamais connecté
    Etant donné que j'utilise le fournisseur de service "pour la modification des contacts"
    Et que je navigue sur la page mock Datapass
    Et que je déclenche un événement "approve" Datapass pour le fournisseur de service
    Et que le statut de la réponse du webhook Datapass est "201"
    Et que l'utilisateur "demandeur datapass" a une nouvelle adresse email
    Et que l'utilisateur "demandeur datapass" a un nouveau prénom
    Et que l'utilisateur "demandeur datapass" a un nouveau nom d'usage
    Et que l'utilisateur "demandeur datapass" a un nouveau numéro de téléphone
    Et que le fournisseur de service a pour nom "Modification Datapass - avec nouveau demandeur jamais connecté"
    Et que le fournisseur de service a pour demandeur datapass "demandeur datapass"
    Et que le fournisseur de service a pour contact technique datapass "contact technique datapass"
    Quand je navigue sur la page mock Datapass
    Et je déclenche un événement "approve" Datapass pour le fournisseur de service
    Alors le statut de la réponse du webhook Datapass est "201"
    Et je mémorise l'identifiant du fournisseur de service de la réponse du webhook Datapass
    Et je suis le contact technique du datapass pour le fournisseur de service
    Et je me connecte à l'espace partenaires avec une identité personnalisée
    Et les permissions du fournisseur de service sont à jour avec les informations Datapass
    Et le compte du demandeur est à jour avec les informations Datapass
    Et le compte du contact technique est à jour avec les informations Datapass

  #TA04 - Changement du demandeur mais qui reste responsable technique
  # même personne demandeur et contact technique mais nouveau demandeur
  Scénario: Modification Datapass - demandeur reste contact technique seulement
    Etant donné que j'utilise le fournisseur de service "pour la modification des contacts"
    Et que le fournisseur de service a pour demandeur datapass "contact datapass 1"
    Et que le fournisseur de service a pour contact technique datapass "contact datapass 1"
    Et que je navigue sur la page mock Datapass
    Et que je déclenche un événement "approve" Datapass pour le fournisseur de service
    Et que le statut de la réponse du webhook Datapass est "201"
    Et que l'utilisateur "contact datapass 2" a une nouvelle adresse email
    Et que l'utilisateur "contact datapass 2" a un nouveau prénom
    Et que l'utilisateur "contact datapass 2" a un nouveau nom d'usage
    Et que l'utilisateur "contact datapass 2" a un nouveau numéro de téléphone
    Et que le fournisseur de service a pour nom "Modification Datapass - demandeur reste contact technique seulement"
    Et que le fournisseur de service a pour demandeur datapass "contact datapass 2"
    Et que le fournisseur de service a pour contact technique datapass "contact datapass 1"
    Quand je navigue sur la page mock Datapass
    Et je déclenche un événement "approve" Datapass pour le fournisseur de service
    Alors le statut de la réponse du webhook Datapass est "201"
    Et je mémorise l'identifiant du fournisseur de service de la réponse du webhook Datapass
    Et je suis le contact technique du datapass pour le fournisseur de service
    Et je me connecte à l'espace partenaires avec une identité personnalisée
    Et les permissions du fournisseur de service sont à jour avec les informations Datapass
    Et le compte du demandeur est à jour avec les informations Datapass
    Et le compte du contact technique est à jour avec les informations Datapass

  #TA05 - Changement du responsable technique mais qui reste demandeur
  # même personne demandeur et contact technique mais nouveau contact technique
  Scénario: Modification Datapass - demandeur n'est plus contact technique
    Etant donné que j'utilise le fournisseur de service "pour la modification des contacts"
    Et que le fournisseur de service a pour demandeur datapass "contact datapass 1"
    Et que le fournisseur de service a pour contact technique datapass "contact datapass 1"
    Et que je navigue sur la page mock Datapass
    Et que je déclenche un événement "approve" Datapass pour le fournisseur de service
    Et que le statut de la réponse du webhook Datapass est "201"
    Et que l'utilisateur "contact datapass 2" a une nouvelle adresse email
    Et que l'utilisateur "contact datapass 2" a un nouveau prénom
    Et que l'utilisateur "contact datapass 2" a un nouveau nom d'usage
    Et que l'utilisateur "contact datapass 2" a un nouveau numéro de téléphone
    Et que le fournisseur de service a pour nom "Modification Datapass - demandeur n'est plus contact technique"
    Et que le fournisseur de service a pour demandeur datapass "contact datapass 1"
    Et que le fournisseur de service a pour contact technique datapass "contact datapass 2"
    Quand je navigue sur la page mock Datapass
    Et je déclenche un événement "approve" Datapass pour le fournisseur de service
    Alors le statut de la réponse du webhook Datapass est "201"
    Et je mémorise l'identifiant du fournisseur de service de la réponse du webhook Datapass
    Et je suis le demandeur du datapass pour le fournisseur de service
    Et je me connecte à l'espace partenaires avec une identité personnalisée
    Et les permissions du fournisseur de service sont à jour avec les informations Datapass
    Et le compte du demandeur est à jour avec les informations Datapass
    Et le compte du contact technique est à jour avec les informations Datapass

  #TA06 - Changement du nom et prénom et téléphone du demandeur (email inchangé)
  Scénario: Modification Datapass - changement des informations du demandeur (jamais connecté auparavant)
    Etant donné que j'utilise le fournisseur de service "pour la modification des contacts"
    Et que l'utilisateur "demandeur datapass" a une nouvelle adresse email
    Et que je navigue sur la page mock Datapass
    Et que je déclenche un événement "approve" Datapass pour le fournisseur de service
    Et que le statut de la réponse du webhook Datapass est "201"
    Et que l'utilisateur "demandeur datapass" a un nouveau prénom
    Et que l'utilisateur "demandeur datapass" a un nouveau nom d'usage
    Et que l'utilisateur "demandeur datapass" a un nouveau numéro de téléphone
    Et que le fournisseur de service a pour nom "Modification Datapass - changement des informations du demandeur (jamais connecté)"
    Quand je navigue sur la page mock Datapass
    Et je déclenche un événement "approve" Datapass pour le fournisseur de service
    Alors le statut de la réponse du webhook Datapass est "201"
    Et je mémorise l'identifiant du fournisseur de service de la réponse du webhook Datapass
    Et je suis le contact technique du datapass pour le fournisseur de service
    Et je me connecte à l'espace partenaires avec une identité personnalisée
    Et les permissions du fournisseur de service sont à jour avec les informations Datapass
    Et le compte du demandeur est à jour avec les informations Datapass
    Et le compte du contact technique est à jour avec les informations Datapass

  #TA07 - Changement du nom et prénom et téléphone du responsable technique (email inchangé)
  Scénario: Modification Datapass - changement des informations du contact technique (jamais connecté auparavant)
    Etant donné que j'utilise le fournisseur de service "pour la modification des contacts"
    Et que l'utilisateur "contact technique datapass" a une nouvelle adresse email
    Et que je navigue sur la page mock Datapass
    Et que je déclenche un événement "approve" Datapass pour le fournisseur de service
    Et que le statut de la réponse du webhook Datapass est "201"
    Et que l'utilisateur "contact technique datapass" a un nouveau prénom
    Et que l'utilisateur "contact technique datapass" a un nouveau nom d'usage
    Et que l'utilisateur "contact technique datapass" a un nouveau numéro de téléphone
    Et que le fournisseur de service a pour nom "Modification Datapass - changement des informations du contact technique (jamais connecté)"
    Quand je navigue sur la page mock Datapass
    Et je déclenche un événement "approve" Datapass pour le fournisseur de service
    Alors le statut de la réponse du webhook Datapass est "201"
    Et je mémorise l'identifiant du fournisseur de service de la réponse du webhook Datapass
    Et je suis le demandeur du datapass pour le fournisseur de service
    Et je me connecte à l'espace partenaires avec une identité personnalisée
    Et les permissions du fournisseur de service sont à jour avec les informations Datapass
    Et le compte du demandeur est à jour avec les informations Datapass
    Et le compte du contact technique est à jour avec les informations Datapass

  #TA08 - Changement du nom et prénom et téléphone du demandeur déja connecté
  # seulement numéro de téléphone mis à jour
  Scénario: Modification Datapass - changement des informations du demandeur (déjà connecté auparavant)
    Etant donné que j'utilise le fournisseur de service "pour la modification des contacts"
    Et que je navigue sur la page mock Datapass
    Et que je déclenche un événement "approve" Datapass pour le fournisseur de service
    Et que le statut de la réponse du webhook Datapass est "201"
    Et que je suis le demandeur du datapass pour le fournisseur de service
    Et que je me connecte à l'espace partenaires avec une identité personnalisée
    Et que je suis connecté à l'espace partenaires
    Et que je me déconnecte de l'espace partenaires
    Et que l'utilisateur "demandeur datapass" a un nouveau prénom
    Et que l'utilisateur "demandeur datapass" a un nouveau nom d'usage
    Et que l'utilisateur "demandeur datapass" a un nouveau numéro de téléphone
    Et que le fournisseur de service a pour nom "Modification Datapass - changement des informations du demandeur (déjà connecté)"
    Quand je navigue sur la page mock Datapass
    Et je déclenche un événement "approve" Datapass pour le fournisseur de service
    Alors le statut de la réponse du webhook Datapass est "201"
    Et je mémorise l'identifiant du fournisseur de service de la réponse du webhook Datapass
    Et je suis le contact technique du datapass pour le fournisseur de service
    Et je me connecte à l'espace partenaires avec une identité personnalisée
    Et les permissions du fournisseur de service sont à jour avec les informations Datapass
    Et seul le numéro de téléphone du demandeur a été mis à jour avec les informations Datapass
    Et le compte du contact technique est à jour avec les informations Datapass

  #TA09 - Changement du nom et prénom et téléphone du responsable technique déja connecté
  # seulement numéro de téléphone mis à jour
  Scénario: Modification Datapass - changement des informations du contact technique (déjà connecté auparavant)
    Etant donné que j'utilise le fournisseur de service "pour la modification des contacts"
    Et que je navigue sur la page mock Datapass
    Et que je déclenche un événement "approve" Datapass pour le fournisseur de service
    Et que le statut de la réponse du webhook Datapass est "201"
    Et que je suis le contact technique du datapass pour le fournisseur de service
    Et que je me connecte à l'espace partenaires avec une identité personnalisée
    Et que je suis connecté à l'espace partenaires
    Et que je me déconnecte de l'espace partenaires
    Et que l'utilisateur "contact technique datapass" a un nouveau prénom
    Et que l'utilisateur "contact technique datapass" a un nouveau nom d'usage
    Et que l'utilisateur "contact technique datapass" a un nouveau numéro de téléphone
    Et que le fournisseur de service a pour nom "Modification Datapass - changement des informations du contact technique (déjà connecté)"
    Quand je navigue sur la page mock Datapass
    Et je déclenche un événement "approve" Datapass pour le fournisseur de service
    Alors le statut de la réponse du webhook Datapass est "201"
    Et je mémorise l'identifiant du fournisseur de service de la réponse du webhook Datapass
    Et je suis le demandeur du datapass pour le fournisseur de service
    Et je me connecte à l'espace partenaires avec une identité personnalisée
    Et les permissions du fournisseur de service sont à jour avec les informations Datapass
    Et le compte du demandeur est à jour avec les informations Datapass
    Et seul le numéro de téléphone du contact technique a été mis à jour avec les informations Datapass

  Scénario: Contact existant - téléphone du contact technique quand demandeur a la même adresse e-mail
    Etant donné que j'utilise le fournisseur de service "pour la modification des contacts"
    Et que l'utilisateur "contact technique datapass" a la même adresse email que l'utilisateur "demandeur datapass" 
    Et que l'utilisateur "contact technique datapass" a un nouveau prénom
    Et que l'utilisateur "contact technique datapass" a un nouveau nom d'usage
    Et que l'utilisateur "contact technique datapass" a un nouveau numéro de téléphone
    Et que le fournisseur de service a pour nom "Modification Datapass - changement des informations du contact technique (déjà connecté)"
    Quand je navigue sur la page mock Datapass
    Et je déclenche un événement "approve" Datapass pour le fournisseur de service
    Alors le statut de la réponse du webhook Datapass est "201"
    Et je mémorise l'identifiant du fournisseur de service de la réponse du webhook Datapass
    Et je suis le demandeur du datapass pour le fournisseur de service
    Et je me connecte à l'espace partenaires avec une identité personnalisée
    Et les permissions du fournisseur de service sont à jour avec les informations Datapass
    Et seul le numéro de téléphone du contact technique a été mis à jour avec les informations Datapass

  Scénario: Nouveau Contact - téléphone du contact technique quand demandeur a la même adresse e-mail
    Etant donné que j'utilise le fournisseur de service "pour la modification des contacts"
    Et que l'utilisateur "demandeur datapass" a une nouvelle adresse email
    Et que l'utilisateur "contact technique datapass" a la même adresse email que l'utilisateur "demandeur datapass" 
    Et que l'utilisateur "contact technique datapass" a un nouveau prénom
    Et que l'utilisateur "contact technique datapass" a un nouveau nom d'usage
    Et que l'utilisateur "contact technique datapass" a un nouveau numéro de téléphone
    Et que le fournisseur de service a un nouveau numéro de demande datapass
    Et que le fournisseur de service a un nouveau numéro d'habilitation datapass
    Et que le fournisseur de service a pour nom "Modification Datapass - changement des informations du contact technique (déjà connecté)"
    Quand je navigue sur la page mock Datapass
    Et je déclenche un événement "approve" Datapass pour le fournisseur de service
    Alors le statut de la réponse du webhook Datapass est "201"
    Et je mémorise l'identifiant du fournisseur de service de la réponse du webhook Datapass
    Et je suis le demandeur du datapass pour le fournisseur de service
    Et je me connecte à l'espace partenaires avec une identité personnalisée
    Et les permissions du fournisseur de service sont à jour avec les informations Datapass
    Et seul le numéro de téléphone du contact technique a été mis à jour avec les informations Datapass

  Scénario: Modification Datapass - ne pas effacer le numéro de téléphone si le demandeur n'en a pas
    Etant donné que j'utilise le fournisseur de service "pour la modification des contacts"
    Et que l'utilisateur "demandeur datapass" a le numéro de téléphone "+33622222222"
    Et que je navigue sur la page mock Datapass
    Et que je déclenche un événement "approve" Datapass pour le fournisseur de service
    Et que le statut de la réponse du webhook Datapass est "201"
    Et que l'utilisateur "demandeur datapass" n'a pas de numéro de téléphone
    Quand je navigue sur la page mock Datapass
    Et je déclenche un événement "approve" Datapass pour le fournisseur de service
    Alors le statut de la réponse du webhook Datapass est "201"
    Et je mémorise l'identifiant du fournisseur de service de la réponse du webhook Datapass
    Et je suis le contact technique du datapass pour le fournisseur de service
    Et je me connecte à l'espace partenaires avec une identité personnalisée
    Et le compte du demandeur a le numéro de téléphone "+33622222222"