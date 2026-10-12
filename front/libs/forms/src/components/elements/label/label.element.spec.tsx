import { render } from '@testing-library/react';
import React from 'react';

import { useFieldLabel } from '../../../hooks';
import { SeeAlsoElement } from '../see-also';
import { LabelElement } from './label.element';

jest.mock('../../../hooks/field-label/field-label.hook');
jest.mock('../see-also');

describe('LabelElement', () => {
  const useIdMock = jest.spyOn(React, 'useId');

  beforeEach(() => {
    // Given
    jest.mocked(useIdMock).mockReturnValue('generated-id-mock');
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
      <LabelElement
        hint={hintMock}
        htmlFor="name-mock"
        label={labelMock}
        required={requiredMock}
      />,
    );

    // Then
    expect(useFieldLabel).toHaveBeenCalledExactlyOnceWith({
      hint: hintMock,
      label: labelMock,
      required: requiredMock,
    });
  });

  it('should render the span even if only seeAlso is provided', () => {
    // Given
    const hintMock = undefined;
    const seeAlsoMock = 'http://foo.bar/test';
    jest.mocked(useFieldLabel).mockReturnValueOnce({
      hint: undefined,
      label: 'hook-label-mock',
      required: expect.any(Boolean),
      seeAlso: 'see-also-valid',
    });

    // When
    const { getByTestId } = render(
      <LabelElement hint={hintMock} htmlFor="name-mock" label="any-label" seeAlso={seeAlsoMock} />,
    );
    const seeAlsoElt = getByTestId('SeeAlsoElement');

    // Then
    expect(seeAlsoElt).toBeInTheDocument();
  });

  it('should render the span even if only hint is provided', () => {
    // Given
    const hintMock = 'test hint';
    const seeAlsoMock = undefined;

    // When
    const { getByTestId, getByText } = render(
      <LabelElement hint={hintMock} htmlFor="name-mock" label="any-label" seeAlso={seeAlsoMock} />,
    );
    const hintElt = getByText('hook-hint-mock');
    const seeAlsoElt = getByTestId('SeeAlsoElement');

    // Then
    expect(hintElt).toHaveClass('fr-hint-text');
    expect(seeAlsoElt).toBeInTheDocument();
  });

  it('should use useId for SeeAlsoElement when htmlFor is not provided', () => {
    // Given
    const seeAlsoMock = 'http://foo.bar/test';
    jest.mocked(useFieldLabel).mockReturnValueOnce({
      hint: undefined,
      label: 'hook-label-mock',
      required: false,
      seeAlso: 'see-also-valid',
    });

    // When
    render(<LabelElement label="any-label" seeAlso={seeAlsoMock} />);

    // Then
    expect(useIdMock).toHaveBeenCalled();
    expect(SeeAlsoElement).toHaveBeenCalledWith(
      {
        id: 'generated-id-mock',
        url: seeAlsoMock,
      },
      undefined,
    );
  });

  it('should match the snapshot', () => {
    // Given
    jest.mocked(useFieldLabel).mockReturnValueOnce({
      hint: 'hook-hint-mock',
      label: 'hook-label-mock',
      required: true,
      seeAlso: 'http://foo.bar/test',
    });

    // When
    const { container, getByText } = render(
      <LabelElement
        className="any-classname-mock"
        htmlFor="any-name-mock"
        label={expect.any(String)}
        seeAlso="http://foo.bar/test"
      />,
    );
    const hintElt = getByText('hook-hint-mock');
    const labelTextElt = getByText('hook-label-mock');

    // Then
    expect(container).toMatchSnapshot();
    expect(container.firstChild).toHaveClass('fr-label');
    expect(container.firstChild).toHaveClass('any-classname-mock');
    expect(container.firstChild).toHaveAttribute('for', 'any-name-mock');
    expect(labelTextElt).toBeInTheDocument();
    expect(hintElt).toHaveClass('fr-hint-text');
    expect(hintElt).toBeInTheDocument();
  });
});
