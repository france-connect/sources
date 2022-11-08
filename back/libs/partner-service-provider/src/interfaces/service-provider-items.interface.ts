/* istanbul ignore file */

// Declarative file
import { uuid } from '@fc/common';

import { Datapass, Organisation, Platform } from '.';

export interface IServiceProviderItem {
  id: uuid;
  name: string;
  platform: Pick<Platform, 'name'>;
  status: string;
  organisation: Pick<Organisation, 'name'>;
  datapasses: Pick<Datapass, 'remoteId'>[];
  createdAt: Date;
  updatedAt: Date;
}
