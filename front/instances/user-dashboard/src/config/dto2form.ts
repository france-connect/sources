import { HttpMethods } from '@fc/common';
import type { Dto2FormConfigInterface } from '@fc/dto2form';
import type { FormConfigInterface } from '@fc/forms';

const FRAUD_NO_AUTH_ENDPOINT = '/api/fraud/no-auth';

const commonConfig: FormConfigInterface = {
  id: 'IdentityTheftReport',
  showFieldValidationMessage: false,
  validateOnFieldChange: false,
  validateOnSubmit: false,
};

export const Dto2Form: Dto2FormConfigInterface = {
  IdentityTheftConnection: {
    ...commonConfig,
    endpoints: {
      schema: {
        method: HttpMethods.GET,
        path: `${FRAUD_NO_AUTH_ENDPOINT}/connection`,
      },
      submit: {
        method: HttpMethods.POST,
        path: `${FRAUD_NO_AUTH_ENDPOINT}/connection`,
      },
    },
    id: `${commonConfig.id}-Connection`,
  },

  IdentityTheftContact: {
    ...commonConfig,
    endpoints: {
      schema: {
        method: HttpMethods.GET,
        path: `${FRAUD_NO_AUTH_ENDPOINT}/contact`,
      },
      submit: {
        method: HttpMethods.POST,
        path: `${FRAUD_NO_AUTH_ENDPOINT}/contact`,
      },
    },
    id: `${commonConfig.id}-Contact`,
  },

  IdentityTheftDescription: {
    ...commonConfig,
    endpoints: {
      schema: {
        method: HttpMethods.GET,
        path: `${FRAUD_NO_AUTH_ENDPOINT}/description`,
      },
      submit: {
        method: HttpMethods.POST,
        path: `${FRAUD_NO_AUTH_ENDPOINT}/description`,
      },
    },
    id: `${commonConfig.id}-Description`,
  },

  IdentityTheftIdentity: {
    ...commonConfig,
    endpoints: {
      schema: {
        method: HttpMethods.GET,
        path: `${FRAUD_NO_AUTH_ENDPOINT}/identity`,
      },
      submit: {
        method: HttpMethods.POST,
        path: `${FRAUD_NO_AUTH_ENDPOINT}/identity`,
      },
    },
    id: `${commonConfig.id}-Identity`,
  },

  IdentityTheftSummary: {
    ...commonConfig,
    endpoints: {
      schema: {
        method: HttpMethods.GET,
        path: `${FRAUD_NO_AUTH_ENDPOINT}/summary`,
      },
      submit: {
        method: HttpMethods.POST,
        path: `${FRAUD_NO_AUTH_ENDPOINT}/summary`,
      },
    },
    id: `${commonConfig.id}-Summary`,
  },
};
