import { ClassTransformOptions } from 'class-transformer';
import { ValidationError, ValidatorOptions } from 'class-validator';

import { Injectable } from '@nestjs/common';

import { COG_FRANCE, validateCog } from '@fc/cog';
import { validateDto } from '@fc/common';
import { FeatureHandler } from '@fc/feature-handler';
import { LoggerService } from '@fc/logger';
import { OidcClientSession } from '@fc/oidc-client';
import { SessionService } from '@fc/session';

import { OidcIdentityDto } from '../../dto';
import { IIdentityCheckFeatureHandler } from '../../interfaces';

@Injectable()
@FeatureHandler('core-fcp-default-identity-check')
export class CoreFcpDefaultIdentityCheckHandler
  implements IIdentityCheckFeatureHandler
{
  constructor(
    public readonly logger: LoggerService,
    public readonly session: SessionService,
  ) {}

  async handle(identity: Partial<OidcIdentityDto>): Promise<ValidationError[]> {
    this.logger.debug('Identity Check: ##### core-fcp-default-identity-check');
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
      OidcIdentityDto,
      validatorOptions,
      transformOptions,
    );

    /**
     * Temporary log to detect anomalies
     * @todo #1900 Analyze collected data and remove log
     */
    this.logBirthPlaceWithBirthcountryAnomaly(identity);

    return errors;
  }

  private logBirthPlaceWithBirthcountryAnomaly(
    identity: Partial<OidcIdentityDto>,
  ) {
    const { birthcountry, birthplace } = identity;

    if (birthcountry !== COG_FRANCE && birthplace) {
      const isCog = validateCog(birthplace);
      const { idpId, spId } = this.session.get<OidcClientSession>('OidcClient');

      this.logger.warning({
        msg: 'Anomaly detected: birthplace is set but birthcountry is not France COG',
        isCog,
        idpId,
        spId,
        birthplace,
        birthcountry,
      });
    }
  }
}
