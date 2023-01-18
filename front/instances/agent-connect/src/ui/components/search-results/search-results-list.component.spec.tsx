import { render } from '@testing-library/react';

import { searchResultsMock } from './__fixtures__/search-results';
import { SearchResultComponent } from './search-result.component';
import { SearchResultsListComponent } from './search-results-list.component';

jest.mock('./search-result.component');

describe('SearchResultsListComponent', () => {
  it('should have the main label', () => {
    // when
    const { getByText } = render(<SearchResultsListComponent results={[]} />);
    const element = getByText('Résultats :');

    // then
    expect(element).toBeInTheDocument();
  });

  it('should have render 2 ministries', () => {
    // when
    const { getByTestId } = render(<SearchResultsListComponent results={searchResultsMock} />);
    const element1 = getByTestId('ministry-search-list__ministry-id-mock-1');
    const element2 = getByTestId('ministry-search-list__ministry-id-mock-2');
    const element3 = getByTestId('ministry-search-list__ministry-id-mock-3');
    const element4 = getByTestId('ministry-search-list__ministry-id-mock-4');

    // then
    expect(element1).toBeInTheDocument();
    expect(element2).toBeInTheDocument();
    expect(element3).toBeInTheDocument();
    expect(element4).toBeInTheDocument();
  });

  it('should have render the 2 ministries names', () => {
    // when
    const { getByText } = render(<SearchResultsListComponent results={searchResultsMock} />);
    const element1 = getByText('ministry-name-mock-1');
    const element2 = getByText('ministry-name-mock-2');
    const element3 = getByText('ministry-name-mock-3');
    const element4 = getByText('ministry-name-mock-4');

    // then
    expect(element1).toBeInTheDocument();
    expect(element2).toBeInTheDocument();
    expect(element3).toBeInTheDocument();
    expect(element4).toBeInTheDocument();
  });

  it('should have 2 ministries without identity providers', () => {
    // when
    const { getAllByText } = render(<SearchResultsListComponent results={searchResultsMock} />);
    const elements = getAllByText(
      'Cette administration n’est pas encore reliée à AgentConnect pour cette application',
    );

    // then
    expect(elements).toHaveLength(2);
  });

  it('should have a called SearchResultComponent 2 times, 4 idps, 1 hidden, 1 disabled', () => {
    // when
    const { getByText } = render(<SearchResultsListComponent results={searchResultsMock} />);

    // then
    expect(SearchResultComponent).toHaveBeenCalledTimes(2);
    expect(() => {
      getByText('Identity Provider : idp-uid-mock-2.1');
    }).toThrow();
    expect(() => {
      getByText('Identity Provider : idp-name-mock-2.2');
    }).toThrow();
  });

  it('should first SearchResultComponent have to been called csrfToken from AgentConnectSearchContext', () => {
    // given
    const csrfTokenMock = 'csrf-token-mock';

    // when
    render(<SearchResultsListComponent results={searchResultsMock} />);

    // then
    expect(SearchResultComponent).toHaveBeenCalledTimes(2);
    expect(SearchResultComponent).toHaveBeenNthCalledWith(
      1,
      {
        csrfToken: csrfTokenMock,
        name: 'idp-name-mock-1.1',
        uid: 'idp-uid-mock-1.1',
      },
      {},
    );
  });
});
