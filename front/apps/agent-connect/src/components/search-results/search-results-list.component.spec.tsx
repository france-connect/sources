import { render } from '@testing-library/react';

import { searchResultsMock } from './__fixtures__/search-results';
import { SearchResultComponent } from './search-result.component';
import { SearchResultsListComponent } from './search-results-list.component';

jest.mock('./search-result.component');

describe('SearchResultsListComponent', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should have the main label', () => {
    // then
    const { getByText } = render(<SearchResultsListComponent results={[]} />);
    const element = getByText('Résultats :');
    // when
    expect(element).toBeInTheDocument();
  });

  it('should have render 2 ministries', () => {
    // then
    const { getByTestId } = render(<SearchResultsListComponent results={searchResultsMock} />);
    const element1 = getByTestId('ministry-ministry-id-mock-1-search-list');
    const element2 = getByTestId('ministry-ministry-id-mock-2-search-list');
    const element3 = getByTestId('ministry-ministry-id-mock-3-search-list');
    const element4 = getByTestId('ministry-ministry-id-mock-4-search-list');
    // when
    expect(element1).toBeInTheDocument();
    expect(element2).toBeInTheDocument();
    expect(element3).toBeInTheDocument();
    expect(element4).toBeInTheDocument();
  });

  it('should have render the 2 ministries names', () => {
    // then
    const { getByText } = render(<SearchResultsListComponent results={searchResultsMock} />);
    const element1 = getByText('ministry-name-mock-1');
    const element2 = getByText('ministry-name-mock-2');
    const element3 = getByText('ministry-name-mock-3');
    const element4 = getByText('ministry-name-mock-4');
    // when
    expect(element1).toBeInTheDocument();
    expect(element2).toBeInTheDocument();
    expect(element3).toBeInTheDocument();
    expect(element4).toBeInTheDocument();
  });

  it('should have 2 ministries without identity providers', () => {
    // then
    const { getAllByText } = render(<SearchResultsListComponent results={searchResultsMock} />);
    const elements = getAllByText(
      'Cette administration n’est pas encore reliée à AgentConnect pour cette application',
    );
    // when
    expect(elements).toHaveLength(2);
  });

  it('should have a called SearchResultComponent 2 times, 4 idps, 1 hidden, 1 disabled', () => {
    // then
    const { getByText } = render(<SearchResultsListComponent results={searchResultsMock} />);
    // when
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
    // then
    render(<SearchResultsListComponent results={searchResultsMock} />);
    // when
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
