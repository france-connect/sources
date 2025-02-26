import { render } from '@testing-library/react';
import React from 'react';

import { sortByKey } from '@fc/common';
import { ConfigService } from '@fc/config';
import { FieldTypes, FormComponent } from '@fc/forms';

import { useFormPreSubmit } from '../../hooks';
import type { SchemaFieldType } from '../../types';
import { DTO2InputComponent } from '../dto2input';
import { DTO2SectionComponent } from '../dto2section';
import { DTO2FormComponent } from './dto2form.component';

// Given
jest.mock('../dto2input/dto2input.component');
jest.mock('../dto2section/dto2section.component');
jest.mock('../../hooks/form-pre-submit/form-pre-submit.hook');

describe('DTO2FormComponent', () => {
  // Given
  const initialValuesMock = {};
  const onSubmitMock = jest.fn();
  const preSubmitMock = jest.fn();
  const onValidateMock = jest.fn();
  const schemaMock = [
    { name: 'any-name-1-mock', order: 1, type: FieldTypes.TEXT } as unknown as SchemaFieldType,
    { name: 'any-name-2-mock', order: 3, type: FieldTypes.TEXT } as unknown as SchemaFieldType,
    { name: 'any-section-mock', order: 2, type: 'section' } as unknown as SchemaFieldType,
    { name: 'any-name-3-mock', order: 4, type: FieldTypes.TEXT } as unknown as SchemaFieldType,
  ];
  const configMock = {
    id: expect.any(String),
  };

  beforeEach(() => {
    // Given
    jest.mocked(useFormPreSubmit).mockReturnValue(preSubmitMock);
    jest.mocked(ConfigService.get).mockReturnValue({ validateOnSubmit: true });
    jest
      .mocked(FormComponent)
      .mockImplementation(({ children }) => <div data-mockid="FormComponent">{children}</div>);
  });

  it('should match the snapshot', () => {
    // When
    const { container } = render(
      <DTO2FormComponent
        config={configMock}
        initialValues={initialValuesMock}
        schema={schemaMock}
        onSubmit={onSubmitMock}
        onValidate={onValidateMock}
      />,
    );

    // Then
    expect(container).toMatchSnapshot();
    expect(useFormPreSubmit).toHaveBeenCalledOnce();
    expect(useFormPreSubmit).toHaveBeenCalledWith(onSubmitMock);
    expect(FormComponent).toHaveBeenCalledOnce();
    expect(FormComponent).toHaveBeenCalledWith(
      {
        children: expect.any(Object),
        config: configMock,
        initialValues: initialValuesMock,
        onSubmit: preSubmitMock,
        onValidate: onValidateMock,
      },
      {},
    );
  });

  it('should memoize a children renderer function', () => {
    // Given
    const useMemoSpy = jest.spyOn(React, 'useMemo');

    // When
    render(
      <DTO2FormComponent
        config={configMock}
        initialValues={initialValuesMock}
        schema={schemaMock}
        onSubmit={onSubmitMock}
        onValidate={onValidateMock}
      />,
    );

    // Then
    expect(useMemoSpy).toHaveBeenCalledOnce();
    expect(useMemoSpy).toHaveBeenCalledWith(expect.any(Function), [schemaMock, configMock.id]);
  });

  it('should call and use the useFormPreSubmit hook with param', () => {
    // When
    render(
      <DTO2FormComponent
        config={configMock}
        initialValues={initialValuesMock}
        schema={schemaMock}
        onSubmit={onSubmitMock}
        onValidate={onValidateMock}
      />,
    );

    // Then
    expect(useFormPreSubmit).toHaveBeenCalledOnce();
    expect(useFormPreSubmit).toHaveBeenCalledWith(onSubmitMock);
  });

  it('should sort the rendered children', () => {
    // Given
    const orderSorterMock = jest.fn();
    jest.mocked(sortByKey).mockReturnValueOnce(orderSorterMock);

    // When
    render(
      <DTO2FormComponent
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
    expect(DTO2InputComponent).toHaveBeenCalledTimes(3);
    expect(DTO2InputComponent).toHaveBeenNthCalledWith(1, { field: schemaMock[0] }, {});
    expect(DTO2InputComponent).toHaveBeenNthCalledWith(2, { field: schemaMock[1] }, {});
    expect(DTO2InputComponent).toHaveBeenNthCalledWith(3, { field: schemaMock[3] }, {});
    // section
    expect(DTO2SectionComponent).toHaveBeenCalledOnce();
    expect(DTO2SectionComponent).toHaveBeenNthCalledWith(1, { field: schemaMock[2] }, {});
  });

  it('should call FormComponent without the validate function when DTO2Form.validateOnSubmit is false', () => {
    // Given
    jest.mocked(ConfigService.get).mockReturnValueOnce({ validateOnSubmit: false });

    // When
    render(
      <DTO2FormComponent
        config={configMock}
        initialValues={initialValuesMock}
        schema={schemaMock}
        onSubmit={onSubmitMock}
        onValidate={onValidateMock}
      />,
    );

    // Then
    expect(ConfigService.get).toHaveBeenCalledOnce();
    expect(ConfigService.get).toHaveBeenCalledWith('DTO2Form');
    expect(FormComponent).toHaveBeenCalledOnce();
    expect(FormComponent).toHaveBeenCalledWith(
      {
        children: expect.any(Object),
        config: configMock,
        initialValues: initialValuesMock,
        onSubmit: preSubmitMock,
        onValidate: undefined,
      },
      {},
    );
  });
});
