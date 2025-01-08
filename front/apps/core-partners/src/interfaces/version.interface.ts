import type { AnyObjectInterface, ISODate } from '@fc/common';

import type { PublicationStatus } from '../enums';

export interface VersionInterface {
  id: string;
  createdAt: ISODate;
  updatedAt: ISODate;
  publicationStatus: PublicationStatus;
  data: AnyObjectInterface<string>;
}
