/**
 * Translations of DataPass scopes for FranceConnect
 *
 * These translations match the labels defined in the DataPass configuration:
 * @see https://github.com/etalab/data_pass/blob/develop/config/authorization_definitions/france_connect.yml
 *
 * Exception: `family_name` uses the official civil status wording ("Nom de famille"),
 */
export const datapassExceptionsFrFR = {
  'Datapass.exceptions.apiHttpFailed':
    "Échec de la requête HTTP vers l'API Datapass",
  'Datapass.exceptions.apiResponseValidationFailed':
    "La réponse de l'API Datapass ne contient pas les champs requis",
  'Datapass.exceptions.paginationLimitExceeded':
    "Le nombre maximal d'itérations de pagination de l'API Datapass a été dépassé, possible boucle API",
};

export const datapassScopesFrFR = {
  'datapassScope.family_name': 'Nom de famille',
  'datapassScope.given_name': 'Prénoms',
  'datapassScope.birthdate': 'Date de naissance',
  'datapassScope.birthplace': 'Ville de naissance',
  'datapassScope.birthcountry': 'Pays de naissance',
  'datapassScope.gender': 'Sexe',
  'datapassScope.preferred_username': "Nom d'usage",
  'datapassScope.email': 'Adresse électronique',
  'datapassScope.openid': 'Identifiant technique',
};
