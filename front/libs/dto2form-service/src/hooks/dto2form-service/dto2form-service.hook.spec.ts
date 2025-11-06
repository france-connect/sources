import { renderHook } from '@testing-library/react';
import { useLoaderData } from 'react-router';

import { useSafeContext } from '@fc/common';

import { Dto2FormServiceContext } from '../../context';
import { parseInitialValues, removeReadOnlyFields } from '../../helpers';
import { useDto2FormSubmitHandler } from '../dto2form-submit-handler';
import { useDto2FormService } from './dto2form-service.hook';

jest.mock('../dto2form-submit-handler/dto2form-submit-handler.hook');
jest.mock('../../helpers/parse-initial-values/parse-initial-values.helper');
jest.mock('../../helpers/remove-readonly-fields/remove-readonly-fields.helper');

describe('useDto2FormService', () => {
  const dataMock = Symbol('data-mock');
  const schemaMock = Symbol('schema-mock');
  const formMock = {
    endpoints: {
      load: {
        path: '/test/load',
      },
      schema: {
        path: '/test/schema',
      },
    },
    form: {
      id: 'any-form-id-mock',
    },
  };
  const contextMock = {
    getConfigEndpointsById: jest.fn().mockReturnValue(formMock.endpoints),
    getConfigFormById: jest.fn().mockReturnValue(formMock),
  };

  beforeEach(() => {
    jest.mocked(useLoaderData).mockReturnValue({ data: dataMock, schema: schemaMock });
    jest.mocked(useSafeContext).mockReturnValue(contextMock);
  });

  it('should get config helpers from Dto2FormServiceContext', () => {
    // When
    renderHook(() => useDto2FormService('any-form-id-mock'));

    // Then
    expect(useSafeContext).toHaveBeenCalledExactlyOnceWith(Dto2FormServiceContext);
  });

  it('should get data and schema from loader data', () => {
    // When
    renderHook(() => useDto2FormService('any-form-id-mock'));

    // Then
    expect(useLoaderData).toHaveBeenCalledExactlyOnceWith();
  });

  it('should retrieve endpoint from config for the route id', () => {
    // When
    renderHook(() => useDto2FormService('any-form-id-mock'));

    // Then
    expect(contextMock.getConfigEndpointsById).toHaveBeenCalledExactlyOnceWith('any-form-id-mock');
  });

  it('should call useDto2FormSubmitHandler with endpoints from config', () => {
    // When
    renderHook(() => useDto2FormService('any-form-id-mock'));

    // Then
    expect(useDto2FormSubmitHandler).toHaveBeenCalledExactlyOnceWith(formMock.endpoints);
  });

  it('should call parseInitialValues with schema and data', () => {
    // When
    renderHook(() => useDto2FormService('any-form-id-mock'));

    // Then
    expect(parseInitialValues).toHaveBeenCalledExactlyOnceWith(schemaMock, dataMock);
  });

  it('should call removeReadOnlyFields when loadedValues are not defined', () => {
    // Given
    jest.mocked(useLoaderData).mockReturnValue({
      data: null,
      schema: schemaMock,
    });

    // When
    renderHook(() => useDto2FormService('any-form-id-mock'));

    // Then
    expect(removeReadOnlyFields).toHaveBeenCalledWith(schemaMock);
  });

  it('should return initial values, schema and submit handler', () => {
    // Given
    const initialValuesMock = { field1: 'value1' };
    const submitHandlerMock = jest.fn();

    jest.mocked(parseInitialValues).mockReturnValueOnce(initialValuesMock);
    jest.mocked(useDto2FormSubmitHandler).mockReturnValueOnce(submitHandlerMock);

    // When
    const { result } = renderHook(() => useDto2FormService('any-form-id-mock'));

    // Then
    expect(result.current).toEqual({
      form: formMock,
      initialValues: initialValuesMock,
      schema: schemaMock,
      submitHandler: submitHandlerMock,
    });
    expect(parseInitialValues).toHaveBeenCalledExactlyOnceWith(schemaMock, dataMock);
  });
});
