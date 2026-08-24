import { Module } from '@nestjs/common';

import { CogModule } from '@fc/cog';

import { InseeResolver } from './resolvers';
import { EudiCogService } from './services';

@Module({
  imports: [CogModule],
  providers: [EudiCogService, InseeResolver],
  exports: [EudiCogService],
})
export class EudiCogModule {}
