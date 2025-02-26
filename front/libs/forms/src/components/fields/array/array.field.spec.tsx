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
    map: jest.fn(),
  } as unknown as FieldArrayRenderProps<unknown, HTMLElement>['fields'];

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
      .mockImplementationOnce(() => pushHandlerMock)
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
    expect(useFieldArray).toHaveBeenCalledOnce();
    expect(useFieldArray).toHaveBeenCalledWith('any-name-mock');
    expect(LabelElement).toHaveBeenCalledOnce();
    expect(LabelElement).toHaveBeenCalledWith(
      {
        className: 'fr-label fr-mb-2v',
        label: 'any-label-mock',
        name: 'any-name-mock',
        required: true,
      },
      {},
    );
    expect(ArrayAddButton).toHaveBeenCalledOnce();
    expect(ArrayAddButton).toHaveBeenCalledWith(
      {
        dataTestId: 'any-name-mock-add',
        disabled: false,
        onClick: pushHandlerMock,
      },
      {},
    );
  });
});
