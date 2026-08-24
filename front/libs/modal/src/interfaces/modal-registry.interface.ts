import type { ComponentType } from 'react';

import type { HeadingTag } from '@fc/common';

export interface ModalContentProps {
  onClose: () => void;
}

export interface ModalRegistryEntryInterface {
  // @NOTE the registry holds heterogeneous modals: each one may require its own
  // props on top of `onClose`. Props contravariance rules out a strict shared
  // type, so any component is accepted.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  component: ComponentType<any>;
  // @NOTE the DSFR footer must be a sibling of `fr-modal__content`, its negative
  // top margin overlaps the content when it is nested into it
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  footer?: ComponentType<any>;
  // @NOTE i18n key
  title: string;
  titleHeading?: HeadingTag;
}

export type ModalRegistryInterface = Record<string, ModalRegistryEntryInterface>;
