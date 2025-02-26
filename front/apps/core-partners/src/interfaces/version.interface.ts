import type { AnyObjectInterface, ISODate } from '@fc/common';

import type { PublicationStatus } from '../enums';

export interface VersionInterface {
  id: string;
  createdAt: ISODate;
  updatedAt: ISODate;
  publicationStatus: PublicationStatus;
  data: {
    // @NOTE API interface
    // eslint-disable-next-line @typescript-eslint/naming-convention
    client_id?: string;
    // @NOTE API interface
    // eslint-disable-next-line @typescript-eslint/naming-convention
    client_secret?: string;
  } & AnyObjectInterface<string>;
}
