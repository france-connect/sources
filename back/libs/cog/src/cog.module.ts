/* istanbul ignore file */

// Declarative code
import { Module } from '@nestjs/common';

import { CsvService } from '@fc/csv/services';
import { LoggerService } from '@fc/logger';

import { CogService } from './cog.service';
import { CityDto, CountryDto } from './dto';
import { COG_CITY, COG_COUNTRY } from './tokens';

@Module({
  exports: [CogService],
  providers: [
    CogService,
    /**
     * we need 2 instances of CSV Repository Services
     * each one corresponds to a database validated
     * by its own Dto.
     */
    {
      inject: [LoggerService],
      provide: COG_CITY,
      useFactory: (logger: LoggerService) => new CsvService(logger, CityDto),
    },
    {
      inject: [LoggerService],
      provide: COG_COUNTRY,
      useFactory: (logger: LoggerService) => new CsvService(logger, CountryDto),
    },
  ],
})
export class CogModule {}
