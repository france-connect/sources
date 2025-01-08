import { I18nTermType } from '@fc/i18n';

export interface ExceptionDocumentationInterface {
  CODE: string | number;
  SCOPE: number;
  errorCode: string;
  ERROR: string;
  ERROR_DESCRIPTION: string;
  UI: string;
  DOCUMENTATION: string;
  exception: string;
  HTTP_STATUS_CODE: number;
  translated?: I18nTermType;
  LOG_LEVEL: number;
  path: string;
}
