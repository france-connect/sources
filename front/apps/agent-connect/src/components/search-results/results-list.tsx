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
        className="content-wrapper-md v-align-middle"
        id="identity-provider-result"
      >
        {results.map(
          ({ id: ministryId, identityProviders: idps, name: ministryName }) => {
            const selected = identityProviders.filter(idp =>
              idps.includes(idp.uid),
            );
            return (
              <dl
                key={ministryId}
                id={`ministry-${ministryId}-search-list`}
                style={{
                  marginTop: '0',
                  marginBottom: '1rem',
                }}
              >
                <dt className="m8 mt4 ministry-name text-center">
                  {ministryName}
                </dt>
                <dd className="my16 ml24 fi-name">
                  {selected.length > 0 ? (
                    <ul>
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
                      className="font-5 p24 my2 text-center"
                      style={{ backgroundColor: '#e6f3ff' }} >
                      Cette administration n&apos;est pas encore reliée à
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
