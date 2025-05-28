#language:fr
@csmrConfig @ignore
Fonctionnalité: Csmr-Config

  Scénario: Csmr-Config - Création d'un FS - erreur
    Etant donné que j'utilise le message RabbitMQ "CONFIG_CREATE" pour "csmr-config"
    Et que j'initialise la queue RabbitMQ "config-partners"
    Et que je retire la propriété "client_secret" du message RabbitMQ
    Quand je publie le message RabbitMQ dans la queue "config-sandbox-low"
    Alors je consomme un message de la queue "config-partners"
    Et la propriété "meta.publicationStatus" est "FAILED" dans message RabbitMQ récupéré

  Plan du Scénario: Csmr-Config - Création d'un FS - succès
    Etant donné que je supprime le fournisseur de service avec le clientId "<clientId>" dans MongoDB
    Et que j'initialise la queue RabbitMQ "config-partners"
    Et que j'initialise la queue RabbitMQ "proxy"
    Et que j'utilise le message RabbitMQ "CONFIG_CREATE" pour "csmr-config"
    Et que je mets "bdd test csmr-config création" dans la propriété "name" du message RabbitMQ
    Et que je mets "<clientId>" dans la propriété "client_id" du message RabbitMQ
    Quand je publie le message RabbitMQ dans la queue "config-sandbox-low"
    Alors je récupère le fournisseur de service avec le clientId "<clientId>" dans MongoDB
    Et le nom du fournisseur de service est "bdd test csmr-config création" dans MongoDB
    Et le fournisseur de service est au bon format dans MongoDB
    Et je consomme un message de la queue "config-partners"
    Et la propriété "meta.publicationStatus" est "PUBLISHED" dans message RabbitMQ récupéré
    Et je consomme un message de la queue "proxy"
    Et la propriété "meta.spId" est "<clientId>" dans message RabbitMQ récupéré
    Et la propriété "payload.urls.0" est "<url>" dans message RabbitMQ récupéré

    Exemples:
      | clientId                                                         | url                               |
      | a0f11c8e0fe358a058b571092f902725e17c1b0f8972979ef68ebf640425af58 | https://test.fr/sector-identifier |

  Scénario: Csmr-Config - Modification d'un FS - erreur
    Etant donné que j'utilise le message RabbitMQ "CONFIG_UPDATE" pour "csmr-config"
    Et que j'initialise la queue RabbitMQ "config-partners"
    Et que je retire la propriété "client_secret" du message RabbitMQ
    Quand je publie le message RabbitMQ dans la queue "config-sandbox-low"
    Alors je consomme un message de la queue "config-partners"
    Et la propriété "meta.publicationStatus" est "FAILED" dans message RabbitMQ récupéré

  Scénario: Csmr-Config - Modification d'un FS - succès
    Etant donné que j'utilise le message RabbitMQ "CONFIG_UPDATE" pour "csmr-config"
    Et que j'initialise la queue RabbitMQ "config-partners"
    Et que j'initialise la queue RabbitMQ "proxy"
    Et que je mets "bdd test csmr-config modification" dans la propriété "name" du message RabbitMQ
    Et que je mets "<clientId>" dans la propriété "client_id" du message RabbitMQ
    Et que je mets "<url>" dans la propriété "sector_identifier_uri" du message RabbitMQ
    Quand je publie le message RabbitMQ dans la queue "config-sandbox-low"
    Alors je récupère le fournisseur de service avec le clientId "<clientId>" dans MongoDB
    Et le nom du fournisseur de service est "bdd test csmr-config modification" dans MongoDB
    Et le fournisseur de service est au bon format dans MongoDB
    Et je consomme un message de la queue "config-partners"
    Et la propriété "meta.publicationStatus" est "PUBLISHED" dans message RabbitMQ récupéré
    Et je consomme un message de la queue "proxy"
    Et la propriété "meta.spId" est "<clientId>" dans message RabbitMQ récupéré
    Et la propriété "payload.urls.0" est "<url>" dans message RabbitMQ récupéré

    Exemples:
      | clientId                                                         | url                                       |
      | a0f11c8e0fe358a058b571092f902725e17c1b0f8972979ef68ebf640425af58 | https://test.fr/updated-sector-identifier |

  Scénario: Csmr-Config - Modification d'un FS - pas de mise à jour Proxy
    Etant donné que j'utilise le message RabbitMQ "CONFIG_UPDATE" pour "csmr-config"
    Et que j'initialise la queue RabbitMQ "config-partners"
    Et que j'initialise la queue RabbitMQ "proxy"
    Et que je mets "bdd test csmr-config pas de maj proxy" dans la propriété "name" du message RabbitMQ
    Et que je mets "<clientId>" dans la propriété "client_id" du message RabbitMQ
    Et que je mets "<url>" dans la propriété "sector_identifier_uri" du message RabbitMQ
    Quand je publie le message RabbitMQ dans la queue "config-sandbox-low"
    Alors je récupère le fournisseur de service avec le clientId "<clientId>" dans MongoDB
    Et le nom du fournisseur de service est "bdd test csmr-config pas de maj proxy" dans MongoDB
    Et le fournisseur de service est au bon format dans MongoDB
    Et je consomme un message de la queue "config-partners"
    Et la propriété "meta.publicationStatus" est "PUBLISHED" dans message RabbitMQ récupéré
    Et je consomme un message de la queue "proxy"
    Et aucun message RabbitMQ n'a été récupéré

    Exemples:
      | clientId                                                         | url                                       |
      | a0f11c8e0fe358a058b571092f902725e17c1b0f8972979ef68ebf640425af58 | https://test.fr/updated-sector-identifier |
