/* istanbul ignore file */

// Declarative code
import { Expose } from 'class-transformer';
import { IsBoolean, IsOptional } from 'class-validator';

import { AppSession as AppSessionGeneric } from '@fc/app';

export class AppSession extends AppSessionGeneric {
  @IsBoolean()
  @IsOptional()
  @Expose()
  readonly isSuspicious?: boolean;
}
