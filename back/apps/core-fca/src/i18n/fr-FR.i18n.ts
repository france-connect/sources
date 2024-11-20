/* istanbul ignore file */

// Declarative file
import { I18nTranslationsMapType } from '@fc/i18n';
import { frFR as frFROidcProvider } from '@fc/oidc-provider/exceptions/runtime/fr-FR.i18n';
import { frFR as frFRClaims } from '@fc/scopes';

export const frFR: I18nTranslationsMapType = {
  // claims
  ...frFRClaims,

  // OidcProvider
  ...frFROidcProvider,

  // Meta
  'meta.lang': 'fr',

  // Errors
  'error.page_title': 'Connexion - Erreur - {platform}',
  'error.support.title': 'Que faire ?',
  'error.support.button_label': 'Contactez-nous',
  'error.error_title': 'Une erreur s’est produite',
  'error.error_code': 'Erreur {code}',
  'error.faq.title': "Besoin d'aide ?",
  'error.faq.button_label': 'Consulter la page d’aide',
  'error.faq.body': 'Merci de consulter notre page d’aide FranceConnect.',

  // Exceptions
  'exceptions.default_message':
    "Une erreur s'est produite, veuillez réessayer ultérieurement",
  // 404 NetsJS
  'exceptions.http.404': 'Page non trouvée',

  // 404 oidc-provider
  'OidcProvider.exceptions.InvalidRequest.9D62': 'Page non trouvée',

  // bridge-http-proxy
  'BridgeHttpProxy.exceptions.bridgeHttpProxyCsmr':
    'Une erreur technique est survenue. Si le problème persiste, veuillez nous contacter.',
  'BridgeHttpProxy.exceptions.bridgeHttpProxyRabbitmq':
    'Une erreur technique est survenue. Si le problème persiste, veuillez nous contacter.',
  'BridgeHttpProxy.exceptions.bridgeHttpProxyVariableMissing':
    'Une erreur technique est survenue. Si le problème persiste, veuillez nous contacter.',

  // account
  'Account.exceptions.accountBlocked':
    'Votre accès a été désactivé. Pour le réactiver merci de nous contacter.',
  'Account.exceptions.accountNotFound':
    'Une erreur technique est survenue. Si le problème persiste, veuillez nous contacter.',

  // apache-ignite
  'ApacheIgnite.exceptions.invalidSocket':
    'Une erreur technique est survenue. Si le problème persiste, veuillez nous contacter.',

  // async-local-storage
  'AsyncLocalStorage.exceptions.asyncLocalStorageNotFound':
    'Une erreur technique est survenue. Si le problème persiste, veuillez nous contacter.',

  // core
  'Core.exceptions.coreClaimAmr':
    'Une erreur technique est survenue, fermez l’onglet de votre navigateur et reconnectez-vous',
  'Core.exceptions.coreIdentityProviderNotFound':
    'Une erreur technique est survenue. Si le problème persiste, veuillez nous contacter.',
  'Core.exceptions.coreIdpBlockedForAccount':
    "Vous avez bloqué l'utilisation de ce fournisseur d'identité. Pour pouvoir l'utiliser, merci de vous rendre dans vos préférences FranceConnect pour l'autoriser.",
  'Core.exceptions.coreIdpHint':
    'Une erreur technique est survenue, fermez l’onglet de votre navigateur et reconnectez-vous',
  'Core.exceptions.coreInvalidAcr':
    'Une erreur technique est survenue. Si le problème persiste, veuillez nous contacter.',
  'Core.exceptions.coreInvalidCheckTokenRequest':
    'Required parameter missing or invalid.',
  'Core.exceptions.coreLowAcr':
    'Une erreur technique est survenue. Si le problème persiste, veuillez nous contacter.',
  'Core.exceptions.coreMissingAtHash': 'Missing at_hash claim in id_token_hint',
  'Core.exceptions.coreMissingContext':
    'Une erreur technique est survenue, fermez l’onglet de votre navigateur et reconnectez-vous.',
  'Core.exceptions.coreMissingIdentity':
    'Une erreur technique est survenue, fermez l’onglet de votre navigateur et reconnectez-vous.',
  'Core.exceptions.coreNotAllowedAcr':
    'Une erreur technique est survenue. Si le problème persiste, veuillez nous contacter.',

  // cryptography
  'Cryptography.exceptions.lowEntropyArgument':
    'Entropy must be at least 32 Bytes for random bytes generation',
  'Cryptography.exceptions.passwordHashFailure':
    'Une erreur technique est survenue. Si le problème persiste, veuillez nous contacter.',

  // csrf
  'Csrf.exceptions.csrfBadToken':
    'Votre session a expiré ou est invalide, fermez l’onglet de votre navigateur et reconnectez-vous.',
  'Csrf.exceptions.csrfMissingToken':
    'Votre session a expiré ou est invalide, fermez l’onglet de votre navigateur et reconnectez-vous.',

  // csv
  'Csv.exceptions.csvParsing':
    'Une erreur technique est survenue. Si le problème persiste, veuillez nous contacter.',

  // data-provider-adapter-core
  'DataProviderAdapterCore.exceptions.checktokenHttpStatus':
    'The authorization server encountered an unexpected condition that prevented it from fulfilling the request.',
  'DataProviderAdapterCore.exceptions.checktokenInvalidAlgorithm':
    'The encryption algorithm for the configured checktoken does not match the one received.',
  'DataProviderAdapterCore.exceptions.checktokenInvalidEncoding':
    'The encryption encoding for the configured checktoken does not match the one received.',
  'DataProviderAdapterCore.exceptions.checktokenTimeout':
    'The authorization server is currently unable to handle the request.',
  'DataProviderAdapterCore.exceptions.jwksFetchFailed': 'Can not fetch jwks',

  // data-provider-adapter-mongo
  'DataProviderAdapterMongo.exceptions.dataProviderInvalidCredentials':
    'Client authentication failed.',
  'DataProviderAdapterMongo.exceptions.dataProviderNotFound': 'Unknown client.',

  // device
  'Device.exceptions.deviceCookieInvalidData': 'undefined',
  'Device.exceptions.deviceCookieInvalidJson': 'undefined',

  // dto2form
  'Dto2form.exceptions.dto2formInvalidForm':
    'Une erreur technique est survenue. Si le problème persiste, veuillez nous contacter.',
  'Dto2form.exceptions.dto2formValidateIfRuleNotFound':
    'Une erreur technique est survenue. Si le problème persiste, veuillez nous contacter.',
  'Dto2form.exceptions.dto2formValidationError':
    'Une erreur technique est survenue. Si le problème persiste, veuillez nous contacter.',

  // feature-handler
  'FeatureHandler.exceptions.featureHandlerEmpty':
    'Une erreur technique est survenue. Si le problème persiste, veuillez nous contacter.',
  'FeatureHandler.exceptions.featureHandlerUnregistered':
    'Une erreur technique est survenue. Si le problème persiste, veuillez nous contacter.',

  // flow-steps
  'FlowSteps.exceptions.undefinedStepRoute':
    'Nous vous invitons à fermer tous les onglets de votre navigateur et à vous authentifier de nouveau en suivant les étapes de connexion.',
  'FlowSteps.exceptions.unexpectedNavigation':
    'Nous vous invitons à fermer tous les onglets de votre navigateur et à vous authentifier de nouveau en suivant les étapes de connexion.',

  // geoip-maxmind
  'GeoipMaxmind.exceptions.geoipMaxmindNotFound':
    'Une erreur technique est survenue. Si le problème persiste, veuillez nous contacter.',

  // i18n
  'I18n.exceptions.i18nInvalidOrMissingCountVariable':
    'Une erreur technique est survenue. Si le problème persiste, veuillez nous contacter.',
  'I18n.exceptions.i18nKeyNotFound':
    'Une erreur technique est survenue. Si le problème persiste, veuillez nous contacter.',
  'I18n.exceptions.i18nMissingVariable':
    'Une erreur technique est survenue. Si le problème persiste, veuillez nous contacter.',

  // jwt
  'Jwt.exceptions.canNotDecodePlaintext': 'Can not decode plaintext',
  'Jwt.exceptions.canNotDecodeProtectedHeader':
    'Can not decode protected header',
  'Jwt.exceptions.canNotDecrypt': 'Can not decrypt',
  'Jwt.exceptions.canNotEncrypt': 'Can not encrypt',
  'Jwt.exceptions.canNotImportJwk': 'Can not import JWK',
  'Jwt.exceptions.canNotSignJwt': 'Can not sign JWT',
  'Jwt.exceptions.fetchJwksFailed': 'Failed to fetch JWKS',
  'Jwt.exceptions.invalidSignature': 'Signature not verified',
  'Jwt.exceptions.multipleRelevantKeys': 'Multiple relevant keys found',
  'Jwt.exceptions.noRelevantKey': 'undefined',

  // mailer
  'Mailer.exceptions.mailerNotificationConnect':
    'Une erreur technique est survenue, veuillez contacter le support.',
  'Mailer.exceptions.noEmail':
    'Les informations sur votre identité sont incomplètes et ne permettent pas de vous connecter à votre service. Veuillez contacter le support.',
  'Mailer.exceptions.templateNotFound':
    'Une erreur technique est survenue, veuillez contacter le support.',

  // oidc-acr
  'OidcAcr.exceptions.oidcAcrNoSsoAllowedAcrFound': 'No SSO allowed ACR found',

  // oidc-client
  'OidcClient.exceptions.oidcClientGetEndSessionUrl':
    'Une erreur technique est survenue. Si le problème persiste, veuillez nous contacter.',
  'OidcClient.exceptions.oidcClientIdpBlacklisted':
    'Une erreur technique est survenue, fermez l’onglet de votre navigateur et reconnectez-vous.',
  'OidcClient.exceptions.oidcClientIdpDisabled':
    'Une erreur technique est survenue, fermez l’onglet de votre navigateur et reconnectez-vous.',
  'OidcClient.exceptions.oidcClientIdpFailedToFetchBlacklist':
    'Une erreur technique est survenue. Si le problème persiste, veuillez nous contacter.',
  'OidcClient.exceptions.oidcClientIdpNotFound':
    'Une erreur technique est survenue, fermez l’onglet de votre navigateur et reconnectez-vous.',
  'OidcClient.exceptions.oidcClientInvalidState':
    'Une erreur technique est survenue, fermez l’onglet de votre navigateur et reconnectez-vous.',
  'OidcClient.exceptions.oidcClientMissingCode':
    'Une erreur technique est survenue. Si le problème persiste, veuillez nous contacter.',
  'OidcClient.exceptions.oidcClientMissingIdentitySub':
    'Une erreur technique est survenue. Si le problème persiste, veuillez nous contacter.',
  'OidcClient.exceptions.oidcClientMissingState':
    'Une erreur technique est survenue. Si le problème persiste, veuillez nous contacter.',
  'OidcClient.exceptions.oidcClientTokenFailed':
    'Une erreur technique est survenue. Si le problème persiste, veuillez nous contacter.',
  'OidcClient.exceptions.oidcClientTokenResultFailed':
    'Une erreur technique est survenue. Si le problème persiste, veuillez nous contacter.',
  'OidcClient.exceptions.oidcClientUserinfosFailed':
    'Une erreur technique est survenue. Si le problème persiste, veuillez nous contacter.',

  // oidc-provider
  'OidcProvider.exceptions.oidcProviderAuthorizeParams':
    'Une erreur technique est survenue, fermez l’onglet de votre navigateur et reconnectez-vous.',
  'OidcProvider.exceptions.oidcProviderBinding':
    'Une erreur technique est survenue. Si le problème persiste, veuillez nous contacter.',
  'OidcProvider.exceptions.oidcProviderGrantSave':
    'Une erreur technique est survenue. Si le problème persiste, veuillez nous contacter.',
  'OidcProvider.exceptions.oidcProviderInitialisation':
    'Une erreur technique est survenue. Si le problème persiste, veuillez nous contacter.',
  'OidcProvider.exceptions.oidcProviderInteractionNoFound':
    'Une erreur technique est survenue, fermez l’onglet de votre navigateur et reconnectez-vous.',
  'OidcProvider.exceptions.oidcProviderParseJsonClaims':
    'Une erreur technique est survenue, fermez l’onglet de votre navigateur et reconnectez-vous.',
  'OidcProvider.exceptions.oidcProviderParseRedisResponse':
    'Une erreur technique est survenue, fermez l’onglet de votre navigateur et reconnectez-vous.',
  'OidcProvider.exceptions.oidcProviderSpidNotFound':
    'Une erreur technique est survenue, fermez l’onglet de votre navigateur et reconnectez-vous.',
  'OidcProvider.exceptions.oidcProviderStringifyPayloadForRedis':
    'Une erreur technique est survenue. Si le problème persiste, veuillez nous contacter.',
  'OidcProvider.exceptions.RuntimeException':
    'Une erreur technique est survenue, fermez l’onglet de votre navigateur et reconnectez-vous.',

  'OidcProvider.exceptions.InvalidClient.A586':
    'Client non trouvé (client_id invalide)',
  'OidcProvider.exceptions.InvalidRedirectUri.6350':
    'L’URL de callback n’est pas valide',

  // override-oidc-provider
  'OverrideOidcProvider.exceptions.cryptographyGateway':
    'Une erreur technique est survenue. Si le problème persiste, veuillez nous contacter.',
  'OverrideOidcProvider.exceptions.cryptographyInvalidPayloadFormat':
    'Une erreur technique est survenue. Si le problème persiste, veuillez nous contacter.',

  // session
  'Session.exceptions.sessionBadAlias':
    'Votre session a expiré ou est invalide, fermez l’onglet de votre navigateur et reconnectez-vous.',
  'Session.exceptions.sessionBadCookie':
    'Votre session a expiré ou est invalide, fermez l’onglet de votre navigateur et reconnectez-vous.',
  'Session.exceptions.sessionBadFormat':
    'Votre session a expiré ou est invalide, fermez l’onglet de votre navigateur et reconnectez-vous.',
  'Session.exceptions.sessionBadStringify':
    'Votre session a expiré ou est invalide, fermez l’onglet de votre navigateur et reconnectez-vous.',
  'Session.exceptions.sessionCannotCommitUndefinedSession':
    'Votre session a expiré, fermez l’onglet de votre navigateur et reconnectez-vous.',
  'Session.exceptions.sessionInvalidSessionData':
    'Votre session est invalide, fermez l’onglet de votre navigateur et reconnectez-vous.',
  'Session.exceptions.sessionInvalidSession':
    'Votre session a expiré ou est invalide, fermez l’onglet de votre navigateur et reconnectez-vous.',
  'Session.exceptions.sessionNoSessionId':
    'Votre session a expiré ou est invalide, fermez l’onglet de votre navigateur et reconnectez-vous.',
  'Session.exceptions.sessionNotFound':
    'Votre session a expiré ou est invalide, fermez l’onglet de votre navigateur et reconnectez-vous.',
  'Session.exceptions.sessionStorage':
    'Votre session a expiré ou est invalide, fermez l’onglet de votre navigateur et reconnectez-vous. Si le problème persiste, contacter le support',
  'Session.exceptions.sessionSubNotFound':
    'Votre session a expiré ou est invalide, fermez l’onglet de votre navigateur et reconnectez-vous.',

  // tracking-context
  'TrackingContext.exceptions.trackingMissingNetworkContext':
    'Missing network context (headers)',

  // view-templates
  'ViewTemplates.exceptions.viewTemplateConflictingAlias':
    "Un alias d'opérateur de template avec ce nom est déjà enregistré. Erreur au démarrage de l'application.",
  'ViewTemplates.exceptions.viewTemplateServiceNotFound':
    "Un alias sur une méthode d'instance n'a pas pu être exposé aux templates, probablement car le service n'est pas enregistré comme provider.",
};
