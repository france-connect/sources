import { render } from '@testing-library/react';

import { useFieldLabel } from '../../../hooks';
import { LabelElement } from './label.element';

jest.mock('../../../hooks/field-label/field-label.hook');

describe('LabelElement', () => {
  beforeEach(() => {
    // Given
    jest.mocked(useFieldLabel).mockReturnValue({
      hint: 'hook-hint-mock',
      label: 'hook-label-mock',
      required: expect.any(Boolean),
    });
  });

  it('should call useFieldLabel with parameters', () => {
    // Given
    const hintMock = Symbol('any-hint-mock') as unknown as string;
    const labelMock = Symbol('any-label-mock') as unknown as string;
    const requiredMock = Symbol('any-required-mock') as unknown as boolean;

    // When
    render(
      <LabelElement hint={hintMock} label={labelMock} name="name-mock" required={requiredMock} />,
    );

    // Then
    expect(useFieldLabel).toHaveBeenCalledOnce();
    expect(useFieldLabel).toHaveBeenCalledWith({
      hint: hintMock,
      label: labelMock,
      required: requiredMock,
    });
  });

  it('should match the snapshot', () => {
    // Given
    jest.mocked(useFieldLabel).mockReturnValueOnce({
      hint: 'hook-hint-mock',
      label: 'hook-label-mock',
      required: true,
    });

    // When
    const { container, getByText } = render(
      <LabelElement
        className="any-classname-mock"
        label={expect.any(String)}
        name="any-name-mock"
      />,
    );
    const hintTextElt = getByText('hook-hint-mock');
    const labelTextElt = getByText('hook-label-mock');

    // Then
    expect(container).toMatchSnapshot();
    expect(container.firstChild).toHaveClass('fr-label');
    expect(container.firstChild).toHaveClass('any-classname-mock');
    expect(container.firstChild).toHaveAttribute('for', 'any-name-mock');
    expect(labelTextElt).toBeInTheDocument();
    expect(hintTextElt).toHaveClass('fr-hint-text');
    expect(hintTextElt).toBeInTheDocument();
  });
});
