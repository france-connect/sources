import type { HttpMethods } from '@fc/common';
import type { FormConfigInterface } from '@fc/forms';

export interface Dto2FormRoute {
  method: HttpMethods;
  path: string;
}

export interface Dto2FormFormConfigInterface {
  form: FormConfigInterface;
  endpoints: {
    load?: Dto2FormRoute;
    schema: Dto2FormRoute;
    submit: Dto2FormRoute;
  };
}

export interface Dto2FormConfigInterface {
  [key: string]: Dto2FormFormConfigInterface;
}
