import { render } from '@testing-library/react';
import type { FieldInputProps } from 'react-final-form';

import { InputComponent } from './input.component';

describe('InputComponent', () => {
  it('should match the snapshot, with required props', () => {
    // Given
    const idMock = 'any-id-mock';
    const anyInputProps = {
      name: 'any-name-mock',
      type: 'any-type-mock',
    } as unknown as FieldInputProps<string, HTMLElement | HTMLSelectElement>;

    // When
    const { container } = render(<InputComponent id={idMock} input={anyInputProps} />);
    const inputElt = container.firstChild as HTMLInputElement;

    // Then
    expect(container).toMatchSnapshot();
    expect(inputElt).toHaveAttribute('id', idMock);
    expect(inputElt).toHaveAttribute('type', 'any-type-mock');
    expect(inputElt).toHaveAttribute('name', 'any-name-mock');
    expect(inputElt).toHaveAttribute('data-testid', 'any-id-mock--testid');
    expect(inputElt).not.toBeDisabled();
  });

  it('should match the snapshot, with optional props', () => {
    // Given
    const idMock = 'any-id-mock';
    const anyInputProps = {
      className: 'NOT-USED-CLASSNAME-FROM-INPUT-PROP',
      name: 'any-name-mock',
      optional: 'any-optional-mock',
      type: 'any-type-mock',
    } as unknown as FieldInputProps<string, HTMLElement | HTMLSelectElement>;

    // When
    const { container } = render(
      <InputComponent disabled className="any-classname-mock" id={idMock} input={anyInputProps} />,
    );
    const inputElt = container.firstChild as HTMLInputElement;

    // Then
    expect(container).toMatchSnapshot();
    expect(inputElt).toHaveAttribute('id', idMock);
    expect(inputElt).toHaveAttribute('type', 'any-type-mock');
    expect(inputElt).toHaveAttribute('name', 'any-name-mock');
    expect(inputElt).toHaveAttribute('optional', 'any-optional-mock');
    expect(inputElt).toHaveAttribute('data-testid', 'any-id-mock--testid');
    expect(inputElt).toHaveAttribute('class', 'any-classname-mock');
    expect(inputElt).toBeDisabled();
  });
});
