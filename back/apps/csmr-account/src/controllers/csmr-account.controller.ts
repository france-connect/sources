import { Controller, UsePipes, ValidationPipe } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

import { AccountService } from '@fc/account';
import { FSA } from '@fc/common';
import { LoggerService } from '@fc/logger-legacy';
import { AccountProtocol } from '@fc/microservices';

import { GetAccountIdPayloadDto } from '../dto';

@Controller()
export class CsmrAccountController {
  constructor(
    private readonly logger: LoggerService,
    private readonly account: AccountService,
  ) {
    this.logger.setContext(this.constructor.name);
  }

  @MessagePattern(AccountProtocol.Commands.GET_ACCOUNT_ID)
  @UsePipes(
    new ValidationPipe({
      forbidNonWhitelisted: true,
      forbidUnknownValues: true,
      whitelist: true,
    }),
  )
  async getAccountId(
    /**
     * @todo add Dto validation and typing
     *
     * Author: Hugues Charleux & Arnaud PSA
     * Date: 20/06/22
     */
    @Payload() payload: GetAccountIdPayloadDto,
  ): Promise<FSA<undefined, string> | 'ERROR'> {
    this.logger.debug(
      `New message received with pattern "${AccountProtocol.Commands.GET_ACCOUNT_ID}"`,
    );

    this.logger.trace({ payload });

    const { identityHash } = payload;

    try {
      const { id } = await this.account.getAccountByIdentityHash(identityHash);

      const type = AccountProtocol.Commands.GET_ACCOUNT_ID;
      const payload = id;

      return { type, payload };
    } catch (error) {
      this.logger.error({ error });
      /**
       * @todo #825 implement Error protocol
       */
      return 'ERROR';
    }
  }
}
