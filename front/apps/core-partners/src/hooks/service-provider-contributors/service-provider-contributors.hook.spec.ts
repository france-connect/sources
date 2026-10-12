import { renderHook } from '@testing-library/react';
import { useParams } from 'react-router';

import { MessageTypes } from '@fc/common';
import { t } from '@fc/i18n';
import { useModal } from '@fc/modal';

import { PartnersAlertVariants } from '../../enums';
import type { ServiceProviderPermissionInterface } from '../../interfaces';
import { PartnersService } from '../../loaders';
import { useDeletionNotifier } from '../deletion-notifier';
import { useServiceProviderContributors } from './service-provider-contributors.hook';

jest.mock('../../loaders/partners/partners.service');
jest.mock('../deletion-notifier/deletion-notifier.hook');

describe('useServiceProviderContributors', () => {
  // Given
  const serviceProviderIdMock = 'any-service-provider-id-mock';
  const accountIdMock = 'any-account-id-mock';
  const emailMock = 'jean.dupont@example.com';

  const permissionMock = {
    account: { email: emailMock, id: accountIdMock },
  } as unknown as ServiceProviderPermissionInterface;

  const openModalMock = jest.fn();
  const notifyDeletionMock = jest.fn();

  beforeEach(() => {
    // Given
    jest.mocked(useParams).mockReturnValue({ serviceProviderId: serviceProviderIdMock });
    jest.mocked(useModal).mockReturnValue({
      closeModal: jest.fn(),
      currentModal: null,
      openModal: openModalMock,
    });
    jest.mocked(useDeletionNotifier).mockReturnValue({ notifyDeletion: notifyDeletionMock });
  });

  it('should call useDeletionNotifier with the contributor alert variant', () => {
    // When
    renderHook(() => useServiceProviderContributors());

    // Then
    expect(useDeletionNotifier).toHaveBeenCalledExactlyOnceWith(PartnersAlertVariants.CONTRIBUTOR);
  });

  it('should expose the deletion handlers', () => {
    // When
    const { result } = renderHook(() => useServiceProviderContributors());

    // Then
    expect(result.current).toStrictEqual({
      confirmDeleteContributor: expect.any(Function),
      deleteContributorHandler: expect.any(Function),
    });
  });

  describe('deleteContributorHandler', () => {
    it('should open the delete-contributor modal with the email and the confirmation handler', () => {
      // Given
      const { result } = renderHook(() => useServiceProviderContributors());

      // When
      result.current.deleteContributorHandler(permissionMock);

      // Then
      expect(openModalMock).toHaveBeenCalledExactlyOnceWith('delete-contributor', {
        email: emailMock,
        onConfirm: expect.any(Function),
      });
    });

    it('should delete the contributor of the row when the modal is confirmed', async () => {
      // Given
      let modalProps = {} as { onConfirm: () => Promise<void> };

      openModalMock.mockImplementationOnce(
        (_id: string, props: { onConfirm: () => Promise<void> }) => {
          modalProps = props;
        },
      );

      const { result } = renderHook(() => useServiceProviderContributors());
      result.current.deleteContributorHandler(permissionMock);

      // When
      await modalProps.onConfirm();

      // Then
      expect(PartnersService.deleteContributor).toHaveBeenCalledExactlyOnceWith(
        serviceProviderIdMock,
        accountIdMock,
      );
    });
  });

  describe('confirmDeleteContributor', () => {
    it('should call PartnersService.deleteContributor with the service provider and account identifiers', async () => {
      // Given
      const { result } = renderHook(() => useServiceProviderContributors());

      // When
      await result.current.confirmDeleteContributor(accountIdMock, emailMock);

      // Then
      expect(PartnersService.deleteContributor).toHaveBeenCalledExactlyOnceWith(
        serviceProviderIdMock,
        accountIdMock,
      );
    });

    it('should notify the successful deletion', async () => {
      // Given
      const { result } = renderHook(() => useServiceProviderContributors());

      // When
      await result.current.confirmDeleteContributor(accountIdMock, emailMock);

      // Then
      expect(t).toHaveBeenCalledWith(
        'Partners.serviceProviderPage.usersSection.deleteModal.success.description',
        { email: emailMock },
      );
      expect(notifyDeletionMock).toHaveBeenCalledExactlyOnceWith(
        'Partners.serviceProviderPage.usersSection.deleteModal.success.description',
        'Partners.serviceProviderPage.usersSection.deleteModal.success.title',
        MessageTypes.SUCCESS,
      );
    });

    it('should notify the failed deletion', async () => {
      // Given
      const { result } = renderHook(() => useServiceProviderContributors());
      jest
        .mocked(PartnersService.deleteContributor)
        .mockRejectedValueOnce(new Error('any-error-mock'));

      // When
      await result.current.confirmDeleteContributor(accountIdMock, emailMock);

      // Then
      expect(t).toHaveBeenCalledWith(
        'Partners.serviceProviderPage.usersSection.deleteModal.error.description',
        { email: emailMock },
      );
      expect(notifyDeletionMock).toHaveBeenCalledExactlyOnceWith(
        'Partners.serviceProviderPage.usersSection.deleteModal.error.description',
        'Partners.serviceProviderPage.usersSection.deleteModal.error.title',
        MessageTypes.ERROR,
      );
    });
  });
});
