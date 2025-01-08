import { useId } from 'react';

import type { NavigationLinkInterface } from '@fc/common';
import { t } from '@fc/i18n';

import { BreadCrumbComponent } from './breadcrumb';
import { BreadCrumbsToggleButton } from './button';

interface BreadCrumbsComponentProps {
  items: NavigationLinkInterface[];
}

export const BreadCrumbsComponent = ({ items }: BreadCrumbsComponentProps) => {
  const uniqId = useId();
  const breacrumbsUniqId = `breadcrumbs::${uniqId}`;

  return (
    <nav aria-label={t('DSFR.breadcrumbs.location')} className="fr-breadcrumb" role="navigation">
      <BreadCrumbsToggleButton id={breacrumbsUniqId} />
      <div className="fr-collapse" data-testid={breacrumbsUniqId} id={breacrumbsUniqId}>
        <ol className="fr-breadcrumb__list">
          {items.map((item, index) => {
            const isCurrentPage = index === items.length - 1;
            const key = `${breacrumbsUniqId}::crumb::${index}`;
            // @NOTE BreadCrumbComponent extends NavigationLinkInterface
            // eslint-disable-next-line react/jsx-props-no-spreading
            return <BreadCrumbComponent {...item} key={key} isCurrent={isCurrentPage} />;
          })}
        </ol>
      </div>
    </nav>
  );
};

BreadCrumbsComponent.displayName = 'BreadCrumbsComponent';
