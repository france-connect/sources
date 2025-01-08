import { errors } from 'oidc-provider';

import { OidcProviderBaseRenderedException } from './oidc-provider-base-rendered.exception';

export class OidcProviderBaseRuntimeException extends OidcProviderBaseRenderedException {
  static SCOPE = 4;
  static UI =
    'Une erreur de communication avec le fournisseur de service est survenue. Veuillez réessayer ultérieurement.';

  public error?: string;
  public error_description?: string;
  public error_detail?: string;
  public status?: number;
  public statusCode?: number;

  constructor(exception: Error) {
    super(exception);

    const constructor = this.constructor as any;
    const { ERROR_CLASS, ERROR_DETAIL, ERROR_SOURCE } = constructor;
    this.log = `${ERROR_CLASS} (${ERROR_SOURCE}): ${ERROR_DETAIL}`;

    const { status, statusCode, error, error_description, error_detail } =
      exception as errors.OIDCProviderError;

    this.error = error;
    this.error_description = error_description;
    this.error_detail = error_detail;
    this.status = status;
    this.statusCode = statusCode;
  }
}
