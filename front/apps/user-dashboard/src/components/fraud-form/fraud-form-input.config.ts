import { mustBeEmail, mustBeFilled, mustBePhone, mustBeUUIDv4 } from '../../validators';

export const inputEmailConfig = {
  description: 'Format attendu : nom@domaine.fr',
  label: 'Adresse électronique',
  name: 'contactEmail',
  validators: [mustBeFilled('Veuillez saisir une adresse électronique'), mustBeEmail()],
};

export const inputAuthenticationEventIdConfig = {
  description: 'Le code est indiqué dans l’alerte de connexion reçue par mail',
  info: 'Ce code permet à nos équipes d’identifier facilement la connexion frauduleuse',
  label: 'Code d’identification',
  name: 'authenticationEventId',
  validators: [mustBeFilled('Veuillez renseigner le code d’identification'), mustBeUUIDv4()],
};

export const inputPhoneConfig = {
  description: 'Format attendu : (+33) X XX XX XX XX ou 0X XX XX XX XX',
  label: 'Numéro de téléphone',
  name: 'phoneNumber',
  required: false,
  type: 'tel',
  validators: [mustBePhone()],
};

export const inputTextAreaDescriptionConfig = {
  label: 'Description du problème rencontré',
  maxLength: 1500,
  name: 'comment',
  rows: 4,
};
