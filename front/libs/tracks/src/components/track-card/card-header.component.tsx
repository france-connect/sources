import { DateTime } from 'luxon';
import React from 'react';
import { AiOutlineMinus as MinusIcon, AiOutlinePlus as PlusIcon } from 'react-icons/ai';

import { TracksConfig } from '../../interfaces';

type TraceCardHeaderProps = {
  datetime: DateTime;
  serviceProviderLabel: string;
  opened: boolean;
  options: TracksConfig;
};

export const TrackCardHeaderComponent = React.memo(
  ({ datetime, opened, options, serviceProviderLabel }: TraceCardHeaderProps) => {
    const formattedDay = datetime.toFormat(options.LUXON_FORMAT_DAY);
    return (
      <div className="fr-pt-3v flex-columns flex-between items-center">
        <div>
          <div className="is-dark-grey fr-text--xs fr-mb-1v">{formattedDay}</div>
          <div className="is-blue-france fr-text--lg fr-mb-0">
            <b>{serviceProviderLabel}</b>
          </div>
        </div>
        <div>
          {/* @TODO replace color value with DSFR CSS Modules-Variable value */}
          {opened && <MinusIcon color="#034ea2" size={30} title="Icone moins" />}
          {!opened && <PlusIcon color="#034ea2" size={30} title="Icone plus" />}
        </div>
      </div>
    );
  },
);

TrackCardHeaderComponent.displayName = 'TraceCardHeaderComponent';
