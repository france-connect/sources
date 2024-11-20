import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  Injectable,
} from '@nestjs/common';

import { ExceptionCaughtEvent } from '@fc/exceptions/events';
import { FcWebHtmlExceptionFilter } from '@fc/exceptions/filters';
import { generateErrorId } from '@fc/exceptions/helpers';

import { OidcProviderBaseRenderedException } from '../exceptions';

const NOT_REDIRECTABLE_ERRORS = [
  'invalid_client',
  'invalid_redirect_uri',
  'invalid_request',
];
const NOT_REDIRECTABLE_ERROR_DESCRIPTIONS = [
  'client is invalid',
  "redirect_uri did not match any of the client's registered redirect_uris",
  "missing required parameter 'redirect_uri'",
  /unrecognized route or not allowed method .+/,
];

@Catch(OidcProviderBaseRenderedException)
@Injectable()
export class OidcProviderRenderedHtmlExceptionFilter
  extends FcWebHtmlExceptionFilter
  implements ExceptionFilter
{
  catch(exception: OidcProviderBaseRenderedException, host: ArgumentsHost) {
    if (exception.originalError?.caught) {
      return;
    }

    if (exception.originalError) {
      exception.originalError.caught = true;
    }

    if (this.shouldNotRedirect(exception)) {
      return super.catch(exception, host);
    }

    const ctx = host.switchToHttp();
    const req = ctx.getRequest();
    const code = this.getExceptionCodeFor(exception);
    const id = generateErrorId();

    this.logException(code, id, exception);
    this.eventBus.publish(new ExceptionCaughtEvent(exception, { req }));
  }

  private shouldNotRedirect(exception: OidcProviderBaseRenderedException) {
    return this.isListed(exception);
  }

  private isListed(exception: OidcProviderBaseRenderedException) {
    if (!exception.originalError) {
      return false;
    }

    const { error, error_description } = exception.originalError;

    return (
      NOT_REDIRECTABLE_ERRORS.includes(error) &&
      NOT_REDIRECTABLE_ERROR_DESCRIPTIONS.some((description) => {
        if (description instanceof RegExp) {
          return description.test(error_description);
        }
        return description === error_description;
      })
    );
  }
}
