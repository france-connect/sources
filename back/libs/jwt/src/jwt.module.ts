import { HttpModule } from '@nestjs/axios';
import { DynamicModule, Module, ModuleMetadata, Type } from '@nestjs/common';

import { JwtService } from './services';

@Module({})
export class JwtModule {
  static register(SignAdapterModule: Type<ModuleMetadata>): DynamicModule {
    return {
      module: JwtModule,
      imports: [HttpModule, SignAdapterModule],
      providers: [JwtService],
      exports: [JwtService],
    };
  }
}
