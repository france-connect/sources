import { DateTime } from 'luxon';
import React from 'react';
import { AiOutlineMinus as MinusIcon, AiOutlinePlus as PlusIcon } from 'react-icons/ai';

import { TracksConfig } from '../../interfaces';

type TraceCardHeaderProps = {
  datetime: DateTime;
  serviceProviderName: string;
  opened: boolean;
  options: TracksConfig;
};

export const TrackCardHeaderComponent = React.memo(
  ({ datetime, opened, options, serviceProviderName }: TraceCardHeaderProps) => {
    const formattedDay = datetime.toFormat(options.LUXON_FORMAT_DAY);
    return (
      <div className="pt12 flex-columns flex-between items-center">
        <div>
          <div className="is-dark-grey fr-text-xs mb4">{formattedDay}</div>
          <div className="is-blue-france fr-text-lg">
            <b>{serviceProviderName}</b>
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
