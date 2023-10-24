# Librairie de gestion des libellés de COG

## Dossier _Data_

Ce dossier contient un listing complet des données INSEE sur les COG des communes et pays à afficher

## Stockage _CSV_

les données des communes et pays de l'INSEE sont stockées par des fichiers CSV. le chargement est fait au chargement de l'application.

## Configuration

les données sont injectés en configuration avec les tokens (Symbol):

- COG_CITY
- COG_COUNTRY

> De même ils sont utilisés pour associer les données à leur validation à la création du service de parsing CSV.

## Commande pour générer le fichier CSV country.csv pour le support

> docker-stack generate-insee:country [path/to/country-insee-csv]

## Commande pour générer le fichier CSV city.csv pour le support

🚨 Attention le fichier csv de la poste n'est pas au bon format. il faut le reformater en modifiant les points-virgule par des virgules avec de pouvoir l'exploiter

> docker-stack generate-insee:city [path/to/commune-insee-csv] [path/to/laposte-csv]
