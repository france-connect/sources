import { renderHook } from '@testing-library/react';
import { generatePath, useParams } from 'react-router';

import type { Dto2FormFormConfigInterface } from '@fc/dto2form';

import { dto2FormServiceCommit } from '../../services';
import { useDto2FormSubmitHandler } from './dto2form-submit-handler.hook';

jest.mock('../../services/dto2form-service-commit/dto2form-service-commit.service');

describe('useDto2FormSubmitHandler', () => {
  const formMock = {
    endpoints: {
      submit: {
        method: 'POST',
        path: '/test/submit',
      },
    },
  } as unknown as Dto2FormFormConfigInterface;
  const paramsMock = { id: '123' };
  const postUrlMock = '/test/submit/123';

  beforeEach(() => {
    jest.mocked(useParams).mockReturnValue(paramsMock);
    jest.mocked(generatePath).mockReturnValue(postUrlMock);
  });

  it('should return a callback function', () => {
    // When
    const { result } = renderHook(() => useDto2FormSubmitHandler(formMock.endpoints));

    // Then
    expect(result.current).toBeInstanceOf(Function);
  });

  it('should call dto2FormServiceCommit with the correct parameters', async () => {
    // Given
    const dataMock = { field1: 'value1', field2: 'value2' };

    // When
    const { result } = renderHook(() => useDto2FormSubmitHandler(formMock.endpoints));
    await result.current(dataMock);

    // Then
    expect(dto2FormServiceCommit).toHaveBeenCalledWith('POST', '/test/submit/123', dataMock);
  });

  it('should return errors if any', async () => {
    // Given
    const errorsMock = [{ some: 'error' }];
    jest.mocked(dto2FormServiceCommit).mockResolvedValueOnce(errorsMock);

    // When
    const { result } = renderHook(() => useDto2FormSubmitHandler(formMock.endpoints));
    const errors = await result.current({});

    // Then
    expect(errors).toEqual(errorsMock);
  });

  it('should return null if no errors', async () => {
    // Given
    const errorsMock = undefined;
    jest.mocked(dto2FormServiceCommit).mockResolvedValueOnce(errorsMock);

    // When
    const { result } = renderHook(() => useDto2FormSubmitHandler(formMock.endpoints));
    const errors = await result.current({});

    // Then
    expect(errors).toBeUndefined();
  });
});
