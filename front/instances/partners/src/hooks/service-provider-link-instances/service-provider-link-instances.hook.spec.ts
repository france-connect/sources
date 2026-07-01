import { act, renderHook } from '@testing-library/react';
import { useLoaderData, useRevalidator } from 'react-router';

import { PartnersService } from '@fc/core-partners';
import { useNavigateWithState } from '@fc/routing';

import { useLinkableInstancesToServiceProvider } from './service-provider-link-instances.hook';

describe('useLinkableInstancesToServiceProvider', () => {
  // Given
  const goBackMock = jest.fn();
  const mockInstanceId = 'instance-id-1';

  const goBackWithSuccessMock = jest.fn();
  const revalidateMock = jest.fn();

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

  beforeEach(() => {
    // Given
    jest.mocked(PartnersService.linkInstancesToServiceProvider).mockResolvedValue(undefined);
    jest.mocked(useLoaderData).mockReturnValue({
      payload: {
        datapassRequestId: 'DP-1234',
        linkableInstances: [baseInstance],
        serviceProviderId: 'service-provider-id-1',
      },
    });
    jest.mocked(useNavigateWithState).mockReturnValue({
      goBack: goBackMock,
      goBackWithError: jest.fn(),
      goBackWithSuccess: goBackWithSuccessMock,
      navigateWithState: jest.fn(),
    });
    jest.mocked(useRevalidator).mockReturnValue({
      revalidate: revalidateMock,
      state: 'idle',
    });
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
      });

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

  it('should call useRevalidator', () => {
    // When
    renderHook(() => useLinkableInstancesToServiceProvider());

    // Then
    expect(useRevalidator).toHaveBeenCalledExactlyOnceWith();
  });

  describe('handleSubmit', () => {
    it('should call revalidate, linkInstancesToServiceProvider with selected instance ids and goBackWithSuccess', async () => {
      // When
      const { result } = renderHook(() => useLinkableInstancesToServiceProvider());
      await act(async () => {
        await result.current.handleSubmit({ instances: { [mockInstanceId]: true } });
      });

      // Then
      expect(revalidateMock).toHaveBeenCalledExactlyOnceWith();
      expect(PartnersService.linkInstancesToServiceProvider).toHaveBeenCalledExactlyOnceWith({
        instanceIds: [mockInstanceId],
        serviceProviderId: 'service-provider-id-1',
      });
      expect(goBackWithSuccessMock).toHaveBeenCalledExactlyOnceWith({
        message: 'Partners.serviceProviderPage.linkInstances.success.description',
        title: 'Partners.instances.successLink',
      });
    });

    it('should exclude unselected instances from the payload', async () => {
      // When
      const { result } = renderHook(() => useLinkableInstancesToServiceProvider());
      await act(async () => {
        await result.current.handleSubmit({ instances: { [mockInstanceId]: false } });
      });

      // Then
      expect(revalidateMock).toHaveBeenCalledExactlyOnceWith();
      expect(PartnersService.linkInstancesToServiceProvider).toHaveBeenCalledExactlyOnceWith({
        instanceIds: [],
        serviceProviderId: 'service-provider-id-1',
      });
    });
  });

  describe('handleCancel', () => {
    it('should call goBack', () => {
      // When
      const { result } = renderHook(() => useLinkableInstancesToServiceProvider());
      result.current.handleCancel();

      // Then
      expect(goBackMock).toHaveBeenCalledOnce();
    });
  });
});
