import { useToggle } from 'usehooks-ts';

import { t } from '@fc/i18n';

interface BreadCrumbsToggleButtonProps {
  id: string;
}

export const BreadCrumbsToggleButton = ({ id }: BreadCrumbsToggleButtonProps) => {
  const [show, toggleShow] = useToggle(false);

  return (
    <button
      aria-controls={id}
      aria-expanded={show}
      className="fr-breadcrumb__button"
      onClick={toggleShow}>
      {t('DSFR.breadcrumbs.show')}
    </button>
  );
};

BreadCrumbsToggleButton.displayName = 'BreadCrumbsToggleButton';
