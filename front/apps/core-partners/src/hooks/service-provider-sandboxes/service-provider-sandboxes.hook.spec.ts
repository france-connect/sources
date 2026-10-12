import { renderHook } from '@testing-library/react';
import { useLoaderData } from 'react-router';

import { MessageTypes } from '@fc/common';
import { ConfigService } from '@fc/config';
import { t } from '@fc/i18n';
import { useModal } from '@fc/modal';

import { CorePartnersOptions, PartnersAlertVariants } from '../../enums';
import type { InstanceInterface } from '../../interfaces';
import { PartnersService } from '../../loaders';
import { useDeletionNotifier } from '../deletion-notifier';
import { useServiceProviderSandboxes } from './service-provider-sandboxes.hook';

jest.mock('../../loaders/partners/partners.service');
jest.mock('../deletion-notifier/deletion-notifier.hook');

describe('useServiceProviderSandboxes', () => {
  // Given
  const spConfigurationDocUrlMock = 'https://example.com/sp-configuration-doc-mock';

  const configMock = {
    spConfigurationDocUrl: spConfigurationDocUrlMock,
  };

  const instanceMock = {
    currentVersion: { data: { name: 'any-instance-name-mock' } },
    id: 'any-instance-id-mock',
  } as unknown as InstanceInterface;

  const openModalMock = jest.fn();
  const notifyDeletionMock = jest.fn();

  beforeEach(() => {
    // Given
    jest.mocked(ConfigService.get).mockReturnValue(configMock);
    jest.mocked(useLoaderData).mockReturnValue({
      payload: {
        linkableInstances: [],
      },
    });
    jest.mocked(useModal).mockReturnValue({
      closeModal: jest.fn(),
      currentModal: null,
      openModal: openModalMock,
    });
    jest.mocked(useDeletionNotifier).mockReturnValue({ notifyDeletion: notifyDeletionMock });
  });

  it('should call ConfigService.get with ExternalUrls', () => {
    // When
    renderHook(() => useServiceProviderSandboxes());

    // Then
    expect(ConfigService.get).toHaveBeenCalledExactlyOnceWith(
      CorePartnersOptions.CONFIG_EXTERNAL_URLS,
    );
  });

  it('should call useDeletionNotifier with the sandbox alert variant', () => {
    // When
    renderHook(() => useServiceProviderSandboxes());

    // Then
    expect(useDeletionNotifier).toHaveBeenCalledExactlyOnceWith(PartnersAlertVariants.INSTANCE);
  });

  it('should call useLoaderData', () => {
    // When
    renderHook(() => useServiceProviderSandboxes());

    // Then
    expect(useLoaderData).toHaveBeenCalledExactlyOnceWith();
  });

  it('should return spConfigurationDocUrl and hasUnlinkedInstances from loader data', () => {
    // When
    const { result } = renderHook(() => useServiceProviderSandboxes());

    // Then
    expect(result.current).toStrictEqual({
      confirmDeleteInstance: expect.any(Function),
      deleteInstanceHandler: expect.any(Function),
      hasUnlinkedInstances: false,
      spConfigurationDocUrl: spConfigurationDocUrlMock,
    });
  });

  it('should return hasUnlinkedInstances as true when linkableInstances is not empty', () => {
    // Given
    jest.mocked(useLoaderData).mockReturnValueOnce({
      payload: {
        linkableInstances: [{ id: 'instance-id-mock' }],
      },
    });

    // When
    const { result } = renderHook(() => useServiceProviderSandboxes());

    // Then
    expect(result.current.hasUnlinkedInstances).toBeTrue();
  });

  describe('deleteInstanceHandler', () => {
    it('should open the delete-instance modal with the confirmation handler', () => {
      // Given
      const { result } = renderHook(() => useServiceProviderSandboxes());

      // When
      result.current.deleteInstanceHandler(instanceMock);

      // Then
      expect(openModalMock).toHaveBeenCalledExactlyOnceWith('delete-instance', {
        instanceName: 'any-instance-name-mock',
        onConfirm: expect.any(Function),
      });
    });

    it('should delete the instance of the row when the modal is confirmed', async () => {
      // Given
      let modalProps = {} as { onConfirm: () => Promise<void> };

      openModalMock.mockImplementationOnce(
        (_id: string, props: { onConfirm: () => Promise<void> }) => {
          modalProps = props;
        },
      );

      const { result } = renderHook(() => useServiceProviderSandboxes());
      result.current.deleteInstanceHandler(instanceMock);

      // When
      await modalProps.onConfirm();

      // Then
      expect(PartnersService.deleteInstance).toHaveBeenCalledExactlyOnceWith(
        'any-instance-id-mock',
      );
      expect(t).toHaveBeenCalledWith(
        'Partners.serviceProviderPage.sandboxes.deleteModal.success.description',
        { instanceName: 'any-instance-name-mock' },
      );
    });
  });

  describe('confirmDeleteInstance', () => {
    it('should call PartnersService.deleteInstance with the instance identifier', async () => {
      // Given
      const { result } = renderHook(() => useServiceProviderSandboxes());

      // When
      await result.current.confirmDeleteInstance('any-instance-id-mock', 'any-instance-name-mock');

      // Then
      expect(PartnersService.deleteInstance).toHaveBeenCalledExactlyOnceWith(
        'any-instance-id-mock',
      );
    });

    it('should notify the successful deletion', async () => {
      // Given
      const { result } = renderHook(() => useServiceProviderSandboxes());

      // When
      await result.current.confirmDeleteInstance('any-instance-id-mock', 'any-instance-name-mock');

      // Then
      expect(t).toHaveBeenCalledWith(
        'Partners.serviceProviderPage.sandboxes.deleteModal.success.description',
        { instanceName: 'any-instance-name-mock' },
      );
      expect(notifyDeletionMock).toHaveBeenCalledExactlyOnceWith(
        'Partners.serviceProviderPage.sandboxes.deleteModal.success.description',
        'Partners.serviceProviderPage.sandboxes.deleteModal.success.title',
        MessageTypes.SUCCESS,
      );
    });

    it('should notify the failed deletion', async () => {
      // Given
      const { result } = renderHook(() => useServiceProviderSandboxes());
      jest
        .mocked(PartnersService.deleteInstance)
        .mockRejectedValueOnce(new Error('any-error-mock'));

      // When
      await result.current.confirmDeleteInstance('any-instance-id-mock', 'any-instance-name-mock');

      // Then
      expect(t).toHaveBeenCalledWith(
        'Partners.serviceProviderPage.sandboxes.deleteModal.error.description',
        { instanceName: 'any-instance-name-mock' },
      );
      expect(notifyDeletionMock).toHaveBeenCalledExactlyOnceWith(
        'Partners.serviceProviderPage.sandboxes.deleteModal.error.description',
        'Partners.serviceProviderPage.sandboxes.deleteModal.error.title',
        MessageTypes.ERROR,
      );
    });
  });
});
