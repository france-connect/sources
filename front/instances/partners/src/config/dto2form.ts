import { ContentType, HeadingTag, HttpMethods } from '@fc/common';
import type { Dto2FormConfigInterface } from '@fc/dto2form';

export const Dto2FormService: Dto2FormConfigInterface = {
  ContributorCreate: {
    endpoints: {
      schema: {
        method: HttpMethods.GET,
        path: '/api/contributors/form-metadata',
      },
      submit: {
        method: HttpMethods.POST,
        path: '/api/service-providers/:serviceProviderId/contributors',
      },
    },
    form: {
      contentType: ContentType.JSON,
      id: 'Dto2Form-contributor-create',
      showFieldValidationMessage: false,
      validateOnFieldChange: false,
      validateOnSubmit: false,
    },
  },
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
      contentType: ContentType.JSON,
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
      contentType: ContentType.JSON,
      id: 'Dto2Form-instance-update',
      showFieldValidationMessage: false,
      titleHeading: HeadingTag.H2,
      validateOnFieldChange: false,
      validateOnSubmit: false,
    },
  },
  ServiceProviderCreateInstance: {
    endpoints: {
      schema: {
        method: HttpMethods.GET,
        path: '/api/service-providers/:serviceProviderId/versions/form-metadata',
      },
      submit: {
        method: HttpMethods.POST,
        path: '/api/service-providers/:serviceProviderId/instances',
      },
    },
    form: {
      contentType: ContentType.JSON,
      id: 'Dto2Form-service-provider-create-instance',
      showFieldValidationMessage: false,
      validateOnFieldChange: false,
      validateOnSubmit: false,
    },
  },
};
