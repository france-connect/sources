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
      noRequired: false,
      scrollTopOnSubmit: true,
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
        decorators: undefined,
        initialValues: { any: 'initial-value-mock' },
        mutators: expect.anything(),
        onSubmit: submitMock,
        validate: validateMock,
      },
      undefined,
    );
    expect(FormWrapperComponent).toHaveBeenCalledOnce();
    expect(FormWrapperComponent).toHaveBeenCalledWith(
      expect.objectContaining({
        children: childrenMock,
        config: configMock,
      }),
      undefined,
    );
  });

  it('should match snapshot with noRequired, scrollTopOnSubmit and submitLabel', () => {
    // Given
    const submitMock = jest.fn();
    const validateMock = jest.fn();
    const submitLabelMock = 'any-submit-label-mock';
    const childrenMock = <div>any-children-mock</div>;
    const configMock = {
      description: 'any-description-mock',
      id: 'any-id-mock',
      noRequired: true,
      scrollTopOnSubmit: false,
      submitLabel: submitLabelMock,
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
        decorators: undefined,
        initialValues: { any: 'initial-value-mock' },
        mutators: expect.anything(),
        onSubmit: submitMock,
        validate: validateMock,
      },
      undefined,
    );
    expect(FormWrapperComponent).toHaveBeenCalledOnce();
    expect(FormWrapperComponent).toHaveBeenCalledWith(
      expect.objectContaining({
        children: childrenMock,
        config: configMock,
      }),
      undefined,
    );
  });
});
