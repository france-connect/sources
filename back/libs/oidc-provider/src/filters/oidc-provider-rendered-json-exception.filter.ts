import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  Injectable,
} from '@nestjs/common';

import { ApiErrorParams } from '@fc/app';
import { FcWebJsonExceptionFilter } from '@fc/exceptions/filters';

import { OidcProviderConfig } from '../dto';
import { OidcProviderBaseRenderedException } from '../exceptions';

@Catch(OidcProviderBaseRenderedException)
@Injectable()
export class OidcProviderRenderedJsonExceptionFilter
  extends FcWebJsonExceptionFilter
  implements ExceptionFilter
{
  catch(exception: OidcProviderBaseRenderedException, host: ArgumentsHost) {
    if (exception.originalError?.caught) {
      return;
    }

    if (exception.originalError) {
      exception.originalError.caught = true;
    }

    super.catch(exception, host);
  }

  protected errorOutput(errorParam: ApiErrorParams): void {
    const {
      httpResponseCode,
      error: { code, id },
      res,
      exception,
    } = errorParam;
    const { error, error_description, error_detail } = exception as any;

    const { errorUriBase } =
      this.config.get<OidcProviderConfig>('OidcProvider');

    res.status(httpResponseCode);
    res.json({
      error,
      error_description: `${error_description} (${error_detail})`,
      error_uri: `${errorUriBase}?code=${code}&id=${id}`,
    });
  }
}
