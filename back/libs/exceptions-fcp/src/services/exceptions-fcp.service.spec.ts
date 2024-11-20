import { Test, TestingModule } from '@nestjs/testing';

import { ConfigService } from '@fc/config';
import { I18nService } from '@fc/i18n';

import { getConfigMock } from '@mocks/config';
import { getI18nServiceMock } from '@mocks/i18n';

import { ExceptionsFcpService } from './exceptions-fcp.service';

describe('ExceptionsFcpService', () => {
  let service: ExceptionsFcpService;

  const configMock = getConfigMock();
  const i18nMock = getI18nServiceMock();

  beforeEach(async () => {
    jest.resetAllMocks();

    jest
      .mocked(configMock.get)
      .mockReturnValue({ items: [{ errorCode: 'any_error_code' }] });

    const module: TestingModule = await Test.createTestingModule({
      providers: [ExceptionsFcpService, ConfigService, I18nService],
    })
      .overrideProvider(ConfigService)
      .useValue(configMock)
      .overrideProvider(I18nService)
      .useValue(i18nMock)
      .compile();

    service = module.get<ExceptionsFcpService>(ExceptionsFcpService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('showSupportButton', () => {
    it('should return false if the error code is undefined', () => {
      // when
      const result = service.showSupportButton(expect.any(String));

      // then
      expect(result).toBeFalse();
    });

    it('should return true if the error code is defined', () => {
      // when
      const result = service.showSupportButton('any_error_code');

      // then
      expect(result).toBeTrue();
    });
  });

  describe('getCustomErrorAction', () => {
    it('should call config.get with parameter "ExceptionsFCP"', () => {
      // when
      service.getCustomErrorAction({
        code: expect.any(String),
        message: expect.any(String),
      });

      // then
      expect(configMock.get).toHaveBeenCalledWith('ExceptionsFcp');
    });

    it('should return default values if the error code is undefined', () => {
      // given
      jest.mocked(configMock.get).mockReturnValueOnce({
        items: [{ active: true, errorCode: 'any_error_code' }],
      });

      // when
      const result = service.getCustomErrorAction({
        code: expect.any(String),
        message: 'default_error_message',
      });

      // then
      expect(result).toStrictEqual({
        message: 'default_error_message',
        title: 'error.support.title',
      });
    });

    it('should return default values if the error code is defined but not active', () => {
      // given
      jest.mocked(configMock.get).mockReturnValueOnce({
        items: [{ active: false, errorCode: 'any_error_code' }],
      });
      jest
        .mocked(i18nMock.translate)
        .mockReturnValueOnce('default_error_title-translated');

      // when
      const result = service.getCustomErrorAction({
        code: expect.any(String),
        message: 'default_error_message',
      });

      // then
      expect(result).toStrictEqual({
        message: 'default_error_message',
        title: 'error.support.title',
      });
    });

    it('should return an output object if error code is defined and active', () => {
      // given
      jest
        .mocked(i18nMock.translate)
        .mockReturnValueOnce('any_message-translated')
        .mockReturnValueOnce('any_title-translated');
      jest.mocked(configMock.get).mockReturnValueOnce({
        items: [
          {
            active: true,
            actionButtonLabel: 'any_actionButtonLabel_mock',
            actionHref: 'any_href_mock',
            actionTitle: 'any_actionTitle_mock',
            errorCode: 'Y010001',
            errorMessage: 'any_errorMessage_mock',
          },
        ],
      });

      // when
      const result = service.getCustomErrorAction({
        code: 'Y010001',
        message: 'default_error_message',
      });

      // then
      expect(result).toStrictEqual({
        message: 'any_errorMessage_mock',
        title: 'any_actionTitle_mock',
      });
    });
  });

  describe('getCustomErrorSupport', () => {
    it('should call config.get with parameter "ExceptionsFcp"', () => {
      // when
      service.getCustomErrorSupport({
        code: expect.any(String),
        href: expect.any(String),
      });

      // then
      expect(configMock.get).toHaveBeenCalledWith('ExceptionsFcp');
    });

    it('should return default values if the error code is undefined', () => {
      // given
      jest.mocked(configMock.get).mockReturnValueOnce({
        items: [{ active: true, errorCode: 'any_error_code' }],
      });
      jest
        .mocked(i18nMock.translate)
        .mockReturnValueOnce('default_error_button_label-translated');

      // when
      const result = service.getCustomErrorSupport({
        code: expect.any(String),
        href: 'default_error_href',
      });

      // then
      expect(i18nMock.translate).toHaveBeenNthCalledWith(
        1,
        'error.support.button_label',
      );
      expect(result).toStrictEqual({
        href: 'default_error_href',
        buttonLabel: 'default_error_button_label-translated',
      });
    });

    it('should return default values if the error code is defined but not active', () => {
      // given
      jest.mocked(configMock.get).mockReturnValueOnce({
        items: [{ active: false, errorCode: 'any_error_code' }],
      });
      jest
        .mocked(i18nMock.translate)
        .mockReturnValueOnce('default_error_button_label-translated');

      // when
      const result = service.getCustomErrorSupport({
        code: expect.any(String),
        href: 'default_error_href',
      });

      // then
      expect(i18nMock.translate).toHaveBeenNthCalledWith(
        1,
        'error.support.button_label',
      );
      expect(result).toStrictEqual({
        href: 'default_error_href',
        buttonLabel: 'default_error_button_label-translated',
      });
    });

    it('should return an exception fcp object if error code is defined and active', () => {
      // given
      jest
        .mocked(i18nMock.translate)
        .mockReturnValueOnce('any_buttonLabel-translated');
      jest.mocked(configMock.get).mockReturnValueOnce({
        items: [
          {
            active: true,
            actionButtonLabel: 'any_actionButtonLabel_mock',
            actionHref: 'any_href_mock',
            actionTitle: 'any_actionTitle_mock',
            errorCode: 'Y010001',
            errorMessage: 'any_errorMessage_mock',
          },
        ],
      });

      // when
      const result = service.getCustomErrorSupport({
        code: 'Y010001',
        href: expect.any(String),
      });

      // then
      expect(result).toStrictEqual({
        href: 'any_href_mock',
        buttonLabel: 'any_buttonLabel-translated',
      });
    });
  });
});
