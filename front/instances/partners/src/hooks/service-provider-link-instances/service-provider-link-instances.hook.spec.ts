import { act, renderHook } from '@testing-library/react';
import { useLoaderData, useRevalidator } from 'react-router';

import { useSelectable } from '@fc/common';
import { PartnersAlertVariants, PartnersService } from '@fc/core-partners';
import { useNavigateWithState } from '@fc/routing';

import { useLinkableInstancesToServiceProvider } from './service-provider-link-instances.hook';

describe('useLinkableInstancesToServiceProvider', () => {
  // Given
  const goBackMock = jest.fn();
  const mockInstanceId = 'instance-id-1';

  const goBackWithSuccessMock = jest.fn();
  const revalidateMock = jest.fn();
  const toggleAllItemsMock = jest.fn();
  const toggleOneItemMock = jest.fn();
  const checkIfItemIsSelectedMock = jest.fn(() => false);

  const baseInstance = {
    createdAt: '2024-01-01T00:00:00.000Z',
    currentVersion: {
      data: {
        // @NOTE API payload uses client_id
        // eslint-disable-next-line @typescript-eslint/naming-convention
        client_id: 'client-id-1',
        name: 'Instance 1',
        signupId: 'DP-1234',
      },
    },
    environment: 'SANDBOX',
    id: mockInstanceId,
    updatedAt: '2024-01-01T00:00:00.000Z',
  };

  const selectableMock = {
    checkIfItemIsSelected: checkIfItemIsSelectedMock,
    isAllItemsSelected: false,
    selection: new Set<string>([mockInstanceId]),
    toggleAllItems: toggleAllItemsMock,
    toggleOneItem: toggleOneItemMock,
  };

  beforeEach(() => {
    // Given
    jest.mocked(PartnersService.linkInstancesToServiceProvider).mockResolvedValue(undefined);
    jest.mocked(useLoaderData).mockReturnValue({
      payload: {
        datapassRequestId: 'DP-1234',
        linkableInstances: [baseInstance],
        serviceProviderId: 'service-provider-id-1',
        serviceProviderName: 'any-service-provider-name-mock',
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
    jest.mocked(useSelectable).mockReturnValue(selectableMock);
  });

  it('should return link instances loader payload', () => {
    // When
    const { result } = renderHook(() => useLinkableInstancesToServiceProvider());

    // Then
    expect(result.current.serviceProviderName).toBe('any-service-provider-name-mock');
    expect(result.current.linkableInstances).toStrictEqual([baseInstance]);
  });

  describe('selectable', () => {
    it('should call useSelectable with initialSelection matching datapassRequestId', () => {
      // When
      const { result } = renderHook(() => useLinkableInstancesToServiceProvider());
      const { getItemId } = jest.mocked(useSelectable).mock.calls[0][0];

      // Then
      expect(useSelectable).toHaveBeenCalledExactlyOnceWith({
        getItemId: expect.any(Function),
        initialSelection: new Set([mockInstanceId]),
        items: [baseInstance],
      });
      expect(getItemId(baseInstance)).toBe(mockInstanceId);
      expect(result.current.selectable).toBe(selectableMock);
      expect(result.current.canSubmit).toBeTrue();
    });

    it('should call useSelectable with an empty initialSelection when signupId does not match', () => {
      // Given
      jest.mocked(useLoaderData).mockReturnValueOnce({
        payload: {
          datapassRequestId: 'OTHER-ID',
          linkableInstances: [baseInstance],
          serviceProviderId: 'service-provider-id-1',
        },
      });

      // When
      renderHook(() => useLinkableInstancesToServiceProvider());

      // Then
      expect(useSelectable).toHaveBeenCalledExactlyOnceWith({
        getItemId: expect.any(Function),
        initialSelection: new Set(),
        items: [baseInstance],
      });
    });

    it('should call useSelectable with an empty initialSelection when signupId is missing', () => {
      // Given
      jest.mocked(useLoaderData).mockReturnValueOnce({
        payload: {
          datapassRequestId: 'DP-1234',
          linkableInstances: [
            {
              ...baseInstance,
              currentVersion: {
                ...baseInstance.currentVersion,
                data: {
                  ...baseInstance.currentVersion.data,
                  signupId: undefined,
                },
              },
            },
          ],
          serviceProviderId: 'service-provider-id-1',
        },
      });

      // When
      renderHook(() => useLinkableInstancesToServiceProvider());

      // Then
      expect(useSelectable).toHaveBeenCalledExactlyOnceWith({
        getItemId: expect.any(Function),
        initialSelection: new Set(),
        items: expect.any(Array),
      });
    });

    it('should set canSubmit to false when selection is empty', () => {
      // Given
      jest.mocked(useSelectable).mockReturnValueOnce({
        ...selectableMock,
        selection: new Set(),
      });

      // When
      const { result } = renderHook(() => useLinkableInstancesToServiceProvider());

      // Then
      expect(result.current.canSubmit).toBeFalse();
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
        await result.current.handleSubmit();
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
        variant: PartnersAlertVariants.INSTANCE,
      });
    });

    it('should submit an empty list when selection is empty', async () => {
      // Given
      jest.mocked(useSelectable).mockReturnValueOnce({
        ...selectableMock,
        selection: new Set(),
      });

      // When
      const { result } = renderHook(() => useLinkableInstancesToServiceProvider());
      await act(async () => {
        await result.current.handleSubmit();
      });

      // Then
      expect(PartnersService.linkInstancesToServiceProvider).toHaveBeenCalledExactlyOnceWith({
        instanceIds: [],
        serviceProviderId: 'service-provider-id-1',
      });
    });

    it('should disable canSubmit while submit is pending', async () => {
      // Given
      let resolveSubmit: (() => void) | undefined;
      jest.mocked(PartnersService.linkInstancesToServiceProvider).mockImplementationOnce(
        () =>
          new Promise((resolve) => {
            resolveSubmit = () => resolve(undefined);
          }),
      );

      const { result } = renderHook(() => useLinkableInstancesToServiceProvider());

      // When
      let firstSubmit: Promise<void> | undefined;
      await act(async () => {
        firstSubmit = result.current.handleSubmit();
      });

      // Then
      expect(result.current.canSubmit).toBeFalse();

      // When
      await act(async () => {
        resolveSubmit?.();
        await firstSubmit;
      });

      // Then
      expect(result.current.canSubmit).toBeTrue();
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
