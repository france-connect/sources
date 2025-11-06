import type { HttpMethods } from '@fc/common';
import type { FormConfigInterface } from '@fc/forms';

export interface Dto2FormServiceRoute {
  method: HttpMethods;
  path: string;
}

export interface Dto2FormServiceEndpointsInterface {
  load?: Dto2FormServiceRoute;
  schema: Dto2FormServiceRoute;
  submit: Dto2FormServiceRoute;
}

export interface Dto2FormServiceFormConfigInterface {
  form: FormConfigInterface;
  endpoints: Dto2FormServiceEndpointsInterface;
}

export interface Dto2FormServiceConfigInterface {
  [key: string]: Dto2FormServiceFormConfigInterface;
}
