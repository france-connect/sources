import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';

import { DataProviderAdapterMongoService } from '@fc/data-provider-adapter-mongo';
import { LoggerService } from '@fc/logger-legacy';

import { ChecktokenRequestDto } from '../dto';
import { DataProviderRoutes } from '../enums';
import { DataProviderService } from '../services';

@Controller()
export class DataProviderController {
  constructor(
    private readonly logger: LoggerService,
    private readonly dataProviderService: DataProviderService,
    private readonly dataProviderAdapter: DataProviderAdapterMongoService,
  ) {
    this.logger.setContext(this.constructor.name);
  }

  @Post(DataProviderRoutes.CHECKTOKEN)
  async checktoken(
    @Res() res,
    @Body() bodyChecktokenRequest: ChecktokenRequestDto,
  ) {
    const payload = { testKey: 'testValue' };

    let jwt: string;

    const { client_id: clientId, client_secret: clientSecret } =
      bodyChecktokenRequest;
    try {
      await this.dataProviderService.checkRequestValid(bodyChecktokenRequest);
      await this.dataProviderAdapter.checkAuthentication(
        clientId,
        clientSecret,
      );

      jwt = await this.dataProviderService.generateJwt(payload, clientId);
    } catch (exception) {
      const { error, message, httpStatusCode } = exception;
      this.logger.debug(
        `POST checktoken error in data-provider-controller : ${exception}`,
      );
      const result = {
        error,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        error_description: message,
      };
      return res.status(httpStatusCode).json(result);
    }

    this.logger.trace({ jwt });
    return res.status(HttpStatus.OK).send(jwt);
  }
}
