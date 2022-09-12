import { render } from '@testing-library/react';
import { FieldInputProps } from 'react-final-form';

import { CheckableLegend } from '../../../interfaces';
import { ToggleLabelComponent } from './toggle-label.component';

describe('ToggleLabelComponent', () => {
  const fieldInputPropsMock = {
    checked: true,
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

  it('should match the snapshot', () => {
    // When
    const { container } = render(
      <ToggleLabelComponent input={fieldInputPropsMock} label="foobar" legend={legendMock} />,
    );

    // Then
    expect(container.firstChild).toMatchSnapshot();
  });

  it('should use defaultLegend if legend is not provided', () => {
    // When
    const { container } = render(
      <ToggleLabelComponent input={fieldInputPropsMock} label="foobar" />,
    );

    // Then
    const element = container.firstChild;
    expect(element).toHaveAttribute('data-fr-checked-label', 'Activé');
    expect(element).toHaveAttribute('data-fr-unchecked-label', 'Désactivé');
  });

  it('should use call label if label provided is a function', () => {
    // Given
    const labelMock = jest.fn();

    // When
    render(
      <ToggleLabelComponent input={fieldInputPropsMock} label={labelMock} legend={legendMock} />,
    );

    // Then
    expect(labelMock).toHaveBeenCalledTimes(1);
    expect(labelMock).toHaveBeenCalledWith(fieldInputPropsMock.checked);
  });
});
