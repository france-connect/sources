import React from 'react';

import { t } from '@fc/i18n';

interface ItemsCounterComponentProps {
  count: number;
  classname?: string;
  // @TODO: remove type string later, as XX will disappear when maximum configs will be decided
  total: number | string;
}

export const ItemsCounterComponent: React.FC<ItemsCounterComponentProps> = React.memo(
  ({ classname, count, total }: ItemsCounterComponentProps) => (
    <div className={classname}>
      <h6>
        {count}
        <span className="fr-mx-1v">{t('ItemsCounterComponent.separator')}</span>
        {total}
      </h6>
    </div>
  ),
);

ItemsCounterComponent.defaultProps = {
  classname: undefined,
};

ItemsCounterComponent.displayName = 'ItemsCounterComponent';
