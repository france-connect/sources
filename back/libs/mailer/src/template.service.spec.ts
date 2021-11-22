import * as fs from 'fs';

import * as ejs from 'ejs';
import { mocked } from 'ts-jest/utils';

import { Test, TestingModule } from '@nestjs/testing';

import { PartialExcept } from '@fc/common';
import { IOidcIdentity, OidcSession } from '@fc/oidc';

import { TemplateService } from './template.service';

jest.mock('ejs');
jest.mock('fs', () => ({
  promises: {
    readFile: jest.fn(),
  },
  existsSync: jest.fn(),
}));

describe('TemplateService', () => {
  let service: TemplateService;
  const html = 'html file';

  beforeEach(async () => {
    jest.resetAllMocks();
    jest.restoreAllMocks();
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [TemplateService],
    }).compile();

    service = module.get<TemplateService>(TemplateService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('readFile', () => {
    const templatePath = 'path/exists/and/is/last';

    beforeEach(async () => {
      jest.resetAllMocks();
      jest.restoreAllMocks();
      jest.clearAllMocks();

      jest.spyOn(fs.promises, 'readFile').mockResolvedValueOnce({
        html,
      } as unknown as string);
    });

    it('should call readFile from fs', async () => {
      // Given
      const {
        promises: { readFile: readFileMock },
      } = mocked(fs);

      // WHEN
      await service.readFile(templatePath);

      // THEN
      expect(readFileMock).toHaveBeenCalledTimes(1);
      expect(readFileMock).toHaveBeenCalledWith(templatePath, 'utf-8');
    });

    it('should return the file content', async () => {
      // WHEN
      const result = await service.readFile(templatePath);

      // THEN
      expect(result).toEqual({ html });
    });
  });

  describe('render', () => {
    const idpIdentityMock = {
      sub: 'some idpSub',
    };
    const spIdentityWithEmailMock = {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      given_name: 'Edward',
      // eslint-disable-next-line @typescript-eslint/naming-convention
      family_name: 'TEACH',
      email: undefined,
    } as PartialExcept<IOidcIdentity, 'sub'>;
    const sessionDataMock: OidcSession = {
      idpId: '42',
      idpAcr: 'eidas3',
      idpName: 'my favorite Idp',
      idpIdentity: idpIdentityMock,

      spId: 'sp_id',
      spAcr: 'eidas3',
      spName: 'my great SP',
      spIdentity: spIdentityWithEmailMock,
    };
    const connectNotificationEmailParametersMock = {
      idpName: sessionDataMock.idpName,
      spName: sessionDataMock.spName,
      // eslint-disable-next-line @typescript-eslint/naming-convention
      givenName: spIdentityWithEmailMock.given_name,
      // eslint-disable-next-line @typescript-eslint/naming-convention
      familyName: spIdentityWithEmailMock.family_name,
      today: 'Le 01/01/2021 à 14:14',
    };
    const html = 'html file';

    it('should call the render function of ejs', () => {
      // WHEN
      service.render(html, connectNotificationEmailParametersMock);

      // THEN
      expect(ejs.render).toHaveBeenCalledTimes(1);
      expect(ejs.render).toHaveBeenCalledWith(
        html,
        connectNotificationEmailParametersMock,
      );
    });

    it('should return an ejs rendered html', () => {
      // GIVEN
      const expectedResult = 'Hello World';
      const ejsRenderMock = mocked(ejs.render);
      ejsRenderMock.mockReturnValueOnce(expectedResult);

      // WHEN
      const result = service.render(
        html,
        connectNotificationEmailParametersMock,
      );

      // THEN
      expect(result).toEqual(expectedResult);
    });
  });

  describe('getFilePath', () => {
    const paths = [
      'path/does/not/exist',
      'path/does/exist',
      'path/exists/and/is/last',
    ];

    it('should call existsSync', () => {
      // GIVEN
      jest.spyOn(fs, 'existsSync');

      // WHEN
      service.getFilePath('file.ejs', paths);

      // THEN
      expect(fs.existsSync).toHaveBeenCalledTimes(3);
      expect(fs.existsSync).toHaveBeenNthCalledWith(
        1,
        'path/does/not/exist/file.ejs',
      );
      expect(fs.existsSync).toHaveBeenNthCalledWith(
        2,
        'path/does/exist/file.ejs',
      );
      expect(fs.existsSync).toHaveBeenNthCalledWith(
        3,
        'path/exists/and/is/last/file.ejs',
      );
    });

    it('should return the last existing path within array', () => {
      // GIVEN
      jest
        .spyOn(fs, 'existsSync')
        .mockReturnValueOnce(false)
        .mockReturnValueOnce(true)
        .mockReturnValueOnce(true);

      // WHEN
      const result = service.getFilePath('file.ejs', paths);

      // THEN
      expect(result).toEqual('path/exists/and/is/last/file.ejs');
    });
  });
});
