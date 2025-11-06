import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { CryptographyModule } from '@fc/cryptography';
import { MongooseModule } from '@fc/mongoose';
import { MongooseChangeStreamModule } from '@fc/mongoose-change-stream';

import { DataProviderSchema } from './schemas';
import { DataProviderAdapterMongoService } from './services';

@Module({
  imports: [
    CryptographyModule,
    MongooseModule.forFeature([
      { name: 'DataProvider', schema: DataProviderSchema },
    ]),
    MongooseChangeStreamModule,
    CqrsModule,
  ],
  providers: [DataProviderAdapterMongoService],
  exports: [DataProviderAdapterMongoService],
})
export class DataProviderAdapterMongoModule {}
