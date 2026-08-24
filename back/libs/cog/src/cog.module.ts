import { Module } from '@nestjs/common';

import { CsvService } from '@fc/csv/services';
import { LoggerService } from '@fc/logger';

import { CogService } from './cog.service';
import { CityDto, CountryDto, IsoCogCountryDto } from './dto';
import { COG_CITY, COG_COUNTRY, COG_ISO_COUNTRY } from './tokens';

@Module({
  exports: [CogService],
  providers: [
    CogService,
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
    {
      inject: [LoggerService],
      provide: COG_ISO_COUNTRY,
      useFactory: (logger: LoggerService) =>
        new CsvService(logger, IsoCogCountryDto),
    },
  ],
})
export class CogModule {}
