import { I18nService } from '../services';
import { t } from './t';

jest.mock('../services');

describe('t shorthand', () => {
  // Given
  const inputMock = 'inputMockValue';
  const valuesMock = {};
  const translateMockReturnValue = Symbol('translateMockReturnValue');
  const mockedService = {
    translate: jest.fn(),
  };

  beforeEach(() => {
    jest.mocked(I18nService.instance).mockReturnValue(mockedService as unknown as I18nService);
    mockedService.translate.mockReturnValue(translateMockReturnValue);
  });

  it('should call I18nService.instance()', () => {
    // When
    t(inputMock, valuesMock);

    // Then
    expect(I18nService.instance).toHaveBeenCalledOnce();
  });

  it('should call I18nService.translate with given arguments', () => {
    // When
    t(inputMock, valuesMock);

    // Then
    expect(mockedService.translate).toHaveBeenCalledOnce();
    expect(mockedService.translate).toHaveBeenCalledWith(inputMock, valuesMock);
  });

  it('should return the result of call to I18nService.translate()', () => {
    // When
    const result = t(inputMock, valuesMock);

    // Then
    expect(result).toBe(translateMockReturnValue);
  });
});
