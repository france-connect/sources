import { Module } from '@nestjs/common';

import { AppModule } from '@fc/app';
import { CsmrHsmClientModule } from '@fc/csmr-hsm-client';
import { MicroservicesRmqModule } from '@fc/microservices-rmq';
import { ScopesModule } from '@fc/scopes';

import { CsmrImportCoreController } from './controllers';
import { CsmrImportCoreService } from './services';
import { CONFIG_DATABASE_SERVICE } from './tokens';

@Module({})
export class CsmrImportCoreModule {
  static register(databaseAdapter: any) {
    const customProvider = {
      provide: CONFIG_DATABASE_SERVICE,
      useClass: databaseAdapter.provider,
    };

    return {
      module: CsmrImportCoreModule,
      imports: [
        AppModule,
        CsmrHsmClientModule,
        ScopesModule.forConfig('FcpLow'),
        MicroservicesRmqModule.forSubscriber(),
        ...databaseAdapter.imports,
      ],
      providers: [customProvider, CsmrImportCoreService],
      exports: [CsmrImportCoreService, customProvider],
      controllers: [CsmrImportCoreController],
    };
  }
}
