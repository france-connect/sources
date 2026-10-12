import classnames from 'classnames';
import React from 'react';

interface SummaryTableComponentProps {
  caption: string;
  id: string;
  multiline?: boolean;
  sources: { label: string; value?: string }[];
}

export const SummaryTableComponent = React.memo(
  ({ caption, id, multiline = false, sources }: SummaryTableComponentProps) => (
    <div
      className={classnames('fr-table', {
        // @NOTE this a DSFR class name
        // eslint-disable-next-line @typescript-eslint/naming-convention
        'fr-table--multiline': multiline,
      })}
      id={id}>
      <div className="fr-table__wrapper">
        <div className="fr-table__container">
          <div className="fr-table__content">
            <table>
              <caption>{caption}</caption>
              <tbody>
                {sources.map((source, index) => (
                  <tr key={source.label} data-row-key={index} id={`${id}-row-key-${index}`}>
                    <td>{source.label}</td>
                    {source.value && <td>{source.value}</td>}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  ),
);

SummaryTableComponent.displayName = 'SummaryTableComponent';
