export const frFR = {
  // Fraud Description Form
  'Form.label.description': 'Décrivez votre cas d’usurpation en quelques mots',
  'Form.hint.description':
    'Veuillez fournir les informations suivantes : date et lieu de la connexion frauduleuse, compte et démarche concernés.',

  'Form.isFilled_error.description':
    'Veuillez renseigner l’information demandée. Seuls les lettres et chiffres sont autorisés.',
  'Form.isString_error.description':
    'Veuillez renseigner l’information demandée. Seuls les lettres et chiffres sont autorisés.',

  // Fraud Connection Form
  'Form.label.code': 'Le code associé à la connexion frauduleuse',
  'Form.hint.code':
    'Vous trouverez le code dans l’alerte que vous avec reçu par email',
  'Form.isFilled_error.code':
    'Le code renseigné n’est pas valide.\nAssurez-vous de renseigner celui qui correspond à la connexion frauduleuse.',
  'Form.isUUID_error.code':
    'Le code renseigné n’est pas valide.\nAssurez-vous de renseigner celui qui correspond à la connexion frauduleuse.',
  'Form.isNotEmpty_error.code':
    'Le code renseigné n’est pas valide.\nAssurez-vous de renseigner celui qui correspond à la connexion frauduleuse.',
  'Form.isWrong_error.code':
    'Aucune connexion ne correspond au code renseigné.\nAssurez-vous de renseigner celui qui correspond à la connexion frauduleuse. La date de la connexion ne doit pas remonter à plus de six mois.',

  // Fraud Identity Form
  'Form.label.family_name': 'Nom complet de naissance',
  'Form.hint.family_name':
    'Comme inscrit sur l’acte de naissance \nEcrivez l’ensemble du nom si celui-ci est composé de plusieurs noms',
  'Form.isNotEmpty_error.family_name':
    "Veuillez renseigner l'information demandée.",
  'Form.isFilled_error.family_name':
    "Veuillez renseigner l'information demandée.",

  'Form.label.given_name': 'Prénoms de naissance',
  'Form.hint.given_name':
    'Comme inscrit sur l’acte de naissance \nEcrivez l’ensemble du prénom si celui-ci est composé de plusieurs prénoms',
  'Form.isNotEmpty_error.given_name':
    "Veuillez renseigner l'information demandée.",
  'Form.isFilled_error.given_name':
    "Veuillez renseigner l'information demandée.",

  'Form.label.rawBirthdate': 'Date de naissance',
  'Form.hint.rawBirthdate':
    'Format : JJ/MM/AAAA \nEn cas de date de naissance présumée, écrivez 00 sur les périodes inconnues',
  'Form.isNotEmpty_error.rawBirthdate':
    "Veuillez renseigner l'information demandée.",
  'Form.isFilled_error.rawBirthdate':
    "Veuillez renseigner l'information demandée.",

  'Form.label.rawBirthcountry': 'Pays de naissance',
  'Form.hint.rawBirthcountry': 'Comme écrit sur l’acte de naissance',
  'Form.isNotEmpty_error.rawBirthcountry':
    "Veuillez renseigner l'information demandée.",
  'Form.isFilled_error.rawBirthcountry':
    "Veuillez renseigner l'information demandée.",

  'Form.label.rawBirthplace': 'Ville de naissance',
  'Form.hint.rawBirthplace': 'Comme écrit sur l’acte de naissance',
  'Form.isNotEmpty_error.rawBirthplace':
    "Veuillez renseigner l'information demandée.",
  'Form.isFilled_error.rawBirthplace':
    "Veuillez renseigner l'information demandée.",

  // Fraud Contact Form
  'Form.label.email': 'Adresse électronique',
  'Form.hint.email': 'Exemple : jean.dupont@orange.fr',
  'Form.isNotEmpty_error.email': "Veuillez renseigner l'information demandée.",
  'Form.isEmail_error.email':
    'Veuillez renseigner une adresse de courrier électronique valide.',

  'Form.isFilled_error.email': "Veuillez renseigner l'information demandée.",

  'Form.label.phone': 'Numéro de téléphone',
  'Form.hint.phone': 'Format attendu : (+33) X XX XX XX XX',
  'Form.isNotEmpty_error.phone': "Veuillez renseigner l'information demandée.",
  'Form.isFilled_error.phone': "Veuillez renseigner l'information demandée.",

  // Fraud summary Form
  'Form.label.consent':
    'Vous acceptez de transmettre ces données à FranceConnect pour traiter votre demande d’aide.',
  'Form.hint.consent': '',
  'Form.isFilled_error.consent':
    'Veuillez accepter la demande pour envoyer votre signalement',
  'Form.isTrue_error.consent':
    'Veuillez accepter la demande pour envoyer votre signalement',
};
