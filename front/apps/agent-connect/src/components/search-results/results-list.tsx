import React from 'react';

import { useSelector } from 'react-redux';

import { Ministry, RootState } from '../../types';
import ResultItem from './result-item';
import './results-list.scss';

type SearchResultsProps = {
  results: Ministry[];
};

const SearchResultsComponent = React.memo(
  ({ results }: SearchResultsProps): JSX.Element => {
    const identityProviders = useSelector(
      (_: RootState) => _.identityProviders,
    );

    return (
      <div
        className="v-align-middle text-left content-wrapper-md"
        id="identity-provider-result"
      >
        <h4 className="is-bold is-blue-agentconnect px16 mb16 fr-text-lg">Résultats&nbsp;:</h4>
        {results.map(
          ({ id: ministryId, identityProviders: idps, name: ministryName }) => {
            const selected = identityProviders.filter(idp =>
              idps.includes(idp.uid),
            );
            return (
              <dl
                key={ministryId}
                id={`ministry-${ministryId}-search-list`}
                className="ministry-result mb32"
              >
                <dt className="mx16 mb8 fr-text-lg ministry-name">
                  {ministryName}
                </dt>
                <dd className="mx16 fr-text fi-name">
                  {selected.length > 0 ? (
                    <ul className="pl32">
                      {selected
                        .filter(idp => idp.active)
                        .map(idp => (
                          <li key={`${ministryId}::${idp.uid}`}>
                            <ResultItem identityProvider={idp} />
                          </li>
                        ))}
                    </ul>
                  ) : (
                    <p
                      className="font-5 my2" >
                      Cette administration n’est pas encore reliée à
                      AgentConnect pour cette application
                    </p>
                  )}
                </dd>
              </dl>
            );
          },
        )}
      </div>
    );
  },
);

SearchResultsComponent.displayName = 'SearchResultsComponent';

export default SearchResultsComponent;
