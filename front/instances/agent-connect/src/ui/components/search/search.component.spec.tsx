import { render } from '@testing-library/react';
import { mocked } from 'jest-mock';
import { useMediaQuery } from 'react-responsive';

import { SearchFormComponent } from '../search-form/search-form.component';
import { SearchResultsComponent } from '../search-results/search-results.component';
import { SearchComponent } from './search.component';

jest.mock('../search-form/search-form.component');
jest.mock('../search-results/search-results.component');

describe('SearchComponent', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should have call useMediaQuery with tablet responsive query', () => {
    // when
    render(<SearchComponent />);

    // then
    expect(useMediaQuery).toHaveBeenCalledTimes(1);
    expect(useMediaQuery).toHaveBeenCalledWith({ query: '(min-width: 768px)' });
  });

  it('should match the snapshot for a desktop viewport', () => {
    // when
    const { container } = render(<SearchComponent />);

    // then
    expect(container).toMatchSnapshot();
  });

  it('should match the snapshot for a tablet viewport', () => {
    // given
    mocked(useMediaQuery).mockReturnValueOnce(false);
    // when
    const { container } = render(<SearchComponent />);

    // then
    expect(container).toMatchSnapshot();
  });

  it('should have render SearchFormComponent mock', () => {
    // when
    render(<SearchComponent />);

    // then
    expect(SearchFormComponent).toHaveBeenCalledTimes(1);
  });

  it('should have render SearchResultsComponent mock', () => {
    // when
    render(<SearchComponent />);

    // then
    expect(SearchResultsComponent).toHaveBeenCalledTimes(1);
  });
});
