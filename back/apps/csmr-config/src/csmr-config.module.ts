import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { AppModule } from '@fc/app';
import { MicroservicesRmqModule } from '@fc/microservices-rmq';

import { CsmrConfigController } from './controllers';
import { CsmrConfigService } from './services';
import { CONFIG_DATABASE_SERVICE } from './tokens';

@Module({})
export class CsmrConfigModule {
  static register(databaseAdapter: any) {
    const customProvider = {
      provide: CONFIG_DATABASE_SERVICE,
      useClass: databaseAdapter.provider,
    };

    return {
      module: CsmrConfigModule,
      imports: [
        CqrsModule,
        AppModule,
        MicroservicesRmqModule.forSubscriber(),
        ...databaseAdapter.imports,
      ],
      providers: [customProvider, CsmrConfigService],
      exports: [CsmrConfigService, customProvider],
      controllers: [CsmrConfigController],
    };
  }
}
