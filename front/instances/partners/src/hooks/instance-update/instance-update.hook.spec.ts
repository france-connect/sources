import { renderHook } from '@testing-library/react';
import { useLoaderData } from 'react-router';

import { MessageTypes } from '@fc/common';
import type { SchemaFieldType } from '@fc/dto2form';
import { removeEmptyValues } from '@fc/dto2form';
import { parseInitialValues, useDto2FormService } from '@fc/dto2form-service';

import { SubmitTypesMessage } from '../../enums';
import { usePostSubmit } from '../post-submit';
import { useInstanceUpdate } from './instance-update.hook';

jest.mock('../post-submit/post-submit.hook');

describe('useInstanceUpdate', () => {
  // Given
  const versionsMock = [
    {
      data: {
        name: 'Test Instance',
      },
    },
  ];

  const postSubmitMock = expect.any(Function);
  const schemaMock = Symbol('any-acme-schema') as unknown as SchemaFieldType[];
  const initialValuesMock = versionsMock[0].data;
  const submitHandlerMock = jest.fn();
  const formMock = {
    id: 'any-acme-form-id',
  };

  const UseDto2FormServiceResult = {
    form: formMock,
    initialValues: initialValuesMock,
    schema: schemaMock,
    submitHandler: submitHandlerMock,
  };

  beforeEach(() => {
    // Given
    jest.mocked(usePostSubmit).mockReturnValue(postSubmitMock);
    jest.mocked(parseInitialValues).mockReturnValue(initialValuesMock);
    jest.mocked(useDto2FormService).mockReturnValue(UseDto2FormServiceResult);
    jest.mocked(useLoaderData).mockReturnValue({
      data: {
        payload: {
          versions: versionsMock,
        },
      },
    });
  });

  it('should call useLoaderData', () => {
    // When
    renderHook(() => useInstanceUpdate());

    // Then
    expect(useLoaderData).toHaveBeenCalledExactlyOnceWith();
  });

  it('should call useDto2FormService with parameter', () => {
    // When
    renderHook(() => useInstanceUpdate());

    // Then
    expect(useDto2FormService).toHaveBeenCalledExactlyOnceWith('InstancesUpdate');
  });

  it('should call usePostSubmit with parameter', () => {
    // When
    renderHook(() => useInstanceUpdate());

    // Then
    expect(usePostSubmit).toHaveBeenCalledExactlyOnceWith(
      SubmitTypesMessage.INSTANCE_SUCCESS_UPDATE,
      MessageTypes.SUCCESS,
    );
  });

  it('should call parseInitialValues with parameters', () => {
    // When
    renderHook(() => useInstanceUpdate());

    // Then
    expect(parseInitialValues).toHaveBeenCalledExactlyOnceWith(schemaMock, versionsMock[0].data);
  });

  it('should return the correct configuration', () => {
    // When
    const { result } = renderHook(() => useInstanceUpdate());

    // Then
    expect(result.current).toStrictEqual({
      config: {
        ...formMock,
        title: versionsMock[0].data.name,
      },
      initialValues: initialValuesMock,
      postSubmit: postSubmitMock,
      preSubmit: removeEmptyValues,
      schema: schemaMock,
      submitHandler: submitHandlerMock,
    });
  });

  it('should not return the config title, when title is undefined in version', () => {
    // Given
    jest.mocked(useLoaderData).mockReturnValue({
      data: {
        payload: {
          versions: [{}],
        },
      },
    });

    // When
    const { result } = renderHook(() => useInstanceUpdate());

    // Then
    expect(result.current).toStrictEqual(
      expect.objectContaining({
        config: {
          ...formMock,
          title: undefined,
        },
      }),
    );
  });

  it('should not return the config title, when versions is empty', () => {
    // Given
    jest.mocked(useLoaderData).mockReturnValue({
      data: {
        payload: {
          versions: [],
        },
      },
    });

    // When
    const { result } = renderHook(() => useInstanceUpdate());

    // Then
    expect(result.current).toStrictEqual(
      expect.objectContaining({
        config: {
          ...formMock,
          title: undefined,
        },
      }),
    );
  });
});
