/* istanbul ignore file */

// Tested by DTO
import { Module } from '@nestjs/common';

import { EidasCountryService } from './eidas-country.service';

@Module({
  providers: [EidasCountryService],
  exports: [EidasCountryService],
})
export class EidasCountryModule {}
