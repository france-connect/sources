import { Request, Response } from 'express';

import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { EventBus } from '@nestjs/cqrs';

import { ApiErrorMessage } from '@fc/app';
import { ConfigService } from '@fc/config';
import { FcWebHtmlExceptionFilter } from '@fc/exceptions';
import { ExceptionCaughtEvent } from '@fc/exceptions/events';
import { generateErrorId, getClass } from '@fc/exceptions/helpers';
import { LoggerService } from '@fc/logger';
import { IServiceProviderAdapter, OidcError } from '@fc/oidc';
import { SERVICE_PROVIDER_SERVICE_TOKEN } from '@fc/oidc/tokens';
import { ViewTemplateService } from '@fc/view-templates';

import { OidcProviderConfig } from '../dto';
import { OidcProviderBaseRedirectException } from '../exceptions';
import { OidcProviderService } from '../oidc-provider.service';

@Catch(OidcProviderBaseRedirectException)
@Injectable()
export class OidcProviderRedirectExceptionFilter
  extends FcWebHtmlExceptionFilter
  implements ExceptionFilter
{
  // Dependency injection can require more than 4 parameters
  // eslint-disable-next-line max-params
  constructor(
    protected readonly config: ConfigService,
    protected readonly logger: LoggerService,
    protected readonly eventBus: EventBus,
    private readonly oidcProvider: OidcProviderService,
    protected readonly viewTemplate: ViewTemplateService,
    @Inject(SERVICE_PROVIDER_SERVICE_TOKEN)
    private readonly serviceProvider: IServiceProviderAdapter,
  ) {
    super(config, logger, eventBus, viewTemplate);
  }

  async catch(
    exception: OidcProviderBaseRedirectException,
    host: ArgumentsHost,
  ) {
    if (exception.originalError) {
      exception.originalError.caught = true;
    }

    const ctx = host.switchToHttp();
    const res = ctx.getResponse();
    const req = ctx.getRequest();

    const errorDetails = this.getErrorDetails(exception);
    const params = this.getOidcParams(exception);

    const { code, id } = errorDetails;

    this.logException(code, id, exception);

    this.eventBus.publish(new ExceptionCaughtEvent(exception, { req }));

    try {
      await this.oidcProvider.abortInteraction(req, res, params);
      // You can't remove the catch argument, it's mandatory
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (abortError) {
      await this.manualRedirect({ req, res, errorDetails, exception, params });
    }
  }

  private getErrorDetails(
    exception: OidcProviderBaseRedirectException,
  ): ApiErrorMessage {
    const exceptionConstructor = getClass(exception);
    const message = exceptionConstructor.UI;
    const code = this.getExceptionCodeFor(exception);
    const id = generateErrorId();

    const error = {
      code,
      id,
      message,
    };

    return error;
  }

  /**
   * @todo FC-2184 ⚠️
   */
  // eslint-disable-next-line complexity
  private getOidcParams(
    exception: OidcProviderBaseRedirectException,
  ): OidcError {
    const { issuer } = this.config.get<OidcProviderConfig>('OidcProvider');

    const exceptionConstructor = getClass(exception);

    const params = {
      error: exception.originalError?.error || exceptionConstructor.ERROR,
      error_description:
        exception.originalError?.error_description ||
        exceptionConstructor.ERROR_DESCRIPTION,
      iss: issuer,
      state: exception.originalError?.state,
    };

    return params;
  }

  private async manualRedirect({
    req,
    res,
    errorDetails,
    exception,
    params,
  }: {
    req: Request;
    res: Response;
    errorDetails: ApiErrorMessage;
    exception: OidcProviderBaseRedirectException;
    params: OidcError;
  }) {
    const {
      query: { redirect_uri },
    } = req;

    const isAuthorizedRedirectUrl = await this.isAuthorizedRedirectUrl(
      redirect_uri as string,
    );

    if (!isAuthorizedRedirectUrl) {
      return this.errorOutput({
        error: errorDetails,
        exception,
        res,
        httpResponseCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }

    const { error, error_description, iss, state } = params;
    const httpResponseCode = this.getHttpStatus(
      exception,
      HttpStatus.TEMPORARY_REDIRECT,
    );

    const redirectUri = new URL(redirect_uri as string);

    redirectUri.searchParams.append('error', error);
    redirectUri.searchParams.append('error_description', error_description);
    redirectUri.searchParams.append('state', state);
    redirectUri.searchParams.append('iss', iss);

    res.status(httpResponseCode).redirect(redirectUri.toString());
  }

  private async isAuthorizedRedirectUrl(
    redirectUri: string | undefined,
  ): Promise<boolean> {
    if (!redirectUri) {
      return false;
    }

    const serviceProviders = await this.serviceProvider.getList();

    const found = serviceProviders.some((serviceProvider) => {
      return serviceProvider.redirect_uris.includes(redirectUri);
    });

    return found;
  }
}
