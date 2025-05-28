import { Status } from '../enums';
import { CsmrImportCoreServiceProviderInterface } from './csmr-import-core-service-provider.interface';

export interface CsmrImportCoreExecutionReportInterface
  extends CsmrImportCoreServiceProviderInterface {
  status: Status;
  comments: string;
  client_id: string;
  client_secret: string;
}
