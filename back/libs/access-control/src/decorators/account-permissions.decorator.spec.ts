import { ExecutionContext } from '@nestjs/common';

import { NestJsDependencyInjectionWrapper } from '@fc/common';

import { EntityType, PermissionsType } from '../enums';
import { AccountPermissionService } from '../services';
import { AccountPermissionsDecorator } from './account-permissions.decorator';

jest.mock('@fc/common', () => ({
  ...jest.requireActual('@fc/common'),
  NestJsDependencyInjectionWrapper: { get: jest.fn() },
}));

describe('AccountPermissionsDecorator', () => {
  const diWrapperMock = jest.mocked(NestJsDependencyInjectionWrapper);

  const accountPermissionsServiceMock = {
    getPermissionsFromSession: jest.fn(),
  };

  const ctxMock = {} as ExecutionContext;

  beforeEach(() => {
    jest.resetAllMocks();

    diWrapperMock.get = jest
      .fn()
      .mockReturnValue(accountPermissionsServiceMock);
  });

  it('should get accountPermissionsService from DI', () => {
    // When
    AccountPermissionsDecorator(null, ctxMock);

    // Then
    expect(diWrapperMock.get).toHaveBeenCalledTimes(1);
    expect(diWrapperMock.get).toHaveBeenCalledWith(AccountPermissionService);
  });

  it('should call accountPermissionsService.getPermissionsFromSession()', () => {
    // When
    AccountPermissionsDecorator(null, ctxMock);

    // Then
    expect(
      accountPermissionsServiceMock.getPermissionsFromSession,
    ).toHaveBeenCalledTimes(1);
  });

  it('should return result from call to accountPermissionsService.getPermissionsFromSession()', () => {
    // Given
    const expected = {
      entityId: Symbol('entityId'),
      entity: EntityType.ORGANISATION,
      permissionType: PermissionsType.VIEW,
    };
    accountPermissionsServiceMock.getPermissionsFromSession.mockReturnValue(
      expected,
    );

    // When
    const result = AccountPermissionsDecorator(null, ctxMock);

    // Then
    expect(result).toBe(expected);
  });
});
