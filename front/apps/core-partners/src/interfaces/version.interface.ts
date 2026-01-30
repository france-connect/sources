import type { AnyObjectInterface, ISODate, PublicationStatus, UUIDType } from '@fc/common';

export interface VersionInterface {
  id: UUIDType;
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
