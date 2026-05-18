import { act, renderHook } from '@testing-library/react';
import { useLoaderData, useNavigate } from 'react-router';

import { PartnersService } from '@fc/core-partners';

import { usePostSubmit } from '../post-submit/post-submit.hook';
import { useLinkableInstancesToServiceProvider } from './service-provider-link-instances.hook';

jest.mock('../post-submit/post-submit.hook');

const mockInstanceId = 'instance-id-1';

const baseInstance = {
  createdAt: '2024-01-01T00:00:00.000Z',
  currentVersion: {
    data: {
      // eslint-disable-next-line @typescript-eslint/naming-convention -- API payload uses client_id
      client_id: 'client-id-1',
      name: 'Instance 1',
      signupId: 'DP-1234',
    },
  },
  environment: 'SANDBOX',
  id: mockInstanceId,
  updatedAt: '2024-01-01T00:00:00.000Z',
};

describe('useLinkableInstancesToServiceProvider', () => {
  const navigateMock = jest.fn();
  const postSubmitMock = jest.fn().mockResolvedValue(undefined);

  beforeEach(() => {
    jest.clearAllMocks();
    jest.mocked(useNavigate).mockReturnValue(navigateMock as never);
    jest.mocked(usePostSubmit).mockReturnValue(postSubmitMock);
    jest.mocked(PartnersService.linkInstancesToServiceProvider).mockResolvedValue(undefined);
    jest.mocked(useLoaderData).mockReturnValue({
      payload: {
        datapassRequestId: 'DP-1234',
        linkableInstances: [baseInstance],
        serviceProviderId: 'service-provider-id-1',
      },
    } as never);
  });

  it('should return link instances loader payload', () => {
    // When
    const { result } = renderHook(() => useLinkableInstancesToServiceProvider());

    // Then
    expect(result.current.serviceProviderName).toBeUndefined();
    expect(result.current.linkableInstances).toStrictEqual([baseInstance]);
  });

  describe('initialValues', () => {
    it('should preselect instance when signupId matches datapassRequestId', () => {
      // When
      const { result } = renderHook(() => useLinkableInstancesToServiceProvider());

      // Then
      expect(result.current.initialValues).toStrictEqual({
        instances: { [mockInstanceId]: true },
      });
    });

    it('should not preselect instance when signupId does not match datapassRequestId', () => {
      // Given
      jest.mocked(useLoaderData).mockReturnValueOnce({
        payload: {
          datapassRequestId: 'OTHER-ID',
          linkableInstances: [baseInstance],
          serviceProviderId: 'service-provider-id-1',
        },
      } as never);

      // When
      const { result } = renderHook(() => useLinkableInstancesToServiceProvider());

      // Then
      expect(result.current.initialValues).toStrictEqual({
        instances: { [mockInstanceId]: false },
      });
    });
  });

  describe('validateHandler', () => {
    it('should return an error when no instance is selected', () => {
      // When
      const { result } = renderHook(() => useLinkableInstancesToServiceProvider());
      const error = result.current.validateHandler({ instances: { [mockInstanceId]: false } });

      // Then
      expect(error).toStrictEqual({ instances: 'error' });
    });

    it('should return undefined when at least one instance is selected', () => {
      // When
      const { result } = renderHook(() => useLinkableInstancesToServiceProvider());
      const error = result.current.validateHandler({ instances: { [mockInstanceId]: true } });

      // Then
      expect(error).toBeUndefined();
    });
  });

  describe('handleSubmit', () => {
    it('should call linkInstancesToServiceProvider with selected instance ids', async () => {
      // When
      const { result } = renderHook(() => useLinkableInstancesToServiceProvider());
      await act(async () => {
        await result.current.handleSubmit({ instances: { [mockInstanceId]: true } });
      });

      // Then
      expect(PartnersService.linkInstancesToServiceProvider).toHaveBeenCalledExactlyOnceWith({
        instanceIds: [mockInstanceId],
        serviceProviderId: 'service-provider-id-1',
      });
      expect(postSubmitMock).toHaveBeenCalledOnce();
    });

    it('should exclude unselected instances from the payload', async () => {
      // When
      const { result } = renderHook(() => useLinkableInstancesToServiceProvider());
      await act(async () => {
        await result.current.handleSubmit({ instances: { [mockInstanceId]: false } });
      });

      // Then
      expect(PartnersService.linkInstancesToServiceProvider).toHaveBeenCalledExactlyOnceWith({
        instanceIds: [],
        serviceProviderId: 'service-provider-id-1',
      });
    });
  });

  describe('handleCancel', () => {
    it('should navigate back when called', () => {
      // When
      const { result } = renderHook(() => useLinkableInstancesToServiceProvider());
      act(() => {
        result.current.handleCancel();
      });

      // Then
      expect(navigateMock).toHaveBeenCalledExactlyOnceWith('..');
    });
  });
});
