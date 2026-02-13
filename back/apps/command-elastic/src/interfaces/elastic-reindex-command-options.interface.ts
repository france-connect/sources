import {
  ElasticControlKeyEnum,
  ElasticControlPivotEnum,
  ElasticControlProductEnum,
  ElasticControlRangeEnum,
} from '@fc/elasticsearch';

export interface ElasticReindexCommandOptionsInterface {
  key: ElasticControlKeyEnum;
  product: ElasticControlProductEnum;
  pivot: ElasticControlPivotEnum;
  range: ElasticControlRangeEnum;
  period?: string;
  dryRun?: boolean;
  force?: boolean;
}
