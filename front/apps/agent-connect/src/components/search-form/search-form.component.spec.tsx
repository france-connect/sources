import { fireEvent, render } from '@testing-library/react';
import { DebouncedFunc } from 'lodash';
import { OnChange } from 'react-final-form-listeners';
import { useMediaQuery } from 'react-responsive';
import { mocked } from 'ts-jest/utils';

import { useOnSearch } from '@fc/agent-connect-search';

import { SearchFormComponent } from './search-form.component';
import { SearchSubmitButtonComponent } from './search-submit-button.component';

jest.mock('@fc/agent-connect-search');
jest.mock('react-final-form-listeners');
jest.mock('./search-submit-button.component');

describe('SearchFormComponent', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should have called useMediaQuery', () => {
    // when
    render(<SearchFormComponent />);
    // then
    expect(useMediaQuery).toHaveBeenCalledTimes(1);
    expect(useMediaQuery).toHaveBeenNthCalledWith(1, { query: '(min-width: 768px)' });
  });

  it('should render the component for a desktop viewport', () => {
    // given
    mocked(useMediaQuery).mockReturnValueOnce(true);
    // when
    const { getByTestId } = render(<SearchFormComponent />);
    const element = getByTestId('form-title');
    // then
    expect(element).not.toHaveClass('mb8');
  });

  it('should render the component for a tablet viewport', () => {
    // given
    mocked(useMediaQuery).mockReturnValueOnce(false);
    // when
    const { getByTestId } = render(<SearchFormComponent />);
    const element = getByTestId('form-title');
    // then
    expect(element).toHaveClass('mb8');
  });

  it('should have the form title', () => {
    // when
    const { getByText } = render(<SearchFormComponent />);
    const element = getByText('Je recherche mon administration');
    // then
    expect(element).toBeInTheDocument();
  });

  it('should have the form', () => {
    // when
    const { getByTestId } = render(<SearchFormComponent />);
    const element = getByTestId('search-form');
    // then
    expect(element).toBeInTheDocument();
  });

  it('should have the button, disabled by default', () => {
    // given
    const submitMock = mocked(SearchSubmitButtonComponent);
    // when
    render(<SearchFormComponent />);
    // then
    expect(submitMock).toHaveBeenCalledWith({ disabled: true }, {});
  });

  it('should have the label title, it should be associated to search input', () => {
    // when
    const { getByTestId } = render(<SearchFormComponent />);
    const element = getByTestId('input-label');
    // then
    expect(element).toBeInTheDocument();
    expect(element).toHaveAttribute('for', 'fi-search-term');
    expect(element.innerHTML).toStrictEqual(
      'Veuillez taper le nom complet de votre administration',
    );
  });

  it('should have the search input', () => {
    // when
    const { getByTestId } = render(<SearchFormComponent />);
    const element = getByTestId('search-input');
    // then
    expect(element).toBeInTheDocument();
    expect(element.tagName.toLowerCase()).toStrictEqual('input');
    expect(element).toHaveAttribute('type', 'text');
    expect(element).toHaveAttribute('name', 'fi-search-term');
    expect(element).toHaveAttribute('id', 'fi-search-term');
    expect(element).toHaveAttribute('placeholder', 'ex : ministère de la mer, ministère de...');
  });

  it('should call OnChange listener to have been called with text input name and onSearchMock as children', () => {
    // given
    const onSearchMock = jest.fn();
    mocked(useOnSearch).mockReturnValueOnce(
      onSearchMock as unknown as DebouncedFunc<(value: string) => void>,
    );
    // when
    render(<SearchFormComponent />);
    // then
    expect(OnChange).toHaveBeenCalledWith({ children: onSearchMock, name: 'fi-search-term' }, {});
  });

  it('should call onSearch with the text input value when form is submitted', () => {
    // given
    const onSearchMock = jest.fn();
    mocked(useOnSearch).mockReturnValueOnce(
      onSearchMock as unknown as DebouncedFunc<(value: string) => void>,
    );
    // @NOTE useless to assign label control association here
    // eslint-disable-next-line
    mocked(SearchSubmitButtonComponent).mockReturnValue(<button type="submit" />);
    // when
    const { getByRole } = render(
      <SearchFormComponent formData={{ 'fi-search-term': 'text-input-value' }} />,
    );
    const button = getByRole('button') as HTMLButtonElement;
    fireEvent.click(button);
    // then
    expect(onSearchMock).toHaveBeenCalledWith('text-input-value');
  });
});
