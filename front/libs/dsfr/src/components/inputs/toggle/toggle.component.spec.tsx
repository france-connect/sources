import { render } from '@testing-library/react';
import { FieldInputProps } from 'react-final-form';

import { CheckableLegend } from '../../../interfaces';
import { ToggleComponent } from './toggle.component';

jest.mock('./toggle-input.component');
jest.mock('./toggle-label.component');

describe('ToggleComponent', () => {
  const fieldInputPropsMock = {
    name: 'any-field-name-mock',
    onBlur: () => {},
    onChange: () => {},
    onFocus: () => {},
    value: 'any-field-value-mock',
  } as FieldInputProps<unknown, HTMLElement>;
  const legendMock = { checked: 'foo', unchecked: 'bar' } as CheckableLegend;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should match snapshot with default props', () => {
    // When
    const { container } = render(
      <ToggleComponent input={fieldInputPropsMock} label="foobar" legend={legendMock} />,
    );
    // Then
    expect(container.firstChild).toMatchSnapshot();
  });

  it('should match snapshot with hint provided', () => {
    // Given
    const hintMock = 'hint-mock';
    // When
    const { container } = render(
      <ToggleComponent
        hint={hintMock}
        input={fieldInputPropsMock}
        label="foobar"
        legend={legendMock}
      />,
    );
    // Then
    expect(container.firstChild).toMatchSnapshot();
  });

  it('should apply className if provided', () => {
    // Given
    const classNameMock = 'class-name-mock';
    // When
    const { container } = render(
      <ToggleComponent
        className={classNameMock}
        input={fieldInputPropsMock}
        label="foobar"
        legend={legendMock}
      />,
    );
    // Then
    expect(container.firstChild).toHaveClass(classNameMock);
  });
});
