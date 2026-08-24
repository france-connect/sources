import { renderHook } from '@testing-library/react';
import { useParams } from 'react-router';

import type { AccountContextState } from '@fc/account';
import { useAccountContext } from '@fc/account';

import { AccessControlEntity, AccessControlPermission } from '../../enums';
import type { PartnersUserInfosInterface, PermissionInterface } from '../../interfaces';
import { useCanCreateContributor } from './can-create-contributor.hook';

describe('useCanCreateContributor', () => {
  // Given
  const serviceProviderIdMock = 'any-service-provider-id-mock';

  const defaultPermission: PermissionInterface = {
    entity: AccessControlEntity.SERVICE_PROVIDER,
    entityId: serviceProviderIdMock,
    permissionType: AccessControlPermission.SP_ADMIN,
  };

  const accountContextState: AccountContextState<PartnersUserInfosInterface> = {
    connected: true,
    expired: false,
    ready: true,
    userinfos: {
      email: 'any-email-mock',
      firstname: 'any-firstname-mock',
      lastname: 'any-lastname-mock',
      permissions: [defaultPermission],
    },
  };

  beforeEach(() => {
    // Given
    jest.mocked(useParams).mockReturnValue({ serviceProviderId: serviceProviderIdMock });
    jest.mocked(useAccountContext).mockReturnValue(accountContextState);
  });

  it('should call useAccountContext', () => {
    // When
    renderHook(() => useCanCreateContributor());

    // Then
    expect(useAccountContext).toHaveBeenCalledExactlyOnceWith();
  });

  it('should call useParams', () => {
    // When
    renderHook(() => useCanCreateContributor());

    // Then
    expect(useParams).toHaveBeenCalledExactlyOnceWith();
  });

  it.each([AccessControlPermission.SP_ADMIN, AccessControlPermission.SP_TECH])(
    'should return true when user has %s permission on the current service provider',
    (permissionType) => {
      // Given
      jest.mocked(useAccountContext).mockReturnValueOnce({
        ...accountContextState,
        userinfos: {
          ...accountContextState.userinfos!,
          permissions: [{ ...defaultPermission, permissionType }],
        },
      } as AccountContextState<PartnersUserInfosInterface>);

      // When
      const { result } = renderHook(() => useCanCreateContributor());

      // Then
      expect(result.current).toBeTrue();
    },
  );

  it('should return false when user has only SP_CONTRIBUTOR permission', () => {
    // Given
    jest.mocked(useAccountContext).mockReturnValueOnce({
      ...accountContextState,
      userinfos: {
        ...accountContextState.userinfos!,
        permissions: [
          {
            ...defaultPermission,
            permissionType: AccessControlPermission.SP_CONTRIBUTOR,
          },
        ],
      },
    } as AccountContextState<PartnersUserInfosInterface>);

    // When
    const { result } = renderHook(() => useCanCreateContributor());

    // Then
    expect(result.current).toBeFalse();
  });

  it('should return false when user has the permission on another service provider', () => {
    // Given
    jest.mocked(useAccountContext).mockReturnValueOnce({
      ...accountContextState,
      userinfos: {
        ...accountContextState.userinfos!,
        permissions: [{ ...defaultPermission, entityId: 'another-service-provider-id' }],
      },
    } as AccountContextState<PartnersUserInfosInterface>);

    // When
    const { result } = renderHook(() => useCanCreateContributor());

    // Then
    expect(result.current).toBeFalse();
  });

  it('should return false when user has the permission on another entity type', () => {
    // Given
    jest.mocked(useAccountContext).mockReturnValueOnce({
      ...accountContextState,
      userinfos: {
        ...accountContextState.userinfos!,
        permissions: [{ ...defaultPermission, entity: AccessControlEntity.ORGANIZATION }],
      },
    } as AccountContextState<PartnersUserInfosInterface>);

    // When
    const { result } = renderHook(() => useCanCreateContributor());

    // Then
    expect(result.current).toBeFalse();
  });

  it('should return false when user has no permissions', () => {
    // Given
    jest.mocked(useAccountContext).mockReturnValueOnce({
      ...accountContextState,
      userinfos: {
        ...accountContextState.userinfos!,
        permissions: [],
      },
    } as AccountContextState<PartnersUserInfosInterface>);

    // When
    const { result } = renderHook(() => useCanCreateContributor());

    // Then
    expect(result.current).toBeFalse();
  });

  it('should return false when userinfos is undefined', () => {
    // Given
    jest.mocked(useAccountContext).mockReturnValueOnce({
      ...accountContextState,
      userinfos: undefined,
    });

    // When
    const { result } = renderHook(() => useCanCreateContributor());

    // Then
    expect(result.current).toBeFalse();
  });
});
