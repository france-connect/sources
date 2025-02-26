import { render } from '@testing-library/react';

import type { SchemaFieldType } from '@fc/dto2form';
import { DTO2FormComponent } from '@fc/dto2form';
import { t } from '@fc/i18n';

import { useInstanceCreate } from '../../../hooks';
import { InstanceCreatePage } from './instance-create.page';

jest.mock('../../../hooks/instance-create/instance-create.hook');

describe('InstanceCreatePage', () => {
  it('should match the snapshot', () => {
    // Given
    const submitHandlerMock = jest.fn();
    const schemaMock = Symbol('any-schema-mock') as unknown as SchemaFieldType[];
    const initialValuesMock = Symbol('any-initial-values-mock') as unknown as Record<
      string,
      string | string[]
    >;

    jest.mocked(useInstanceCreate).mockReturnValueOnce({
      initialValues: initialValuesMock,
      schema: schemaMock,
      submitHandler: submitHandlerMock,
    });

    jest.mocked(t).mockReturnValueOnce('Partners-form-createTitle-mock');

    // When
    const { container, getByText } = render(<InstanceCreatePage />);
    const titleElt = getByText('Partners-form-createTitle-mock');

    // Then
    expect(container).toMatchSnapshot();
    expect(titleElt).toBeInTheDocument();
    expect(t).toHaveBeenCalledOnce();
    expect(t).toHaveBeenCalledWith('Partners.createpage.title');
    expect(DTO2FormComponent).toHaveBeenCalledOnce();
    expect(DTO2FormComponent).toHaveBeenCalledWith(
      {
        config: { id: 'DTO2Form-instance-create' },
        initialValues: initialValuesMock,
        onSubmit: submitHandlerMock,
        schema: schemaMock,
      },
      {},
    );
  });
});
