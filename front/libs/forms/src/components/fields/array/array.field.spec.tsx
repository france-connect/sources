import { render } from '@testing-library/react';
import React from 'react';
import type { FieldArrayRenderProps } from 'react-final-form-arrays';
import { useFieldArray } from 'react-final-form-arrays';

import { ArrayAddButton, LabelElement } from '../../elements';
import { ArrayField } from './array.field';

jest.mock('../../elements/label/label.element');
jest.mock('../../elements/buttons/array-add/array-add.button');

describe('ArrayField', () => {
  // Given
  const fieldsMock = {
    length: 1,
    map: jest.fn(),
  } as unknown as FieldArrayRenderProps['fields'];

  beforeEach(() => {
    // Given
    jest.mocked(useFieldArray).mockReturnValue({ fields: fieldsMock, meta: {} });
  });

  it('should match the snapshot', () => {
    // Given
    const validateMock = jest.fn();
    const pushHandlerMock = jest.fn();

    jest
      .spyOn(React, 'useCallback')
      .mockReturnValueOnce(pushHandlerMock)
      .mockImplementationOnce(jest.fn());

    // When
    const { container } = render(
      <ArrayField
        config={{
          label: 'any-label-mock',
          name: 'any-name-mock',
          required: true,
          validate: validateMock,
        }}
      />,
    );

    // Then
    expect(container).toMatchSnapshot();
    expect(useFieldArray).toHaveBeenCalledExactlyOnceWith('any-name-mock');
    expect(LabelElement).toHaveBeenCalledExactlyOnceWith(
      {
        className: 'fr-label fr-mb-2v',
        htmlFor: 'form-input-array-any-name-mock[0]',
        label: 'any-label-mock',
        required: true,
      },
      undefined,
    );
    expect(ArrayAddButton).toHaveBeenCalledExactlyOnceWith(
      {
        dataTestId: 'any-name-mock-add',
        disabled: false,
        onClick: pushHandlerMock,
      },
      undefined,
    );
  });

  it('should not associate the label when the array is empty', () => {
    // Given
    const emptyFieldsMock = {
      length: 0,
      map: jest.fn(),
    } as unknown as FieldArrayRenderProps['fields'];
    jest.mocked(useFieldArray).mockReturnValueOnce({ fields: emptyFieldsMock, meta: {} });

    // When
    render(
      <ArrayField
        config={{
          label: 'any-label-mock',
          name: 'any-name-mock',
          required: true,
        }}
      />,
    );

    // Then
    expect(LabelElement).toHaveBeenCalledWith(
      {
        className: 'fr-label fr-mb-2v',
        htmlFor: undefined,
        label: 'any-label-mock',
        required: true,
      },
      undefined,
    );
  });
});
