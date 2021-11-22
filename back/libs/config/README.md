# Config

Ce module définit le moteur de configuration de toutes les apps.

### Configuration des paramètres Config

Le service Config nécessite un jeu de données et un schéma validateur.

### Principe de base

- la configuration est dîte parfaite. Pas de valeur par défaut dans la configuration. Si une donnée est manquante ou invalide, ce module tuera l'application pour protéger les utilisateurs.
- Ce module doit être le plus abstrait et indépendant possible. Ne pas ajouter de fonctionnalités propres à une app ou instance. Dans ce dernier cas, faire une autre bibliothèque pour gérer cela.
