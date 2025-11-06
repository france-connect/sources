import { HeadingTag, HttpMethods } from '@fc/common';
import type { Dto2FormConfigInterface } from '@fc/dto2form';

export const Dto2FormService: Dto2FormConfigInterface = {
  InstancesCreate: {
    endpoints: {
      schema: {
        method: HttpMethods.GET,
        path: '/api/versions/form-metadata',
      },
      submit: {
        method: HttpMethods.POST,
        path: '/api/instances',
      },
    },
    form: {
      id: 'Dto2Form-instance-create',
      showFieldValidationMessage: false,
      validateOnFieldChange: false,
      validateOnSubmit: false,
    },
  },
  InstancesUpdate: {
    endpoints: {
      load: {
        method: HttpMethods.GET,
        path: '/api/instances/:instanceId',
      },
      schema: { method: HttpMethods.GET, path: '/api/versions/form-metadata' },
      submit: {
        method: HttpMethods.PUT,
        path: '/api/instances/:instanceId',
      },
    },
    form: {
      id: 'Dto2Form-instance-update',
      showFieldValidationMessage: false,
      titleHeading: HeadingTag.H2,
      validateOnFieldChange: false,
      validateOnSubmit: false,
    },
  },
};
