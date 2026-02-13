import { Module } from '@nestjs/common';

import { ElasticControlModule } from '@fc/elasticsearch';

import {
  ElasticReindexCommand,
  ElasticReindexWatcherCommand,
  ElasticTransformCommand,
  ElasticTransformWatcherCommand,
} from './commands';
import {
  CommandElasticReindexService,
  CommandElasticTransformService,
} from './services';

@Module({
  imports: [ElasticControlModule],
  providers: [
    ElasticTransformCommand,
    ElasticReindexCommand,
    CommandElasticTransformService,
    CommandElasticReindexService,
    ElasticTransformWatcherCommand,
    ElasticReindexWatcherCommand,
  ],
})
export class CommandElasticModule {}
