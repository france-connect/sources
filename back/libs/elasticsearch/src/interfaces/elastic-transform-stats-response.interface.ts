import { TransformStatesEnum } from '../enums';

export interface ElasticTransformStatsEntry {
  id?: string;
  state?: TransformStatesEnum;
  stats?: {
    // elastic defined property
    // eslint-disable-next-line @typescript-eslint/naming-convention
    documents_indexed?: number;
  };
  checkpointing?: {
    last?: {
      checkpoint?: number;
    };
  };
  reason?: string;
}

export interface ElasticTransformStatsResponse {
  count: number;
  transforms: ElasticTransformStatsEntry[];
}
