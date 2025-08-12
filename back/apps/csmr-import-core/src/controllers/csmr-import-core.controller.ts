import { Controller, UsePipes, ValidationPipe } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

import {
  ActionTypes,
  CsmrImportCoreMessageDto,
} from '@fc/csmr-import-core-client/protocol';
import { LoggerService } from '@fc/logger';

import { CsmrImportCoreExecutionReportInterface } from '../interfaces';
import { CsmrImportCoreService } from '../services';

@Controller()
export class CsmrImportCoreController {
  constructor(
    private readonly logger: LoggerService,
    private readonly importService: CsmrImportCoreService,
  ) {}

  @MessagePattern(ActionTypes.SP_IMPORT)
  @UsePipes(
    new ValidationPipe({
      forbidNonWhitelisted: true,
      forbidUnknownValues: true,
      whitelist: true,
    }),
  )
  async importServiceProvider(
    @Payload() { payload, user }: CsmrImportCoreMessageDto,
  ): Promise<CsmrImportCoreExecutionReportInterface[] | 'ERROR'> {
    try {
      const response =
        await this.importService.validateAndCreateServiceProvider(
          payload,
          user,
        );

      this.logger.debug({ response });

      return response;
    } catch (error) {
      this.logger.err({ error });
      return 'ERROR';
    }
  }
}
