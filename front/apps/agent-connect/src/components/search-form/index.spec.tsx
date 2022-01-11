import { fireEvent, render } from '@testing-library/react';

import { SearchFormComponent } from './index';

describe('SearchFormComponent', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();
    jest.clearAllMocks();
  });

  // given
  const onChangeMock = jest.fn();

  it('should render a title above the search form', () => {
    // given

    const { getByText } = render(<SearchFormComponent onChange={onChangeMock} />);
    // when
    const textElement = getByText('mock input title');
    // then
    expect(textElement).toBeInTheDocument();
  });

  it('should render a text input, when user type will fire a change event', () => {
    const { getByTestId } = render(<SearchFormComponent onChange={onChangeMock} />);
    // when
    const inputElement = getByTestId('fi-search-term');
    fireEvent.change(inputElement, { target: { value: 'mock search value' } });
    // then
    expect(onChangeMock).toHaveBeenCalledTimes(1);
    expect(onChangeMock).toHaveBeenCalledWith('mock search value');
  });

  it('should call callback parameters when submitting form', () => {
    const { getByTestId } = render(<SearchFormComponent onChange={onChangeMock} />);
    // when
    const inputElement = getByTestId('fi-search-term');
    fireEvent.change(inputElement, {
      target: { value: 'mock search value submit' },
    });

    const submitButton = getByTestId('fi-search-term-submit-button');
    submitButton.click();
    // then
    expect(onChangeMock).toHaveBeenCalledTimes(1);
    expect(onChangeMock).toHaveBeenCalledWith('mock search value submit');
  });
});
