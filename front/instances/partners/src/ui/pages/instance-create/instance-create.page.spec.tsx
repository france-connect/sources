import { render } from '@testing-library/react';

import type { JSONFieldType } from '@fc/dto2form';
import { DTO2FormComponent } from '@fc/dto2form';

import { useInstanceCreate } from '../../../hooks';
import { InstanceCreatePage } from './instance-create.page';

jest.mock('../../../hooks/instance-create/instance-create.hook');

describe('InstanceCreatePage', () => {
  it('should match the snapshot', () => {
    // Given
    const submitHandlerMock = jest.fn();
    const schemaMock = Symbol('any-schema-mock') as unknown as JSONFieldType[];

    jest
      .mocked(useInstanceCreate)
      .mockReturnValueOnce({ schema: schemaMock, submitHandler: submitHandlerMock });

    // When
    const { container } = render(<InstanceCreatePage />);

    // Then
    expect(container).toMatchSnapshot();
    expect(DTO2FormComponent).toHaveBeenCalledOnce();
    expect(DTO2FormComponent).toHaveBeenCalledWith(
      {
        config: { id: 'DTO2Form-instance-create' },
        initialValues: {},
        onSubmit: submitHandlerMock,
        schema: schemaMock,
      },
      {},
    );
  });
});
