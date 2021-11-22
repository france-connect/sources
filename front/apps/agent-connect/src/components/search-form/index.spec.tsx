import { fireEvent, render } from '@testing-library/react';

import SearchFormComponent from './index';

describe('SearchFormComponent', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();
    jest.clearAllMocks();
  });

  it('should render a title above the search form', () => {
    // given
    const props = {
      label: 'mock input title',
      onChange: jest.fn(),
    };
    const { getByText } = render(<SearchFormComponent {...props} />);
    // when
    const textElement = getByText('mock input title');
    // then
    expect(textElement).toBeInTheDocument();
  });

  it('should render a text input, when user type will fire a change event', () => {
    // given
    const props = {
      label: 'mock input title',
      onChange: jest.fn(),
    };
    const { getByTestId } = render(<SearchFormComponent {...props} />);
    // when
    const inputElement = getByTestId('fi-search-term');
    fireEvent.change(inputElement, { target: { value: 'mock search value' } });
    // then
    expect(props.onChange).toHaveBeenCalledTimes(1);
    expect(props.onChange).toHaveBeenCalledWith('mock search value');
  });

  it('should call callback parameters when submitting form', () => {
    // given
    const props = {
      label: 'mock input title',
      onChange: jest.fn(),
    };
    const { getByTestId } = render(<SearchFormComponent {...props} />);
    // when
    const inputElement = getByTestId('fi-search-term');
    fireEvent.change(inputElement, {
      target: { value: 'mock search value submit' },
    });

    const submitButton = getByTestId('fi-search-term-submit-button');
    submitButton.click();
    // then
    expect(props.onChange).toHaveBeenCalledTimes(1);
    expect(props.onChange).toHaveBeenCalledWith('mock search value submit');
  });
});
