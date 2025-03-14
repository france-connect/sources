import { ExecutionContext } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { CsrfService } from '../services';
import { CsrfTokenGuard } from './csrf-token.guard';

describe('CsrfTokenGuard', () => {
  let guard: CsrfTokenGuard;

  const csrfMock = {
    check: jest.fn(),
  };

  const contextMock = {
    switchToHttp: jest.fn(),
  };

  const httpMock = {
    getRequest: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CsrfTokenGuard, CsrfService],
    })
      .overrideProvider(CsrfService)
      .useValue(csrfMock)
      .compile();

    guard = module.get<CsrfTokenGuard>(CsrfTokenGuard);

    contextMock.switchToHttp.mockReturnValue(httpMock);
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  describe('canActivate', () => {
    it('should let pass exception from csrf.check() ', () => {
      // Given
      const reqMock = {
        body: { csrfToken: 'csrfToken' },
      };
      httpMock.getRequest.mockReturnValue(reqMock);

      const error = new Error('error');
      csrfMock.check.mockImplementationOnce(() => {
        throw error;
      });

      // When / Then
      expect(() =>
        guard.canActivate(contextMock as unknown as ExecutionContext),
      ).toThrow(error);
    });

    it('should return result of CsrfService.check if csrfToken is in body', () => {
      // Given
      const reqMock = {
        body: { csrfToken: 'csrfToken' },
      };
      httpMock.getRequest.mockReturnValue(reqMock);

      const checkResult = Symbol('checkResult');
      csrfMock.check.mockReturnValue(checkResult);

      // When
      const result = guard.canActivate(
        contextMock as unknown as ExecutionContext,
      );

      // Then
      expect(result).toBe(checkResult);
    });

    it('should return result of CsrfService.check if csrfToken is in headers', () => {
      // Given
      const reqMock = {
        body: {},
        headers: { 'x-csrf-token': 'csrfToken' },
      };
      httpMock.getRequest.mockReturnValue(reqMock);

      const checkResult = Symbol('checkResult');
      csrfMock.check.mockReturnValue(checkResult);

      // When
      const result = guard.canActivate(
        contextMock as unknown as ExecutionContext,
      );

      // Then
      expect(result).toBe(checkResult);
    });
  });
});
