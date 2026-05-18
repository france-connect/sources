import { renderHook } from '@testing-library/react';

import type { AccountContextState } from '@fc/account';
import { useAccountContext } from '@fc/account';

import { AccessControlEntity, AccessControlPermission, CorePartnersOptions } from '../../enums';
import type { PartnersUserInfosInterface, PermissionInterface } from '../../interfaces';
import { useHasServiceProviders } from './has-service-providers.hook';

describe('useHasServiceProviders', () => {
  // Given
  const defaultPermission: PermissionInterface = {
    entity: AccessControlEntity.SERVICE_PROVIDER,
    entityId: 'any-valid-uuid',
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
    jest.mocked(useAccountContext).mockReturnValue(accountContextState);
  });

  it('should call useAccountContext', () => {
    // When
    renderHook(() => useHasServiceProviders());

    // Then
    expect(useAccountContext).toHaveBeenCalledExactlyOnceWith();
  });

  it('should return true when user has a SERVICE_PROVIDER permission with a valid entityId', () => {
    // When
    const { result } = renderHook(() => useHasServiceProviders());

    // Then
    expect(result.current).toBeTrue();
  });

  it('should return false when user has a SERVICE_PROVIDER permission with the default entityId', () => {
    // Given
    jest.mocked(useAccountContext).mockReturnValueOnce({
      ...accountContextState,
      userinfos: {
        ...accountContextState.userinfos!,
        permissions: [
          {
            ...defaultPermission,
            entityId: CorePartnersOptions.NULL_SERVICE_PROVIDER_ID,
          },
        ],
      },
    } as AccountContextState<PartnersUserInfosInterface>);

    // When
    const { result } = renderHook(() => useHasServiceProviders());

    // Then
    expect(result.current).toBeFalse();
  });

  it('should return false when user has no SERVICE_PROVIDER permission', () => {
    // Given
    jest.mocked(useAccountContext).mockReturnValueOnce({
      ...accountContextState,
      userinfos: {
        ...accountContextState.userinfos!,
        permissions: [
          {
            ...defaultPermission,
            entity: AccessControlEntity.ORGANIZATION,
          },
        ],
      },
    } as AccountContextState<PartnersUserInfosInterface>);

    // When
    const { result } = renderHook(() => useHasServiceProviders());

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
    const { result } = renderHook(() => useHasServiceProviders());

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
    const { result } = renderHook(() => useHasServiceProviders());

    // Then
    expect(result.current).toBeFalse();
  });

  it('should return true when user has multiple permissions including a valid SERVICE_PROVIDER', () => {
    // Given
    jest.mocked(useAccountContext).mockReturnValueOnce({
      ...accountContextState,
      userinfos: {
        ...accountContextState.userinfos!,
        permissions: [
          {
            entity: AccessControlEntity.ORGANIZATION,
            entityId: 'any-org-uuid',
            permissionType: AccessControlPermission.SP_ADMIN,
          },
          {
            entity: AccessControlEntity.SERVICE_PROVIDER,
            entityId: CorePartnersOptions.NULL_SERVICE_PROVIDER_ID,
            permissionType: AccessControlPermission.SP_TECH,
          },
          {
            entity: AccessControlEntity.SERVICE_PROVIDER,
            entityId: 'any-valid-sp-uuid',
            permissionType: AccessControlPermission.SP_CONTRIBUTOR,
          },
        ],
      },
    } as AccountContextState<PartnersUserInfosInterface>);

    // When
    const { result } = renderHook(() => useHasServiceProviders());

    // Then
    expect(result.current).toBeTrue();
  });
});
