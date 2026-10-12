import { DeleteContributorModalComponent, DeleteInstanceModalComponent } from '@fc/core-partners';
import type { ModalConfigInterface } from '@fc/modal';

export const Modal: ModalConfigInterface = {
  registry: {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    'delete-contributor': DeleteContributorModalComponent,
    // eslint-disable-next-line @typescript-eslint/naming-convention
    'delete-instance': DeleteInstanceModalComponent,
  },
};
