/* istanbul ignore file */

// Declarative file
import { I18nTranslationsMapType } from '@fc/i18n';
import { frFR as frFROidcProvider } from '@fc/oidc-provider/exceptions/runtime/fr-FR.i18n';
import { frFR as frFRClaims } from '@fc/scopes';

const ERROR_CONTACT_US =
  'Une erreur technique est survenue. Si le problème persiste, veuillez nous contacter.';

const ERROR_RECONNECT =
  'Une erreur technique est survenue, fermez l’onglet de votre navigateur et reconnectez-vous.';

export const frFR: I18nTranslationsMapType = {
  // claims
  ...frFRClaims,

  // OidcProvider
  ...frFROidcProvider,

  // Meta
  'meta.lang': 'fr',

  // Common
  'common.close': 'Fermer',
  'common.new_window': 'Ouvre une nouvelle fenêtre',

  // Footer
  'footer.a11y_conformity': 'Accessibilité : non conforme',
  'footer.more_info': 'En savoir plus sur {platform}',
  'footer.tos': 'CGU',
  'footer.faq': 'Foire aux questions',

  // Navigation
  'nav.back_to_provider': 'Revenir sur {spName}',
  'nav.more_info': 'En savoir plus',

  // Interaction
  'interaction.page_title': 'Connexion - Choix du compte - {platform}',
  'interaction.anonymous_no_personal_data':
    'Vous allez continuer de façon anonyme, aucune donnée personnelle ne sera transmise',
  'interaction.idp_connexion_failed':
    'La connexion à <b>{idpName}</b> n’a pas été possible. Veuillez réessayer ou choisir un autre moyen de connexion.',
  'interaction.beta_provider': 'BETA',

  'interaction.connecting_to': 'Connexion en cours sur {spName}',
  'interaction.choose_provider': 'Choisissez un compte pour vous connecter :',
  'interaction.modal.cancel_text': 'Utiliser un autre compte',

  // Consent
  'consent.page_title':
    'Connexion - Continuer sur Service {spName} - {platform}',
  'consent.login_as': 'Vous allez vous connecter en tant que :',
  'consent.login_anonymously': 'Vous allez vous connecter de façon anonyme',
  'consent.continue_to_sp': 'Continuer sur {spName}',
  'consent.data_transfer_consent':
    'J’accepte que {platform} transmette mes données au service pour me connecter',
  'consent.consent_checkbox':
    'Veuillez cocher la case pour accepter le transfert des données',
  'consent.transmitted_data': 'Données transmises',
  'consent.data_fetched_from': 'Informations récupérées depuis {dpName}',
  'consent.no_personal_data_transmitted':
    'Aucune donnée personnelle ne sera transmise',
  'consent.information_block_title': 'Les notifications de connexion évoluent',
  'consent.information_block_content':
    'FranceConnect ne vous enverra plus systématiquement une notification à chacune de vos connexions. Une notification vous sera envoyée uniquement lorsqu’une connexion inhabituelle est détectée.',

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
  'BridgeHttpProxy.exceptions.bridgeHttpProxyCsmr': ERROR_CONTACT_US,
  'BridgeHttpProxy.exceptions.bridgeHttpProxyRabbitmq': ERROR_CONTACT_US,
  'BridgeHttpProxy.exceptions.bridgeHttpProxyVariableMissing': ERROR_CONTACT_US,

  // core-fcp
  'CoreFcp.exceptions.coreFcpFailedAbortSession': ERROR_RECONNECT,
  'CoreFcp.exceptions.coreFcpInvalidEventKey': ERROR_CONTACT_US,
  'CoreFcp.exceptions.coreFcpInvalidIdentity':
    'Une erreur technique est survenue, fermez l’onglet de votre navigateur et reconnectez-vous',
  'CoreFcp.exceptions.coreFcpInvalidRepScope': ERROR_RECONNECT,

  // csmr-hsm
  'CsmrHsm.exceptions.csmrHsmRandom': ERROR_CONTACT_US,
  'CsmrHsm.exceptions.csmrHsmSign': ERROR_CONTACT_US,

  // csmr-user-preferences
  'CsmrUserPreferences.exceptions.csmrUserPreferencesIdpNotFound':
    ERROR_RECONNECT,

  // eidas-bridge
  'EidasBridge.exceptions.eidasBridgeInvalidEuIdentity':
    "Un problème lié à vos données d'identité empêche la connexion d'aboutir. Nous vous invitons à nous contacter pour corriger le problème.",
  'EidasBridge.exceptions.eidasBridgeInvalidFrIdentity':
    "Un problème lié à vos données d'identité empêche la connexion d'aboutir. Nous vous invitons à nous contacter pour corriger le problème.",

  // mock-service-provider
  'MockServiceProvider.exceptions.mockServiceProviderTokenRevocation':
    "Une erreur s'est produite lors de la fermeture de votre session, fermez l’onglet de votre navigateur et reconnectez-vous. Si le problème persiste, contacter le support.",
  'MockServiceProvider.exceptions.mockServiceProviderUserinfo':
    'Une erreur technique est survenue, fermez l’onglet de votre navigateur et reconnectez-vous. Si le problème persiste, contacter le support.',

  // user-dashboard
  'UserDashboard.exceptions.userDashboardMissingContext': ERROR_RECONNECT,
  'UserDashboard.exceptions.userDashboardTokenRevocation':
    "Une erreur s'est produite lors de la fermeture de votre session, fermez l’onglet de votre navigateur et reconnectez-vous. Si le problème persiste, contacter le support.",

  // account
  'Account.exceptions.accountBlocked':
    'Votre accès a été désactivé. Pour le réactiver merci de nous contacter.',
  'Account.exceptions.accountNotFound': ERROR_CONTACT_US,

  // apache-ignite
  'ApacheIgnite.exceptions.invalidSocket': ERROR_CONTACT_US,

  // async-local-storage
  'AsyncLocalStorage.exceptions.asyncLocalStorageNotFound': ERROR_CONTACT_US,

  // core
  'Core.exceptions.coreClaimAmr':
    'Une erreur technique est survenue, fermez l’onglet de votre navigateur et reconnectez-vous',
  'Core.exceptions.coreIdentityProviderNotFound': ERROR_CONTACT_US,
  'Core.exceptions.coreIdpBlockedForAccount':
    "Vous avez bloqué l'utilisation de ce fournisseur d'identité. Pour pouvoir l'utiliser, merci de vous rendre dans vos préférences FranceConnect pour l'autoriser.",
  'Core.exceptions.coreIdpHint':
    'Une erreur technique est survenue, fermez l’onglet de votre navigateur et reconnectez-vous',
  'Core.exceptions.coreInvalidAcr': ERROR_CONTACT_US,
  'Core.exceptions.coreInvalidCheckTokenRequest':
    'Required parameter missing or invalid.',
  'Core.exceptions.coreLowAcr': ERROR_CONTACT_US,
  'Core.exceptions.coreMissingAtHash': 'Missing at_hash claim in id_token_hint',
  'Core.exceptions.coreMissingContext': ERROR_RECONNECT,
  'Core.exceptions.coreMissingIdentity': ERROR_RECONNECT,
  'Core.exceptions.coreNotAllowedAcr': ERROR_CONTACT_US,

  // cryptography
  'Cryptography.exceptions.lowEntropyArgument':
    'Entropy must be at least 32 Bytes for random bytes generation',
  'Cryptography.exceptions.passwordHashFailure': ERROR_CONTACT_US,

  // csmr-account-client
  'CsmrAccountClient.exceptions.csmrAccountResponse':
    'Impossible to fetch accountId',

  // csmr-tracks-client
  'CsmrTracksClient.exceptions.tracksResponse': ERROR_CONTACT_US,

  // csrf
  'Csrf.exceptions.csrfBadToken':
    'Votre session a expiré ou est invalide, fermez l’onglet de votre navigateur et reconnectez-vous.',
  'Csrf.exceptions.csrfMissingToken':
    'Votre session a expiré ou est invalide, fermez l’onglet de votre navigateur et reconnectez-vous.',

  // csv
  'Csv.exceptions.csvParsing': ERROR_CONTACT_US,

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
  'Dto2form.exceptions.dto2formInvalidForm': ERROR_CONTACT_US,
  'Dto2form.exceptions.dto2formValidateIfRuleNotFound': ERROR_CONTACT_US,
  'Dto2form.exceptions.dto2formValidationError': ERROR_CONTACT_US,

  // eidas-client
  'EidasClient.exceptions.readLightResponseFromCache': ERROR_CONTACT_US,
  'EidasClient.exceptions.writeLightRequestInCache': ERROR_CONTACT_US,

  // eidas-light-protocol
  'EidasLightProtocol.exceptions.eidasInvalidTokenChecksum': 'Erreur technique',
  'EidasLightProtocol.exceptions.eidasJsonToXml':
    'Erreur technique:: Conversion JSON vers XML impossible',
  'EidasLightProtocol.exceptions.eidasOversizedToken': 'Erreur technique',
  'EidasLightProtocol.exceptions.eidasXmlToJson': 'Erreur technique',

  // eidas-provider
  'EidasProvider.exceptions.readLightRequestFromCache': ERROR_CONTACT_US,
  'EidasProvider.exceptions.writeLightResponseInCache': ERROR_CONTACT_US,

  // feature-handler
  'FeatureHandler.exceptions.featureHandlerEmpty': ERROR_CONTACT_US,
  'FeatureHandler.exceptions.featureHandlerUnregistered': ERROR_CONTACT_US,

  // flow-steps
  'FlowSteps.exceptions.undefinedStepRoute':
    'Nous vous invitons à fermer tous les onglets de votre navigateur et à vous authentifier de nouveau en suivant les étapes de connexion.',
  'FlowSteps.exceptions.unexpectedNavigation':
    'Nous vous invitons à fermer tous les onglets de votre navigateur et à vous authentifier de nouveau en suivant les étapes de connexion.',

  // geoip-maxmind
  'GeoipMaxmind.exceptions.geoipMaxmindNotFound': ERROR_CONTACT_US,

  // i18n
  'I18n.exceptions.i18nInvalidOrMissingCountVariable': ERROR_CONTACT_US,
  'I18n.exceptions.i18nKeyNotFound': ERROR_CONTACT_US,
  'I18n.exceptions.i18nMissingVariable': ERROR_CONTACT_US,

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
  'OidcClient.exceptions.oidcClientGetEndSessionUrl': ERROR_CONTACT_US,
  'OidcClient.exceptions.oidcClientIdpBlacklisted': ERROR_RECONNECT,
  'OidcClient.exceptions.oidcClientIdpDisabled': ERROR_RECONNECT,
  'OidcClient.exceptions.oidcClientIdpFailedToFetchBlacklist': ERROR_CONTACT_US,
  'OidcClient.exceptions.oidcClientIdpNotFound': ERROR_RECONNECT,
  'OidcClient.exceptions.oidcClientInvalidState': ERROR_RECONNECT,
  'OidcClient.exceptions.oidcClientMissingCode': ERROR_CONTACT_US,
  'OidcClient.exceptions.oidcClientMissingIdentitySub': ERROR_CONTACT_US,
  'OidcClient.exceptions.oidcClientMissingState': ERROR_CONTACT_US,
  'OidcClient.exceptions.oidcClientTokenFailed': ERROR_CONTACT_US,
  'OidcClient.exceptions.oidcClientTokenResultFailed': ERROR_CONTACT_US,
  'OidcClient.exceptions.oidcClientUserinfosFailed': ERROR_CONTACT_US,

  // oidc-provider
  'OidcProvider.exceptions.oidcProviderAuthorizeParams': ERROR_RECONNECT,
  'OidcProvider.exceptions.oidcProviderBinding': ERROR_CONTACT_US,
  'OidcProvider.exceptions.oidcProviderGrantSave': ERROR_CONTACT_US,
  'OidcProvider.exceptions.oidcProviderInitialisation': ERROR_CONTACT_US,
  'OidcProvider.exceptions.oidcProviderInteractionNoFound': ERROR_RECONNECT,
  'OidcProvider.exceptions.oidcProviderParseJsonClaims': ERROR_RECONNECT,
  'OidcProvider.exceptions.oidcProviderParseRedisResponse': ERROR_RECONNECT,
  'OidcProvider.exceptions.oidcProviderSpidNotFound': ERROR_RECONNECT,
  'OidcProvider.exceptions.oidcProviderStringifyPayloadForRedis':
    ERROR_CONTACT_US,
  'OidcProvider.exceptions.RuntimeException': ERROR_RECONNECT,

  'OidcProvider.exceptions.InvalidClient.A586':
    'Une erreur de communication avec le fournisseur de service est survenue. Veuillez réessayer ultérieurement.',
  'OidcProvider.exceptions.InvalidRedirectUri.6350':
    'Une erreur de communication avec le fournisseur de service est survenue. Veuillez réessayer ultérieurement.',

  // override-oidc-provider
  'OverrideOidcProvider.exceptions.cryptographyGateway': ERROR_CONTACT_US,
  'OverrideOidcProvider.exceptions.cryptographyInvalidPayloadFormat':
    ERROR_CONTACT_US,

  // rnipp
  'Rnipp.exceptions.rnippCititizenStatusFormat': ERROR_CONTACT_US,
  'Rnipp.exceptions.rnippDeceased':
    'Les identifiants utilisés correspondent à une identité qui ne permet plus la connexion.',
  'Rnipp.exceptions.rnippFoundOnlyWithMaritalName':
    "Un problème lié à vos données d'identité empêche la connexion d'aboutir. Nous vous invitons à nous contacter pour corriger le problème.",
  'Rnipp.exceptions.rnippHttpStatus': ERROR_CONTACT_US,
  'Rnipp.exceptions.rnippNotFoundMultipleEcho':
    "Un problème lié à vos données d'identité empêche la connexion d'aboutir. Nous vous invitons à nous contacter pour corriger le problème.",
  'Rnipp.exceptions.rnippNotFoundNoEcho':
    'Merci de consulter notre page d’aide FranceConnect.',
  'Rnipp.exceptions.rnippNotFoundSingleEcho':
    "Un problème lié à vos données d'identité empêche la connexion d'aboutir. Nous vous invitons à nous contacter pour corriger le problème.",
  'Rnipp.exceptions.rnippRejectedBadRequest': ERROR_CONTACT_US,
  'Rnipp.exceptions.rnippTimeout': ERROR_CONTACT_US,

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

  // tracks-adapter-elasticsearch
  'TracksAdapterElasticsearch.exceptions.tracksFormatterUnknownInstance':
    'Found unknown instance (service) in track',
  'TracksAdapterElasticsearch.exceptions.tracksFormatterMappingFailed':
    'Impossible to format tracks',

  // user-preferences
  'UserPreferences.exceptions.getUserPreferencesConsumerError':
    ERROR_CONTACT_US,
  'UserPreferences.exceptions.getUserPreferencesResponse': ERROR_CONTACT_US,
  'UserPreferences.exceptions.setUserPreferencesConsumerError':
    ERROR_CONTACT_US,
  'UserPreferences.exceptions.setUserPreferencesResponse': ERROR_CONTACT_US,

  // view-templates
  'ViewTemplates.exceptions.viewTemplateConflictingAlias':
    "Un alias d'opérateur de template avec ce nom est déjà enregistré. Erreur au démarrage de l'application.",
  'ViewTemplates.exceptions.viewTemplateServiceNotFound':
    "Un alias sur une méthode d'instance n'a pas pu être exposé aux templates, probablement car le service n'est pas enregistré comme provider.",
};
