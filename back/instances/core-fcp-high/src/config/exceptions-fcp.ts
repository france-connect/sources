import { ExceptionsFcpConfig } from '@fc/exceptions-fcp';

export default {
  items: [
    { errorCode: 'Y600007', active: false },
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
    { errorCode: 'Y010011', active: false },
    { errorCode: 'Y010012', active: false },
    { errorCode: 'Y010013', active: false },
    { errorCode: 'Y010015', active: false },
    { errorCode: 'Y020000', active: false },
    { errorCode: 'Y100001', active: false },
    { errorCode: 'Y100002', active: false },
    { errorCode: 'Y020021', active: false },
    { errorCode: 'Y020024', active: false },
    { errorCode: 'Y020025', active: false },
    { errorCode: 'Y020026', active: false },
    { errorCode: 'Y020027', active: false },
    { errorCode: 'Y020028', active: false },
    { errorCode: 'Y020029', active: false },
    { errorCode: 'Y020030', active: false },
    { errorCode: 'Y030002', active: false },
    { errorCode: 'Y030004', active: false },
    { errorCode: 'Y030005', active: false },
    { errorCode: 'Y030007', active: false },
    { errorCode: 'Y100009', active: false },
    { errorCode: 'Y030026', active: false },
    { errorCode: 'Y150001', active: false },
    { errorCode: 'Y150003', active: false },
    { errorCode: 'Y160004', active: false },
    { errorCode: 'Y180001', active: false },
    { errorCode: 'Y190005', active: false },
    { errorCode: 'Y200001', active: false },
    { errorCode: 'Y200002', active: false },
    { errorCode: 'Y270001', active: false },
    { errorCode: 'Y270002', active: false },
    { errorCode: 'Y270003', active: false },
  ],
} as ExceptionsFcpConfig;
