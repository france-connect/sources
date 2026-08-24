import { ExceptionsFcpConfig } from '@fc/exceptions-fcp';

const SESSION_FAQ_URL =
  'https://aide.franceconnect.gouv.fr/faq/erreurs-connexions/j-ai-un-probleme-de-session-que-faire/';

const SESSION_ERROR_CODES = [
  'Y190001',
  'Y190002',
  'Y190003',
  'Y190004',
  'Y190005',
  'Y190008',
  'Y190009',
  'Y190010',
  'Y190011',
  'Y190012',
  'Y190013',
  'Y190014',
];

const sessionFaqItems = SESSION_ERROR_CODES.map((errorCode) => ({
  errorCode,
  active: true,
  actionTitle: 'error.faq.title',
  actionButtonLabel: 'error.faq.button_label',
  actionHref: SESSION_FAQ_URL,
}));

export default {
  items: [
    { errorCode: 'Y010004', active: false },
    { errorCode: 'Y010006', active: false },
    { errorCode: 'Y010007', active: false },
    {
      errorCode: 'Y010008',
      active: true,
      errorMessage: 'error.faq.body',
      actionTitle: 'error.faq.title',
      actionButtonLabel: 'error.faq.button_label',
      actionHref:
        'https://aide.franceconnect.gouv.fr/erreurs/Y010008/etape-1/index.html',
    },
    { errorCode: 'Y010009', active: false },
    {
      errorCode: 'Y010015',
      active: true,
      actionTitle: 'error.faq.title',
      actionButtonLabel: 'error.faq.button_label',
      actionHref:
        'https://aide.franceconnect.gouv.fr/faq/erreurs-connexions/je-ne-peux-plus-me-connecter-avec-le-compte-d-une-personne-decedee-que-faire/',
    },
    {
      errorCode: 'Y100011',
      active: true,
      errorMessage: 'error.faq.y100011.body',
      actionTitle: 'error.faq.title',
      actionButtonLabel: 'error.faq.button_label',
      actionHref:
        'https://aide.franceconnect.gouv.fr/faq/erreurs-connexions/je-recois-une-erreur-y100011-que-faire/',
    },
    { errorCode: 'Y030026', active: false },
    { errorCode: 'Y180001', active: false },
    { errorCode: 'Y270001', active: false },
    { errorCode: 'Y270002', active: false },
    {
      errorCode: 'Y420001',
      active: true,
      actionTitle: 'error.faq.title',
      actionButtonLabel: 'error.faq.button_label',
      actionHref:
        'https://aide.franceconnect.gouv.fr/faq/erreurs-connexions/je-veux-utiliser-les-fleches-de-navigation-de-mon-navigateur-mais-j-ai-des-erreurs/',
    },
    {
      errorCode: 'Y420002',
      active: true,
      actionTitle: 'error.faq.title',
      actionButtonLabel: 'error.faq.button_label',
      actionHref:
        'https://aide.franceconnect.gouv.fr/faq/erreurs-connexions/je-veux-utiliser-les-fleches-de-navigation-de-mon-navigateur-mais-j-ai-des-erreurs/',
    },
    ...sessionFaqItems,
  ],
} as ExceptionsFcpConfig;
