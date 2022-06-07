/* istanbul ignore file */

// Declarative code
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ConfigService } from '@fc/config';

import { PostgresService } from './postgres.service';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: (config: ConfigService) => config.get('Postgres'),
      inject: [ConfigService],
    }),
  ],
  providers: [PostgresService],
  exports: [PostgresService],
})
export class PostgresModule {}
