import { ArgumentsHost } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { MockServiceProviderAuthException } from '../exceptions';
import { AuthExceptionFilter } from './auth-exception.filter';

jest.mock('@fc/exceptions/helpers', () => ({
  ...jest.requireActual('@fc/exceptions/helpers'),
  generateErrorId: jest.fn(),
}));

describe('AuthExceptionFilter', () => {
  let filter: AuthExceptionFilter;

  const resMock = {
    redirect: jest.fn(),
  };

  beforeEach(async () => {
    jest.resetAllMocks();
    jest.restoreAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthExceptionFilter],
    }).compile();

    filter = module.get<AuthExceptionFilter>(AuthExceptionFilter);
  });

  it('should be defined', () => {
    expect(filter).toBeDefined();
  });

  describe('catch', () => {
    it('should redirect to login route', () => {
      const exceptionMock = new MockServiceProviderAuthException();

      const hostMock = {
        switchToHttp: jest.fn().mockReturnThis(),
        getResponse: jest.fn().mockReturnValue(resMock),
      } as unknown as ArgumentsHost;

      filter.catch(exceptionMock, hostMock);

      expect(resMock.redirect).toHaveBeenCalledWith('/login');
    });
  });
});
