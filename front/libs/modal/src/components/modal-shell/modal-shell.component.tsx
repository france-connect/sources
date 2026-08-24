import './modal-shell.component.scss';

import type { PropsWithChildren, ReactNode } from 'react';
import React from 'react';
import { createPortal } from 'react-dom';

import { HeadingTag } from '@fc/common';

import { useModalShell } from '../../hooks';
import { ModalFooterComponent } from '../modal-footer';
import { ModalHeaderComponent } from '../modal-header';
import { ModalTitleComponent } from '../modal-title';

interface ModalShellProps extends PropsWithChildren {
  dataTestId?: string;
  footer?: ReactNode;
  id: string;
  onClose: () => void;
  title?: ReactNode;
  titleHeading?: HeadingTag;
  titleId?: string;
}

// @NOTE the props are destructured inside the component body
// to avoid a react/prop-types ESLint false positive with React.memo
export const ModalShellComponent = React.memo((props: ModalShellProps) => {
  const {
    children,
    dataTestId,
    footer,
    id,
    onClose,
    title,
    titleHeading = HeadingTag.H1,
    titleId,
  } = props;

  const { dialogRef, handleCancel, resolvedTitleId } = useModalShell({
    id,
    onClose,
    titleId,
  });

  return createPortal(
    <dialog
      ref={dialogRef}
      aria-labelledby={title ? resolvedTitleId : undefined}
      className="fr-modal fr-modal--opened"
      data-testid={dataTestId}
      id={id}
      onCancel={handleCancel}>
      <div className="fr-container fr-container--fluid fr-container-md">
        <div className="fr-grid-row fr-grid-row--center fr-grid-row--gutters">
          <div className="fr-col-12 fr-col-md-8 fr-col-lg-6">
            <div className="fr-modal__body">
              <ModalHeaderComponent id={id} onClose={onClose} />
              <div className="fr-modal__content">
                {title && (
                  <ModalTitleComponent heading={titleHeading} id={resolvedTitleId}>
                    {title}
                  </ModalTitleComponent>
                )}
                {children}
              </div>
              {footer && <ModalFooterComponent>{footer}</ModalFooterComponent>}
            </div>
          </div>
        </div>
      </div>
    </dialog>,
    document.body,
  );
});

ModalShellComponent.displayName = 'ModalShellComponent';
