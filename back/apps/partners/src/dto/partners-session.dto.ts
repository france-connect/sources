/* istanbul ignore file */

// Declarative code
import { Type } from 'class-transformer';
import { IsObject, ValidateNested } from 'class-validator';

import { PartnerAccountSession } from '@fc/partner-account';

export class PartnersSession {
  @IsObject()
  @ValidateNested()
  @Type(() => PartnerAccountSession)
  readonly partnerAccount: PartnerAccountSession;
}
