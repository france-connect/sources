import { render } from '@testing-library/react';
import React from 'react';

import { sortByKey } from '@fc/common';
import { ConfigService } from '@fc/config';
import type { FormConfigInterface } from '@fc/forms';
import { FieldTypes, FormComponent, FormConfigContext } from '@fc/forms';

import { useFormSubmit } from '../../hooks';
import type { SchemaFieldType } from '../../types';
import { Dto2InputComponent } from '../dto2input';
import { Dto2SectionComponent } from '../dto2section';
import { Dto2FormComponent } from './dto2form.component';

// Given
jest.mock('../dto2input/dto2input.component');
jest.mock('../dto2section/dto2section.component');
jest.mock('../../hooks/form-submit/form-submit.hook');

describe('Dto2FormComponent', () => {
  // Given
  const initialValuesMock = {};
  const submitHandlerMock = jest.fn();
  const onValidateMock = jest.fn();
  const schemaMock = [
    { name: 'any-name-1-mock', order: 1, type: FieldTypes.TEXT } as unknown as SchemaFieldType,
    { name: 'any-name-2-mock', order: 3, type: FieldTypes.TEXT } as unknown as SchemaFieldType,
    { name: 'any-section-mock', order: 2, type: 'section' } as unknown as SchemaFieldType,
    { name: 'any-name-3-mock', order: 4, type: FieldTypes.TEXT } as unknown as SchemaFieldType,
  ];
  const submitLabelMock = 'any-submit-label-mock';
  const configMock = {
    id: expect.any(String),
    submitLabel: submitLabelMock,
    validateOnSubmit: true,
  } as FormConfigInterface;

  const onSubmitMock = jest.fn();
  const onPostSubmitMock = jest.fn();
  const onPreSubmitMock = jest.fn();

  beforeEach(() => {
    // Given
    jest.mocked(useFormSubmit).mockReturnValue(submitHandlerMock);
    jest.mocked(ConfigService.get).mockReturnValue({ validateOnSubmit: true });
    jest
      .mocked(FormComponent)
      .mockImplementation(({ children }) => <div data-mockid="FormComponent">{children}</div>);

    jest
      .mocked(FormConfigContext.Provider)
      .mockImplementation(({ children }) => (
        <div data-mockid="FormConfigContextProvider">{children}</div>
      ));
  });

  it('should match the snapshot', () => {
    // When
    const { container } = render(
      <Dto2FormComponent
        config={configMock}
        initialValues={initialValuesMock}
        schema={schemaMock}
        onSubmit={onSubmitMock}
        onValidate={onValidateMock}
      />,
    );

    // Then
    expect(container).toMatchSnapshot();
  });

  it('should call FormComponent', () => {
    // When
    render(
      <Dto2FormComponent
        config={configMock}
        initialValues={initialValuesMock}
        schema={schemaMock}
        onSubmit={onSubmitMock}
        onValidate={onValidateMock}
      />,
    );

    // Then
    expect(FormComponent).toHaveBeenCalledOnce();
    expect(FormComponent).toHaveBeenCalledWith(
      {
        children: expect.any(Object),
        config: configMock,
        initialValues: initialValuesMock,
        onSubmit: submitHandlerMock,
        onValidate: onValidateMock,
      },
      undefined,
    );
  });

  it('should memoize a children renderer function', () => {
    // Given
    const useMemoSpy = jest.spyOn(React, 'useMemo');

    // When
    render(
      <Dto2FormComponent
        config={configMock}
        initialValues={initialValuesMock}
        schema={schemaMock}
        onSubmit={onSubmitMock}
        onValidate={onValidateMock}
      />,
    );

    // Then
    expect(useMemoSpy).toHaveBeenCalledOnce();
    expect(useMemoSpy).toHaveBeenCalledWith(expect.any(Function), [schemaMock, configMock]);
  });

  it('should call and use the useFormSubmit hook with on[X]Submit params', () => {
    // When
    render(
      <Dto2FormComponent
        config={configMock}
        initialValues={initialValuesMock}
        schema={schemaMock}
        onPostSubmit={onPostSubmitMock}
        onPreSubmit={onPreSubmitMock}
        onSubmit={onSubmitMock}
        onValidate={onValidateMock}
      />,
    );

    // Then
    expect(useFormSubmit).toHaveBeenCalledOnce();
    expect(useFormSubmit).toHaveBeenCalledWith(onSubmitMock, onPreSubmitMock, onPostSubmitMock);
  });

  it('should sort the rendered children', () => {
    // Given
    const orderSorterMock = jest.fn();
    jest.mocked(sortByKey).mockReturnValueOnce(orderSorterMock);

    // When
    render(
      <Dto2FormComponent
        config={configMock}
        initialValues={initialValuesMock}
        schema={schemaMock}
        onSubmit={onSubmitMock}
        onValidate={onValidateMock}
      />,
    );

    // Then
    expect(sortByKey).toHaveBeenCalledOnce();
    expect(sortByKey).toHaveBeenCalledWith('order');
    expect(orderSorterMock).toHaveBeenCalledTimes(3);
    // input
    expect(Dto2InputComponent).toHaveBeenCalledTimes(3);
    expect(Dto2InputComponent).toHaveBeenNthCalledWith(1, { field: schemaMock[0] }, undefined);
    expect(Dto2InputComponent).toHaveBeenNthCalledWith(2, { field: schemaMock[1] }, undefined);
    expect(Dto2InputComponent).toHaveBeenNthCalledWith(3, { field: schemaMock[3] }, undefined);
    // section
    expect(Dto2SectionComponent).toHaveBeenCalledOnce();
    expect(Dto2SectionComponent).toHaveBeenNthCalledWith(1, { field: schemaMock[2] }, undefined);
  });

  it('should call FormComponent without the validate function when Dto2Form.validateOnSubmit is false', () => {
    // Given
    const configWithoutValidateMock = {
      ...configMock,
      validateOnSubmit: false,
    };
    // When
    render(
      <Dto2FormComponent
        config={configWithoutValidateMock}
        initialValues={initialValuesMock}
        schema={schemaMock}
        onSubmit={onSubmitMock}
        onValidate={onValidateMock}
      />,
    );

    // Then
    expect(FormComponent).toHaveBeenCalledOnce();
    expect(FormComponent).toHaveBeenCalledWith(
      {
        children: expect.any(Object),
        config: configWithoutValidateMock,
        initialValues: initialValuesMock,
        onSubmit: submitHandlerMock,
        onValidate: undefined,
      },
      undefined,
    );
  });
});
