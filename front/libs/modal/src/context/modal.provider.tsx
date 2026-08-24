import { type PropsWithChildren, useCallback, useMemo, useState } from 'react';

import { ConfigService } from '@fc/config';
import { t } from '@fc/i18n';

import { ModalShellComponent } from '../components/modal-shell';
import { ModalOptions } from '../enums';
import type { ModalConfigInterface, ModalEntryInterface } from '../interfaces';
import { ModalContext } from './modal.context';

export const ModalProvider = ({ children }: Required<PropsWithChildren>) => {
  const { registry } = ConfigService.get<ModalConfigInterface>(ModalOptions.CONFIG_NAME);

  const [currentModal, setCurrentModal] = useState<ModalEntryInterface | null>(null);

  const openModal = useCallback(
    <T extends Record<string, unknown>>(id: string, props: T) => {
      if (!registry[id]) {
        return;
      }
      setCurrentModal({ id, props });
    },
    [registry],
  );

  const closeModal = useCallback(() => {
    setCurrentModal(null);
  }, []);

  const contextValue = useMemo(
    () => ({
      closeModal,
      currentModal,
      openModal,
    }),
    [closeModal, currentModal, openModal],
  );

  const modalEntry = currentModal ? registry[currentModal.id] : null;

  return (
    <ModalContext.Provider value={contextValue}>
      {children}
      {currentModal && modalEntry && (
        <ModalShellComponent
          footer={
            modalEntry.footer && (
              // eslint-disable-next-line react/jsx-props-no-spreading
              <modalEntry.footer {...currentModal.props} onClose={closeModal} />
            )
          }
          id={currentModal.id}
          title={t(modalEntry.title)}
          titleHeading={modalEntry.titleHeading}
          onClose={closeModal}>
          {/* eslint-disable-next-line react/jsx-props-no-spreading */}
          <modalEntry.component {...currentModal.props} onClose={closeModal} />
        </ModalShellComponent>
      )}
    </ModalContext.Provider>
  );
};
