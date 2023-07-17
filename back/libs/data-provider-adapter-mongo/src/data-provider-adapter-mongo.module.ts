import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { CryptographyModule } from '@fc/cryptography';
import { MongooseModule } from '@fc/mongoose';

import { DataProviderSchema } from './schemas';
import { DataProviderAdapterMongoService } from './services';

@Module({
  imports: [
    CryptographyModule,
    MongooseModule.forFeature([
      { name: 'DataProvider', schema: DataProviderSchema },
    ]),
    CqrsModule,
  ],
  providers: [DataProviderAdapterMongoService],
  exports: [DataProviderAdapterMongoService],
})
export class DataProviderAdapterMongoModule {}
