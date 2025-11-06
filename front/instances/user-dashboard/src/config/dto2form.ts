import { HttpMethods } from '@fc/common';
import { ButtonTypes } from '@fc/dsfr';
import type { Dto2FormConfigInterface } from '@fc/dto2form';
import type { FormConfigInterface } from '@fc/forms';

const FRAUD_NO_AUTH_ENDPOINT = '/api/fraud/no-auth';

const commonConfig: FormConfigInterface = {
  actions: [
    {
      // @NOTE can only be tested with BDD
      // config are not tested
      disabled: /* istanbul ignore next */ ({ canSubmit }) => !canSubmit,
      label: 'DSFR.stepper.nextStepButton',
      type: ButtonTypes.SUBMIT,
    },
  ],
  id: 'IdentityTheftReport',
  showFieldValidationMessage: false,
  validateOnFieldChange: false,
  validateOnSubmit: false,
};

export const Dto2FormService: Dto2FormConfigInterface = {
  IdentityTheftConnection: {
    endpoints: {
      load: {
        method: HttpMethods.GET,
        path: `${FRAUD_NO_AUTH_ENDPOINT}/connection`,
      },
      schema: {
        method: HttpMethods.GET,
        path: `${FRAUD_NO_AUTH_ENDPOINT}/connection`,
      },
      submit: {
        method: HttpMethods.POST,
        path: `${FRAUD_NO_AUTH_ENDPOINT}/connection`,
      },
    },
    form: {
      ...commonConfig,
      id: `${commonConfig.id}-Connection`,
    },
  },

  IdentityTheftContact: {
    endpoints: {
      load: {
        method: HttpMethods.GET,
        path: `${FRAUD_NO_AUTH_ENDPOINT}/contact`,
      },
      schema: {
        method: HttpMethods.GET,
        path: `${FRAUD_NO_AUTH_ENDPOINT}/contact`,
      },
      submit: {
        method: HttpMethods.POST,
        path: `${FRAUD_NO_AUTH_ENDPOINT}/contact`,
      },
    },
    form: {
      ...commonConfig,
      id: `${commonConfig.id}-Contact`,
    },
  },

  IdentityTheftDescription: {
    endpoints: {
      load: {
        method: HttpMethods.GET,
        path: `${FRAUD_NO_AUTH_ENDPOINT}/description`,
      },
      schema: {
        method: HttpMethods.GET,
        path: `${FRAUD_NO_AUTH_ENDPOINT}/description`,
      },
      submit: {
        method: HttpMethods.POST,
        path: `${FRAUD_NO_AUTH_ENDPOINT}/description`,
      },
    },
    form: {
      ...commonConfig,
      id: `${commonConfig.id}-Description`,
    },
  },

  IdentityTheftIdentity: {
    endpoints: {
      load: {
        method: HttpMethods.GET,
        path: `${FRAUD_NO_AUTH_ENDPOINT}/identity`,
      },
      schema: {
        method: HttpMethods.GET,
        path: `${FRAUD_NO_AUTH_ENDPOINT}/identity`,
      },
      submit: {
        method: HttpMethods.POST,
        path: `${FRAUD_NO_AUTH_ENDPOINT}/identity`,
      },
    },
    form: {
      ...commonConfig,
      id: `${commonConfig.id}-Identity`,
    },
  },

  IdentityTheftSummary: {
    endpoints: {
      load: {
        method: HttpMethods.GET,
        path: `${FRAUD_NO_AUTH_ENDPOINT}/summary`,
      },
      schema: {
        method: HttpMethods.GET,
        path: `${FRAUD_NO_AUTH_ENDPOINT}/summary`,
      },
      submit: {
        method: HttpMethods.POST,
        path: `${FRAUD_NO_AUTH_ENDPOINT}/summary`,
      },
    },
    form: {
      ...commonConfig,
      actions: [
        {
          // @NOTE can only be tested with BDD
          // config are not tested
          disabled: /* istanbul ignore next */ ({ canSubmit }) => !canSubmit,
          label: 'IdentityTheftReport.summaryPage.submit',
          type: ButtonTypes.SUBMIT,
        },
      ],
      id: `${commonConfig.id}-Summary`,
    },
  },
};
