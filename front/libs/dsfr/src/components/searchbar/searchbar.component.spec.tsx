import { render } from '@testing-library/react';

import { SearchBarComponent } from './searchbar.component';

describe('SearchBarComponent', () => {
  // Given
  const formInputMock = {
    name: 'form-input-name-mock',
    onBlur: jest.fn(),
    onChange: jest.fn(),
    onFocus: jest.fn(),
    value: 'form-input-value-mock',
  };

  it('should match snapshot, with default props', () => {
    // When
    const { container } = render(<SearchBarComponent input={formInputMock} />);

    // Then
    expect(container).toMatchSnapshot();
  });

  it('should match snapshot, whith all props defined', () => {
    // When
    const { container } = render(
      <SearchBarComponent
        buttonLabel="any-button-label-mock"
        input={formInputMock}
        inputLabel="any-input-label-mock"
        size="md"
      />,
    );

    // Then
    expect(container).toMatchSnapshot();
  });

  it('should have the class when size lg is defined', () => {
    // When
    const { container } = render(<SearchBarComponent input={formInputMock} size="lg" />);

    // Then
    expect(container.firstChild).toHaveClass('fr-search-bar--lg');
  });

  it('should show the input label', () => {
    // When
    const { getByText } = render(
      <SearchBarComponent input={formInputMock} inputLabel="any-input-label-mock" />,
    );
    const element = getByText('any-input-label-mock');

    // Then
    expect(element).toBeInTheDocument();
  });

  it('should show the button label', () => {
    // When
    const { getByText } = render(
      <SearchBarComponent buttonLabel="any-button-label-mock" input={formInputMock} />,
    );
    const element = getByText('any-button-label-mock');

    // Then
    expect(element).toBeInTheDocument();
  });
});
