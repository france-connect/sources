import { render } from '@testing-library/react';

import type { AnyObjectInterface } from '@fc/common';
import type { JSONFieldType } from '@fc/dto2form';
import { DTO2FormComponent } from '@fc/dto2form';

import { useInstanceUpdate } from '../../../hooks';
import { InstanceUpdatePage } from './instance-update.page';

jest.mock('../../../hooks/instance-update/instance-update.hook');

describe('InstanceUpdatePage', () => {
  it('should match the snapshot', () => {
    // Given
    const submitHandlerMock = jest.fn();
    const initialValuesMock = Symbol('any-initial-values-mock') as unknown as AnyObjectInterface;
    const schemaMock = Symbol('any-schema-mock') as unknown as JSONFieldType[];
    jest.mocked(useInstanceUpdate).mockReturnValueOnce({
      initialValues: initialValuesMock,
      schema: schemaMock,
      submitHandler: submitHandlerMock,
      title: 'any-title-mock',
    });

    // When
    const { container, getByText } = render(<InstanceUpdatePage />);
    const titleElt = getByText('any-title-mock');

    // Then
    expect(container).toMatchSnapshot();
    expect(titleElt).toBeInTheDocument();
    expect(useInstanceUpdate).toHaveBeenCalledOnce();
    expect(useInstanceUpdate).toHaveBeenCalledWith();
    expect(DTO2FormComponent).toHaveBeenCalledOnce();
    expect(DTO2FormComponent).toHaveBeenCalledWith(
      {
        config: { id: 'DTO2Form-instance-update' },
        initialValues: initialValuesMock,
        onSubmit: submitHandlerMock,
        schema: schemaMock,
      },
      {},
    );
  });
});
