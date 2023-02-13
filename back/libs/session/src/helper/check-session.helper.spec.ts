import { ValidationError } from '@nestjs/common';

import { validateDto } from '@fc/common';

import { SessionNotFoundException } from '../exceptions';
import * as checkSessionHelper from './check-session.helper';

jest.mock('@fc/common');

describe('checkSession', () => {
  const moduleNameMock = 'moduleNameMock';

  const randomStringMock = 'randomStringMockValue';
  const interactionIdMock = 'interactionIdMockValue';
  const acrMock = 'acrMockValue';
  const spNameMock = 'some SP';

  const spIdMock = 'spIdMockValue';
  const idpStateMock = 'idpStateMockValue';
  const idpNonceMock = 'idpNonceMock';
  const idpIdMock = 'idpIdMockValue';

  const sessionDataMock = {
    csrfToken: randomStringMock,
    idpId: idpIdMock,
    idpNonce: idpNonceMock,
    idpState: idpStateMock,
    interactionId: interactionIdMock,

    spAcr: acrMock,
    spId: spIdMock,
    spIdentity: {},
    spName: spNameMock,
  };

  const dtoMock = jest.fn().mockImplementationOnce(() => []);

  const validateDtoMock = jest.mocked(validateDto);

  beforeEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();
  });

  it('should throw SessionNotFoundException if session is not found', async () => {
    // Given
    validateDtoMock.mockResolvedValueOnce([]);
    // When
    await expect(
      checkSessionHelper.checkSession(undefined, moduleNameMock, dtoMock),
      // Then
    ).rejects.toThrow(new SessionNotFoundException(moduleNameMock));
  });

  it('should throw SessionInvalidSessionException if session validation returns errors', async () => {
    // Given
    validateDtoMock.mockResolvedValueOnce([
      new Error('Unknown Error') as unknown as ValidationError,
    ]);
    // When
    await expect(
      checkSessionHelper.checkSession(sessionDataMock, moduleNameMock, dtoMock),
      // Then
    ).rejects.toThrow(new SessionNotFoundException(moduleNameMock));
  });

  it('should throw SessionInvalidSessionException if session validation returns errors', async () => {
    // Given
    validateDtoMock.mockResolvedValueOnce([]);
    // When
    await expect(
      checkSessionHelper.checkSession(sessionDataMock, moduleNameMock, dtoMock),
      // Then
    ).resolves.not.toThrow(new SessionNotFoundException(moduleNameMock));
  });
});
