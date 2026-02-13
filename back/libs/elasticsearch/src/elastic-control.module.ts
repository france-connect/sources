import { Module } from '@nestjs/common';

import { ElasticsearchModule } from './elasticsearch.module';
import {
  ElasticControlClientService,
  ElasticControlDestIndexService,
  ElasticControlDocumentService,
  ElasticControlReindexService,
  ElasticControlTransformService,
} from './services';

@Module({
  imports: [ElasticsearchModule.register()],
  providers: [
    ElasticControlTransformService,
    ElasticControlClientService,
    ElasticControlDocumentService,
    ElasticControlDestIndexService,
    ElasticControlReindexService,
  ],
  exports: [
    ElasticControlTransformService,
    ElasticControlDocumentService,
    ElasticControlDestIndexService,
    ElasticControlReindexService,
  ],
})
export class ElasticControlModule {}
