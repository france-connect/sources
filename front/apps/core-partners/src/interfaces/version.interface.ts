import type { AnyObjectInterface, EntityBaseInterface, PublicationStatus } from '@fc/common';

export interface VersionInterface extends EntityBaseInterface {
  publicationStatus: PublicationStatus;
  data: {
    name: string;
    // @NOTE API interface
    // eslint-disable-next-line @typescript-eslint/naming-convention
    client_id?: string;
    // @NOTE API interface
    // eslint-disable-next-line @typescript-eslint/naming-convention
    client_secret?: string;
  } & AnyObjectInterface<string>;
}
