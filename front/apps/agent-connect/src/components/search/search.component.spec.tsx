import { render } from '@testing-library/react';
import { useMediaQuery } from 'react-responsive';
import { mocked } from 'ts-jest/utils';

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

  it('should render the component for a desktop viewport', () => {
    // when
    const { getByTestId } = render(<SearchComponent />);
    const element = getByTestId('wrapper');
    // then
    expect(element).toHaveClass('text-center');
  });

  it('should render the component for a tablet viewport', () => {
    // given
    mocked(useMediaQuery).mockReturnValueOnce(false);
    // when
    const { getByTestId } = render(<SearchComponent />);
    const element = getByTestId('wrapper');
    // then
    expect(element).not.toHaveClass('text-center');
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
