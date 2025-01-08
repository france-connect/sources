import { Test, TestingModule } from '@nestjs/testing';

import { PartnersAccountSession } from '@fc/partners-account';
import { SessionService } from '@fc/session';

import { getSessionServiceMock } from '@mocks/session';

import { ACCESS_CONTROL_TOKEN, AccountPermissionService } from '..';

describe('AccountPermissionService', () => {
  let service: AccountPermissionService;

  const sessionServiceMock = getSessionServiceMock();

  const userPermissionsMock = Symbol('userPermissions');

  const sessionPartnersAccountDataMock = {
    [ACCESS_CONTROL_TOKEN]: {
      userPermissions: userPermissionsMock,
    },
  } as unknown as PartnersAccountSession;

  beforeEach(async () => {
    jest.resetAllMocks();
    jest.restoreAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [AccountPermissionService, SessionService],
    })
      .overrideProvider(SessionService)
      .useValue(sessionServiceMock)

      .compile();

    service = module.get<AccountPermissionService>(AccountPermissionService);

    sessionServiceMock.get.mockReturnValueOnce(sessionPartnersAccountDataMock);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getPermissionsFromSession', () => {
    it('should call partner account sessionService.get method', () => {
      // When
      service.getPermissionsFromSession();

      // Then
      expect(sessionServiceMock.get).toHaveBeenCalledTimes(1);
    });

    it('should return user permission from partner account session', () => {
      // When
      const result = service.getPermissionsFromSession();

      // Then
      expect(result).toStrictEqual(userPermissionsMock);
    });
  });
});
