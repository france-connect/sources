/* istanbul ignore file */

// Declarative code
import { IsBoolean, IsOptional } from 'class-validator';

import { AppSession as AppSessionGeneric } from '@fc/app';

export class AppSession extends AppSessionGeneric {
  @IsBoolean()
  @IsOptional()
  readonly isSuspicious?: boolean;
}
