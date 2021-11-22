# LemonLDA::NG

LemonLDAP::NG est un WebSSO (Single Sign On) basé sur les modules Apache::Session.

Il gère à la fois l'authentification et l'autorisation et fournit des en-têtes pour la comptabilité. Ainsi, vous pouvez bénéficier d'une protection AAA complète pour votre espace Web.

## Configuration en CLI (docker)

Une commande docker a été créée afin de pouvoir générer à la volée une configuration complète.

Vous pouvez trouver cette configuration dans le fichier `llng-conf.json`.

Pour lancer la commande docker : `docker-stack llng-configure`


## Interface de configuration

Une interface existe également afin de pouvoir modifier la configuration. Il faut se rendre à l'adresse suivante : `https://manager.llng.docker.dev-franceconnect.fr/`


### Documentation 2.0

Si vous avez des questions, veuillez vous référer à la documentation : `https://lemonldap-ng.org/documentation/2.0/`
