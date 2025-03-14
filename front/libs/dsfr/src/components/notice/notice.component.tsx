import React from 'react';

import type { NavigationLinkInterface } from '@fc/common';
import { t } from '@fc/i18n';

interface NoticeComponentProps {
  title: string;
  description?: string;
  onClose?: () => void;
  link?: NavigationLinkInterface;
}

export const NoticeComponent = React.memo(
  ({ description, link, onClose, title }: NoticeComponentProps) => {
    const closeLabel = (onClose && t('DSFR.notice.close')) || undefined;
    const linkTitle = link?.title ? `${link.title} - ${t('FC.Common.newWindow')}` : undefined;

    return (
      <div className="fr-notice fr-notice--info">
        <div className="fr-container">
          <div className="fr-notice__body">
            <p>
              <span className="fr-notice__title">{title}</span>
              {description && <span className="fr-notice__desc">{description}</span>}
              {link && (
                <a
                  className="fr-notice__link"
                  href={link.href}
                  rel="noopener external noreferrer"
                  target="_blank"
                  title={linkTitle}>
                  {link.label}
                </a>
              )}
            </p>
            {!!onClose && (
              <button className="fr-btn--close fr-btn" title={closeLabel} onClick={onClose}>
                {closeLabel}
              </button>
            )}
          </div>
        </div>
      </div>
    );
  },
);

NoticeComponent.displayName = 'NoticeComponent';
