import { render } from '@testing-library/react';
import type { FieldInputProps } from 'react-final-form';

import { t } from '@fc/i18n';

import type { CheckableLegendInterface } from '../../../interfaces';
import { ToggleLabelComponent } from './toggle-label.component';

describe('ToggleLabelComponent', () => {
  // Given
  const fieldInputPropsMock = {
    checked: true,
    name: 'any-field-name-mock',
    onBlur: () => {},
    onChange: () => {},
    onFocus: () => {},
    value: 'any-field-value-mock',
  } as FieldInputProps<unknown, HTMLElement>;

  const legendMock = { checked: 'foo', unchecked: 'bar' } as CheckableLegendInterface;

  beforeEach(() => {
    // Given
    jest
      .mocked(t)
      .mockReturnValueOnce('any-checked-label-mock')
      .mockReturnValueOnce('any-unchecked-label-mock');
  });

  it('should call t 2 times with correct params', () => {
    // When
    render(<ToggleLabelComponent input={fieldInputPropsMock} label="foobar" />);

    // Then
    expect(t).toHaveBeenCalledTimes(2);
    expect(t).toHaveBeenNthCalledWith(1, 'DSFR.toggle.checked');
    expect(t).toHaveBeenNthCalledWith(2, 'DSFR.toggle.unchecked');
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

    expect(element).toHaveAttribute('data-fr-checked-label', 'any-checked-label-mock');
    expect(element).toHaveAttribute('data-fr-unchecked-label', 'any-unchecked-label-mock');
  });

  it('should use call label if label provided is a function', () => {
    // Given
    const labelMock = jest.fn();

    // When
    render(
      <ToggleLabelComponent input={fieldInputPropsMock} label={labelMock} legend={legendMock} />,
    );

    // Then
    expect(labelMock).toHaveBeenCalledOnce();
    expect(labelMock).toHaveBeenCalledWith(fieldInputPropsMock.checked);
  });
});
