import { renderHook } from '@testing-library/react';
import { generatePath, useParams } from 'react-router';

import type { Dto2FormFormConfigInterface } from '../../interfaces';
import { Dto2FormService } from '../../services';
import { useSubmitHandler } from './submit-handler.hook';

jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useCallback: jest.fn((fn) => fn),
}));

jest.mock('../../services', () => ({
  Dto2FormService: {
    commit: jest.fn(),
  },
}));

describe('useSubmitHandler', () => {
  const formMock = {
    endpoints: {
      submit: {
        method: 'POST',
        path: '/test/submit',
      },
    },
  } as unknown as Dto2FormFormConfigInterface;
  const params = { id: '123' };

  const postUrl = '/test/submit/123';

  const Dto2FormServiceMock = jest.mocked(Dto2FormService);

  beforeEach(() => {
    jest.mocked(useParams).mockReturnValue(params);
    jest.mocked(generatePath).mockReturnValue(postUrl);
  });

  it('should return a callback function', () => {
    // When
    const { result } = renderHook(() => useSubmitHandler(formMock));

    // Then
    expect(result.current).toBeInstanceOf(Function);
  });

  it('should call Dto2FormService.commit with correct parameters', async () => {
    // Given
    const { result } = renderHook(() => useSubmitHandler(formMock));
    const data = { field1: 'value1', field2: 'value2' };

    // When
    await result.current(data);

    // Then
    expect(Dto2FormServiceMock.commit).toHaveBeenCalledWith(
      formMock.endpoints.submit.method,
      postUrl,
      data,
    );
  });

  it('should return errors if any', async () => {
    // Given
    const errorsMock = [{ some: 'error' }];
    Dto2FormServiceMock.commit.mockResolvedValueOnce(errorsMock);
    const { result } = renderHook(() => useSubmitHandler(formMock));

    // When
    const errors = await result.current({});

    // Then
    expect(errors).toEqual(errorsMock);
  });

  it('should return null if no errors', async () => {
    const errorsMock = undefined;
    Dto2FormServiceMock.commit.mockResolvedValueOnce(errorsMock);
    const { result } = renderHook(() => useSubmitHandler(formMock));

    // When
    const errors = await result.current({});

    // Then
    expect(errors).toBeNull();
  });
});
