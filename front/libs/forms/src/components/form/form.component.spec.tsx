import { render } from '@testing-library/react';
import { Form } from 'react-final-form';

import { FormComponent } from './form.component';
import { FormWrapperComponent } from './form-wrapper';

jest.mock('./form-wrapper/form-wrapper.component');

describe('FormComponent', () => {
  it('should match snapshot with default values', () => {
    // Given
    const submitMock = jest.fn();
    const validateMock = jest.fn();
    const childrenMock = <div>any-children-mock</div>;
    const configMock = {
      description: 'any-description-mock',
      id: 'any-id-mock',
      title: 'any-title-mock',
    };

    // When
    const { container } = render(
      <FormComponent
        config={configMock}
        initialValues={{ any: 'initial-value-mock' }}
        onSubmit={submitMock}
        onValidate={validateMock}>
        {childrenMock}
      </FormComponent>,
    );

    // Then
    expect(container).toMatchSnapshot();
    expect(Form).toHaveBeenCalledOnce();
    expect(Form).toHaveBeenCalledWith(
      {
        children: expect.any(Function),
        config: configMock,
        decorators: undefined,
        initialValues: { any: 'initial-value-mock' },
        mutators: expect.anything(),
        noRequired: false,
        onSubmit: submitMock,
        scrollTopOnSubmit: true,
        validate: validateMock,
      },
      {},
    );
    expect(FormWrapperComponent).toHaveBeenCalledOnce();
    expect(FormWrapperComponent).toHaveBeenCalledWith(
      expect.objectContaining({
        children: childrenMock,
        config: configMock,
        noRequired: false,
        scrollTopOnSubmit: true,
      }),
    );
  });

  it('should match snapshot with noRequired and scrollTopOnSubmit', () => {
    // Given
    const submitMock = jest.fn();
    const validateMock = jest.fn();
    const childrenMock = <div>any-children-mock</div>;
    const configMock = {
      description: 'any-description-mock',
      id: 'any-id-mock',
      title: 'any-title-mock',
    };

    // When
    const { container } = render(
      <FormComponent
        noRequired
        config={configMock}
        initialValues={{ any: 'initial-value-mock' }}
        scrollTopOnSubmit={false}
        onSubmit={submitMock}
        onValidate={validateMock}>
        {childrenMock}
      </FormComponent>,
    );

    // Then
    expect(container).toMatchSnapshot();
    expect(Form).toHaveBeenCalledOnce();
    expect(Form).toHaveBeenCalledWith(
      {
        children: expect.any(Function),
        config: configMock,
        decorators: undefined,
        initialValues: { any: 'initial-value-mock' },
        mutators: expect.anything(),
        noRequired: true,
        onSubmit: submitMock,
        scrollTopOnSubmit: false,
        validate: validateMock,
      },
      {},
    );
    expect(FormWrapperComponent).toHaveBeenCalledOnce();
    expect(FormWrapperComponent).toHaveBeenCalledWith(
      expect.objectContaining({
        children: childrenMock,
        config: configMock,
        noRequired: true,
        scrollTopOnSubmit: false,
      }),
    );
  });
});
