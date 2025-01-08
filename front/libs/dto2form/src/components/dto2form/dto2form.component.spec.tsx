import { render } from '@testing-library/react';
import React from 'react';

import { sortByKey } from '@fc/common';
import { FieldTypes, FormComponent } from '@fc/forms';

import type { JSONFieldType } from '../../types';
import { DTO2FormComponent } from './dto2form.component';

jest.mock('../dto2field/dto2field.component');

describe('DTO2FormComponent', () => {
  // Given
  const initialValuesMock = {};
  const onSubmitMock = jest.fn();
  const onValidateMock = jest.fn();
  const schemaMock = [
    { name: 'any-name-1-mock', order: 1, type: FieldTypes.TEXT } as unknown as JSONFieldType,
    { name: 'any-name-3-mock', order: 3, type: FieldTypes.TEXT } as unknown as JSONFieldType,
    { name: 'any-name-2-mock', order: 2, type: FieldTypes.TEXT } as unknown as JSONFieldType,
  ];
  const configMock = {
    id: expect.any(String),
  };

  beforeEach(() => {
    // Given
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
    expect(FormComponent).toHaveBeenCalledOnce();
    expect(FormComponent).toHaveBeenCalledWith(
      {
        children: expect.any(Object),
        config: configMock,
        initialValues: initialValuesMock,
        onSubmit: onSubmitMock,
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
    expect(orderSorterMock).toHaveBeenCalledTimes(2);
  });
});
