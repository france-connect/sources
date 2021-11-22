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
