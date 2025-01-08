import { Link } from 'react-router-dom';

import type { NavigationLinkInterface } from '@fc/common';

interface BreadCrumbComponentProps extends NavigationLinkInterface {
  isCurrent?: boolean;
}

export const BreadCrumbComponent = ({
  href,
  isCurrent = false,
  label,
  title,
}: BreadCrumbComponentProps) => (
  <li>
    <Link
      aria-current={isCurrent ? 'page' : undefined}
      className="fr-breadcrumb__link"
      title={title}
      to={href}>
      {label}
    </Link>
  </li>
);

BreadCrumbComponent.displayName = 'BreadCrumbComponent';
