import {
  ElasticControlReindexOptionsDto,
  ElasticControlTransformOptionsDto,
} from '../dto';
import { ControlStatesEnum, ElasticOperationsEnum } from '../enums';

export interface ControlDocumentInterface {
  id: string;
  operation: ElasticOperationsEnum;
  state: ControlStatesEnum;
  createdAt: string;
  updatedAt: string;
  options: ElasticControlTransformOptionsDto | ElasticControlReindexOptionsDto;
  status?: Record<string, unknown>;
}
