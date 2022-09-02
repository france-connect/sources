import { render } from '@testing-library/react';
import { mocked } from 'jest-mock';
import { DebouncedFunc } from 'lodash';
import { Field, Form } from 'react-final-form';
import { OnChange } from 'react-final-form-listeners';
import { useMediaQuery } from 'react-responsive';

import { useOnSearch } from '@fc/agent-connect-search';
import { SearchBarComponent } from '@fc/dsfr';

import { SearchFormComponent } from './search-form.component';

jest.mock('@fc/agent-connect-search');
jest.mock('react-final-form');
jest.mock('react-final-form-listeners');

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

  it('should match the snapshot for a desktop viewport', () => {
    // given
    mocked(useMediaQuery).mockReturnValueOnce(true);
    // when
    const { container } = render(<SearchFormComponent />);
    // then
    expect(container).toMatchSnapshot();
  });

  it('should match the snapshot for a tablet viewport', () => {
    // given
    mocked(useMediaQuery).mockReturnValueOnce(false);
    // when
    const { container } = render(<SearchFormComponent />);
    // then
    expect(container).toMatchSnapshot();
  });

  it('should have the form title', () => {
    // when
    const { getByText } = render(<SearchFormComponent />);
    const element = getByText('Je recherche mon administration');
    // then
    expect(element).toBeInTheDocument();
  });

  it('should render react-final-form Form with props', () => {
    // given
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const formDataMock = { 'fi-search-term': 'field-value-mock' };
    const onSearchMock = jest.fn();
    mocked(useOnSearch).mockReturnValueOnce(
      onSearchMock as unknown as DebouncedFunc<(value: string) => void>,
    );
    // when
    render(<SearchFormComponent formData={formDataMock} />);
    // then
    expect(Form).toHaveBeenCalledTimes(1);
    expect(Form).toHaveBeenCalledWith(
      expect.objectContaining({
        initialValues: formDataMock,
        onSubmit: expect.any(Function),
      }),
      {},
    );
  });

  it('should have the form', () => {
    // when
    const { getByTestId } = render(<SearchFormComponent />);
    const element = getByTestId('search-form');
    // then
    expect(element).toBeInTheDocument();
  });

  it('should have the label title and be associated to search input', () => {
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

  it('should call react-final-form Field with params', () => {
    // when
    render(<SearchFormComponent />);
    // then
    expect(Field).toHaveBeenCalledTimes(1);
    expect(Field).toHaveBeenCalledWith(
      { children: expect.any(Function), name: 'fi-search-term' },
      {},
    );
  });

  it('should call SearchBarComponent', () => {
    // when
    render(<SearchFormComponent />);
    // then
    expect(SearchBarComponent).toHaveBeenCalledTimes(1);
    expect(SearchBarComponent).toHaveBeenCalledWith(
      expect.objectContaining({
        buttonLabel: 'Rechercher',
        className: 'fr-px-2w fr-py-1w fr-mb-2w',
        placeholder: 'ex : ministère de la mer, ministère de...',
        size: 'lg',
      }),
      {},
    );
  });

  it('should call OnChange listener with text input name and onSearchMock as children', () => {
    // given
    const onSearchMock = jest.fn();
    mocked(useOnSearch).mockReturnValueOnce(
      onSearchMock as unknown as DebouncedFunc<(value: string) => void>,
    );
    // when
    render(<SearchFormComponent />);
    // then
    expect(OnChange).toHaveBeenCalledTimes(1);
    expect(OnChange).toHaveBeenCalledWith({ children: onSearchMock, name: 'fi-search-term' }, {});
  });
});
