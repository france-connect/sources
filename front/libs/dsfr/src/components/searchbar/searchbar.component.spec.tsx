import { render } from '@testing-library/react';

import { SearchBarComponent } from './searchbar.component';

describe('SearchBarComponent', () => {
  // given
  const formInputMock = {
    name: 'form-input-name-mock',
    onBlur: jest.fn(),
    onChange: jest.fn(),
    onFocus: jest.fn(),
    value: 'form-input-value-mock',
  };

  it('should match snapshot, with default props', () => {
    // when
    const { container } = render(<SearchBarComponent input={formInputMock} />);

    // then
    expect(container).toMatchSnapshot();
  });

  it('should match snapshot, whith all props defined', () => {
    // when
    const { container } = render(
      <SearchBarComponent
        buttonLabel="any-button-label-mock"
        input={formInputMock}
        inputLabel="any-input-label-mock"
        size="md"
      />,
    );

    // then
    expect(container).toMatchSnapshot();
  });

  it('should have the class when size lg is defined', () => {
    // when
    const { container } = render(<SearchBarComponent input={formInputMock} size="lg" />);

    // then
    expect(container.firstChild).toHaveClass('fr-search-bar--lg');
  });

  it('should show the input label', () => {
    // when
    const { getByText } = render(
      <SearchBarComponent input={formInputMock} inputLabel="any-input-label-mock" />,
    );
    const element = getByText('any-input-label-mock');

    // then
    expect(element).toBeInTheDocument();
  });

  it('should show the button label', () => {
    // when
    const { getByText } = render(
      <SearchBarComponent buttonLabel="any-button-label-mock" input={formInputMock} />,
    );
    const element = getByText('any-button-label-mock');

    // then
    expect(element).toBeInTheDocument();
  });
});
