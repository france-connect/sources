import { ClassTransformOptions } from 'class-transformer';
import { ValidationError, ValidatorOptions } from 'class-validator';

import { Injectable } from '@nestjs/common';

import { validateDto } from '@fc/common';
import { FeatureHandler } from '@fc/feature-handler';
import { LoggerService } from '@fc/logger';

import { EidasIdentityDto } from '../../dto';
import { IIdentityCheckFeatureHandler } from '../../interfaces';

@Injectable()
@FeatureHandler('core-fcp-eidas-identity-check')
export class CoreFcpEidasIdentityCheckHandler
  implements IIdentityCheckFeatureHandler
{
  constructor(private readonly logger: LoggerService) {}

  async handle(
    identity: Partial<EidasIdentityDto>,
  ): Promise<ValidationError[]> {
    this.logger.debug('Identity Check: ##### core-fcp-eidas-identity-check');
    const validatorOptions: ValidatorOptions = {
      whitelist: true,
      forbidNonWhitelisted: true,
      forbidUnknownValues: true,
    };
    const transformOptions: ClassTransformOptions = {
      excludeExtraneousValues: true,
    };
    const errors = await validateDto(
      identity,
      EidasIdentityDto,
      validatorOptions,
      transformOptions,
    );

    return errors;
  }
}
