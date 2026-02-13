import {
  ElasticControlPivotEnum,
  ElasticControlProductEnum,
  ElasticControlRangeEnum,
} from '@fc/elasticsearch';

export interface ElasticTransformCommandOptionsInterface {
  product: ElasticControlProductEnum;
  pivot: ElasticControlPivotEnum;
  range: ElasticControlRangeEnum;
  period?: string;
  dryRun?: boolean;
  force?: boolean;
}
