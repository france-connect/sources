import { render } from '@testing-library/react';

import { type BaseAttributes, Dto2FormComponent } from '@fc/dto2form';
import type { FormConfigInterface } from '@fc/forms';

import { InstancePageFormComponent } from './instance-page-form.component';

describe('InstancePageFormComponent', () => {
  // Given
  const configMock = Symbol('any-config-mock') as unknown as FormConfigInterface;
  const schemaMock = Symbol('any-schema-mock') as unknown as BaseAttributes[];

  it('should match the snapshot', () => {
    // When
    const { container } = render(
      <InstancePageFormComponent
        config={configMock}
        initialValues={{}}
        postSubmit={async () => undefined}
        preSubmit={async (data) => data}
        schema={schemaMock}
        submitHandler={async (data) => data}
      />,
    );

    // Then
    expect(container).toMatchSnapshot();
  });

  it('should render the Dto2FormComponent with params', () => {
    // When
    render(
      <InstancePageFormComponent
        config={configMock}
        initialValues={{}}
        postSubmit={async () => undefined}
        preSubmit={async (data) => data}
        schema={schemaMock}
        submitHandler={async (data) => data}
      />,
    );

    // Then
    expect(Dto2FormComponent).toHaveBeenCalledOnce();
    expect(Dto2FormComponent).toHaveBeenCalledWith(
      {
        config: configMock,
        initialValues: {},
        onPostSubmit: expect.any(Function),
        onPreSubmit: expect.any(Function),
        onSubmit: expect.any(Function),
        schema: schemaMock,
      },
      undefined,
    );
  });
});
