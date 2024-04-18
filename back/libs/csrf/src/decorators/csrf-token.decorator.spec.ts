import { NestJsDependencyInjectionWrapper } from '@fc/common';

import { CsrfService } from '../services';
import { csrfDecorator } from './csrf-token.decorator';

jest.mock('@fc/common', () => ({
  ...jest.requireActual('@fc/common'),
  NestJsDependencyInjectionWrapper: { get: jest.fn() },
}));

describe('csrfDecorator', () => {
  const diWrapperMock = jest.mocked(NestJsDependencyInjectionWrapper);

  const csrfServiceMock = {
    renew: jest.fn(),
  };

  beforeEach(() => {
    jest.resetAllMocks();

    diWrapperMock.get = jest.fn().mockReturnValue(csrfServiceMock);
  });

  it('should get csrfService from DI', () => {
    // When
    csrfDecorator();

    // Then
    expect(diWrapperMock.get).toHaveBeenCalledTimes(1);
    expect(diWrapperMock.get).toHaveBeenCalledWith(CsrfService);
  });

  it('should call csrf.renew()', () => {
    // When
    csrfDecorator();

    // Then
    expect(csrfServiceMock.renew).toHaveBeenCalledTimes(1);
  });

  it('should return result from call to csrf.renew()', () => {
    // Given
    const renewResult = 'renewResultValue';
    csrfServiceMock.renew.mockReturnValue(renewResult);

    // When
    const result = csrfDecorator();

    // Then
    expect(result).toBe(renewResult);
  });
});
