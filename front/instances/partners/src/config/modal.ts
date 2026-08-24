import {
  DeleteInstanceModalComponent,
  DeleteInstanceModalFooterComponent,
} from '@fc/core-partners';
import type { ModalConfigInterface } from '@fc/modal';

export const Modal: ModalConfigInterface = {
  registry: {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    'delete-instance': {
      component: DeleteInstanceModalComponent,
      footer: DeleteInstanceModalFooterComponent,
      title: 'Partners.serviceProviderPage.sandboxes.deleteModal.title',
    },
  },
};
