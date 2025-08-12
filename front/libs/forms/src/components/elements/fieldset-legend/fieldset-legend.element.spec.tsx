import { render } from '@testing-library/react';

import { useFieldLabel } from '../../../hooks';
import { FieldsetLegendElement } from './fieldset-legend.element';

jest.mock('../../../hooks/field-label/field-label.hook');
jest.mock('../see-also');

describe('FieldsetLegendElement', () => {
  beforeEach(() => {
    // Given
    jest.mocked(useFieldLabel).mockReturnValue({
      hint: 'hook-hint-mock',
      label: 'hook-label-mock',
      required: expect.any(Boolean),
      seeAlso: undefined,
    });
  });

  it('should call useFieldLabel with parameters', () => {
    // Given
    const hintMock = Symbol('any-hint-mock') as unknown as string;
    const labelMock = Symbol('any-label-mock') as unknown as string;
    const requiredMock = Symbol('any-required-mock') as unknown as boolean;

    // When
    render(
      <FieldsetLegendElement
        hint={hintMock}
        label={labelMock}
        name="name-mock"
        required={requiredMock}
      />,
    );

    // Then
    expect(useFieldLabel).toHaveBeenCalledOnce();
    expect(useFieldLabel).toHaveBeenCalledWith({
      hint: hintMock,
      label: labelMock,
      required: requiredMock,
    });
  });

  it('should render the span even if only seeAlso is provided', () => {
    // Given
    const hintMock = undefined;
    const labelMock = Symbol('any-label-mock') as unknown as string;
    const requiredMock = Symbol('any-required-mock') as unknown as boolean;

    jest.mocked(useFieldLabel).mockReturnValue({
      hint: undefined,
      label: 'hook-label-mock',
      required: expect.any(Boolean),
      seeAlso: 'see-also-valid',
    });

    // When
    const { getByTestId } = render(
      <FieldsetLegendElement
        hint={hintMock}
        label={labelMock}
        name="name-mock"
        required={requiredMock}
      />,
    );
    const seeAlsoElt = getByTestId('SeeAlsoElement');

    // Then
    expect(seeAlsoElt).toBeDefined();
  });

  it('should match the snapshot', () => {
    // Given
    jest.mocked(useFieldLabel).mockReturnValueOnce({
      hint: 'hook-hint-mock',
      label: 'hook-label-mock',
      required: true,
      seeAlso: 'https://foo.bar/test',
    });

    // When
    const { container, getByText } = render(
      <FieldsetLegendElement
        className="any-classname-mock"
        label={expect.any(String)}
        name="any-name-mock"
        seeAlso="https://foo.bar/test"
      />,
    );
    const hintElt = getByText('hook-hint-mock');
    const labelTextElt = getByText('hook-label-mock');

    // Then
    expect(container).toMatchSnapshot();
    expect(container.firstChild).toHaveClass('fr-fieldset__legend--regular fr-fieldset__legend');
    expect(container.firstChild).toHaveClass('any-classname-mock');
    expect(labelTextElt).toBeInTheDocument();
    expect(hintElt).toHaveClass('fr-hint-text');
    expect(hintElt).toBeInTheDocument();
  });
});
