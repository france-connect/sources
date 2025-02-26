import { render } from '@testing-library/react';

import { type AnyObjectInterface, HeadingTag } from '@fc/common';
import type { SchemaFieldType } from '@fc/dto2form';
import { DTO2FormComponent } from '@fc/dto2form';
import { t } from '@fc/i18n';

import { useInstanceUpdate } from '../../../hooks';
import { InstanceUpdatePage } from './instance-update.page';

jest.mock('../../../hooks/instance-update/instance-update.hook');

describe('InstanceUpdatePage', () => {
  it('should match the snapshot', () => {
    // Given
    const submitHandlerMock = jest.fn();
    const initialValuesMock = Symbol('any-initial-values-mock') as unknown as AnyObjectInterface;
    const schemaMock = Symbol('any-schema-mock') as unknown as SchemaFieldType[];

    jest.mocked(useInstanceUpdate).mockReturnValueOnce({
      initialValues: initialValuesMock,
      schema: schemaMock,
      submitHandler: submitHandlerMock,
      title: 'any-instance-name-mock',
    });

    jest.mocked(t).mockReturnValueOnce('Partners-form-updateTitle-mock');

    // When
    const { container, getByText } = render(<InstanceUpdatePage />);
    const titleElt = getByText('Partners-form-updateTitle-mock');

    // Then
    expect(container).toMatchSnapshot();
    expect(titleElt).toBeInTheDocument();
    expect(t).toHaveBeenCalledWith('Partners.updatepage.title');
    expect(useInstanceUpdate).toHaveBeenCalledOnce();
    expect(useInstanceUpdate).toHaveBeenCalledWith();
    expect(DTO2FormComponent).toHaveBeenCalledOnce();
    expect(DTO2FormComponent).toHaveBeenCalledWith(
      {
        config: {
          id: 'DTO2Form-instance-update',
          title: 'any-instance-name-mock',
          titleHeading: HeadingTag.H2,
        },
        initialValues: initialValuesMock,
        onSubmit: submitHandlerMock,
        schema: schemaMock,
      },
      {},
    );
  });
});
