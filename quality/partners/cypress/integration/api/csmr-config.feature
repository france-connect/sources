#language:fr
@csmrConfig @ignore
Fonctionnalité: Csmr-Config

  Scénario: Csmr-Config - Création d'un FS - erreur
    Etant donné que j'utilise le message RabbitMQ "CONFIG_CREATE" pour "csmr-config"
    Et que je retire la propriété "client_secret" du message RabbitMQ
    Quand je publie le message RabbitMQ dans la queue "config-sandbox-low"
    Alors je consomme un message de la queue "config-partners"
    Et la propriété "meta.publicationStatus" est "FAILED" dans message RabbitMQ récupéré

  Plan du Scénario: Csmr-Config - Création d'un FS - succès
    Etant donné que je supprime le fournisseur de service avec le clientId "<clientId>" dans MongoDB
    Et que j'utilise le message RabbitMQ "CONFIG_CREATE" pour "csmr-config"
    Et que je mets "bdd test csmr-config création" dans la propriété "name" du message RabbitMQ
    Et que je mets "<clientId>" dans la propriété "key" du message RabbitMQ
    Quand je publie le message RabbitMQ dans la queue "config-sandbox-low"
    Alors je récupère le fournisseur de service avec le clientId "<clientId>" dans MongoDB
    Et le nom du fournisseur de service est "bdd test csmr-config création" dans MongoDB
    Et le fournisseur de service est au bon format dans MongoDB
    Et je consomme un message de la queue "config-partners"
    Et la propriété "meta.publicationStatus" est "PUBLISHED" dans message RabbitMQ récupéré

    Exemples:
      | clientId                                                         |
      | a0f11c8e0fe358a058b571092f902725e17c1b0f8972979ef68ebf640425af58 |

  Scénario: Csmr-Config - Modification d'un FS - erreur
    Etant donné que j'utilise le message RabbitMQ "CONFIG_UPDATE" pour "csmr-config"
    Et que je retire la propriété "client_secret" du message RabbitMQ
    Quand je publie le message RabbitMQ dans la queue "config-sandbox-low"
    Alors je consomme un message de la queue "config-partners"
    Et la propriété "meta.publicationStatus" est "FAILED" dans message RabbitMQ récupéré

  Scénario: Csmr-Config - Modification d'un FS - succès
    Etant donné que j'utilise le message RabbitMQ "CONFIG_UPDATE" pour "csmr-config"
    Et que je mets "bdd test csmr-config modification" dans la propriété "name" du message RabbitMQ
    Et que je mets "<clientId>" dans la propriété "key" du message RabbitMQ
    Quand je publie le message RabbitMQ dans la queue "config-sandbox-low"
    Alors je récupère le fournisseur de service avec le clientId "<clientId>" dans MongoDB
    Et le nom du fournisseur de service est "bdd test csmr-config modification" dans MongoDB
    Et le fournisseur de service est au bon format dans MongoDB
    Et je consomme un message de la queue "config-partners"
    Et la propriété "meta.publicationStatus" est "PUBLISHED" dans message RabbitMQ récupéré

    Exemples:
      | clientId                                                         |
      | a0f11c8e0fe358a058b571092f902725e17c1b0f8972979ef68ebf640425af58 |
