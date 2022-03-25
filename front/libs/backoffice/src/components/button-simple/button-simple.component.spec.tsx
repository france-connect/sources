import { fireEvent, render } from '@testing-library/react';

import { ButtonSimpleComponent } from './button-simple.component';

describe('ButtonSimpleComponent', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render the button with the label', () => {
    // when
    const { getByText } = render(<ButtonSimpleComponent label="any-button-label" />);
    const element = getByText('any-button-label');
    // then
    expect(element).toBeInTheDocument();
  });

  it('should render a component of type button', () => {
    // when
    const { getByTestId } = render(<ButtonSimpleComponent label="any-button-label" />);
    const element = getByTestId('button-simple-component');
    // then
    expect(element).toHaveAttribute('type', 'button');
    expect(element).not.toHaveAttribute('onClick');
  });

  it('should render the button with optionnal props', () => {
    // given
    const onClickMock = jest.fn();
    // when
    const { getByTestId } = render(
      <ButtonSimpleComponent
        secondary
        className="super-class"
        label="any-button-label"
        type="submit"
        onClick={onClickMock}
      />,
    );
    const element = getByTestId('button-simple-component');
    fireEvent.click(element);
    // then
    expect(element).toHaveAttribute('type', 'submit');
    expect(element).not.toHaveClass('primary');
    expect(element).toHaveClass('secondary');
    expect(element).toHaveClass('super-class');
  });

  it('should call onClick mock', () => {
    // given
    const onClickMock = jest.fn();
    // when
    const { getByTestId } = render(
      <ButtonSimpleComponent label="any-button-label" type="submit" onClick={onClickMock} />,
    );
    const element = getByTestId('button-simple-component');
    fireEvent.click(element);
    // then
    expect(onClickMock).toHaveBeenCalledTimes(1);
  });
});
