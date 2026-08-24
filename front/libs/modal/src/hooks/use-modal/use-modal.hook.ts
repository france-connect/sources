import { useSafeContext } from '@fc/common';

import { ModalContext } from '../../context/modal.context';
import type { ModalContextStateInterface } from '../../interfaces';

export const useModal = (): ModalContextStateInterface => useSafeContext(ModalContext);
