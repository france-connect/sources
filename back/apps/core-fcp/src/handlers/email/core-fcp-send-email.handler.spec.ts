import { ValidationError } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { validateDto } from '@fc/common';
import { ConfigService } from '@fc/config';
import { IdentityProviderAdapterMongoService } from '@fc/identity-provider-adapter-mongo';
import {
  MailerNotificationConnectException,
  MailerService,
  MailFrom,
  MailTo,
  NoEmailException,
} from '@fc/mailer';
import { OidcSession } from '@fc/oidc';
import { SessionService } from '@fc/session';

import { getSessionServiceMock } from '@mocks/session';

import { EmailsTemplates } from '../../enums';
import { CoreFcpSendEmailHandler } from './core-fcp-send-email.handler';

jest.mock('@fc/common', () => ({
  ...jest.requireActual('@fc/common'),
  validateDto: jest.fn(),
}));

/**
 * @TODO #471 En tant que PO je peux avoir des templates de mail différent suivant l'instance
 * @see https://gitlab.dev-franceconnect.fr/france-connect/fc/-/issues/471
 */
const template = `
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <title>Notification de connexion à FranceConnect+</title>
    <style type="text/css">
      body {
        margin: 0;
        padding: 0;
        min-width: 100%;
        font-family: 'Helvetica Neue', Arial, sans-serif;
      }

      .content {
        width: 100%;
        max-width: 580px;
      }

      table.content {
        border-radius: 4px;
      }

      .header {
        padding: 16px 30px 26px 16px;
      }

      .innerpadding {
        padding: 0px 16px 0px 16px;
      }

      .innerpadding12 {
        padding: 12px 16px 12px 12px;
      }

      .borderbottom {
        border-bottom: 1px solid #f2eeed;
      }

      .h1,
      .h2,
      .bodycopy {
        color: #3a3a3a;
        font-family: 'Helvetica Neue', Arial, sans-serif;
      }

      a {
        color: #000091;
        text-decoration: none;
      }

      strong {
        font-weight: bold;
      }

      .h1 {
        font-size: 33px;
        line-height: 38px;
        font-weight: bold;
      }

      .h2 {
        padding: 0 0 10px 0;
        font-size: 16px;
        font-weight: bold;
        font-stretch: normal;
        font-style: normal;
        line-height: 1.31;
        letter-spacing: normal;
        color: #000091;
      }

      .bodycopy {
        font-size: 16px;
        line-height: 24px;
      }

      .bodycopy-small {
        font-size: 14px;
        line-height: 24px;
        color: #666666;
      }

      .bold {
        font-weight: bold;
      }

      .button {
        border-radius: 4px;
        background-color: #ffffff;
        text-decoration: none;
        padding: 20px 48px;
      }

      .button a {
        text-decoration: none;
      }
    </style>
  </head>

  <body>
    <table
      width="100%"
      bgcolor="#ffffff"
      class="content"
      align="center"
      cellpadding="0"
      cellspacing="0"
      border="0"
    >
      <tr>
        <td>
          <!--[if (gte mso 9)|(IE)]>
      <table width="580" align="center" cellpadding="0" cellspacing="0" border="0">
        <tr>
          <td>
    <![endif]-->
          <table
            class="content bottompadding50"
            align="center"
            cellpadding="0"
            cellspacing="0"
            border="0"
          >
            <tr>
              <td class="header">
                <table border="0" cellpadding="0" cellspacing="0">
                  <tr>
                    <td height="73">
                      <img
                        src="https://auth.franceconnect.gouv.fr/img/logo-marianne.png"
                        height="73"
                        border="0"
                        alt=""
                      />
                      <img
                        style="margin-left: 16px;"
                        src="https://auth.franceconnect.gouv.fr/img/logo-fc-plus.png"
                        width="150"
                        height="73"
                        border="0"
                        alt=""
                      />
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td class="innerpadding">
                <!--[if (gte mso 9)|(IE)]>
                <table width="580" align="center" cellpadding="0" cellspacing="0" border="0">
                  <tr>
                    <td>
              <![endif]-->
                <table width="100%" border="0" cellspacing="0" cellpadding="0">
                  <tr>
                    <td class="h2">Bonjour,</td>
                  </tr>
                  <tr>
                    <td class="bodycopy">
                      Une connexion avec FranceConnect+ a eu lieu
                      <strong><%= locals.today %></strong> (heure de Paris) sur le site
                      <strong><%= locals.spName %></strong> avec votre compte
                      <strong><%= locals.idpTitle %>.</strong>
                    </td>
                  </tr>
                </table>

                <!--[if (gte mso 9)|(IE)]>
                    </td>
                  </tr>
              </table>
              <![endif]-->
              </td>
            </tr>
            <tr>
              <td
                class="innerpadding"
                style="padding-top: 25px; padding-bottom: 25px;"
              >
                <!--[if (gte mso 9)|(IE)]>
                <table width="580" align="center" cellpadding="0" cellspacing="0" border="0">
                  <tr>
                    <td>
              <![endif]-->
                <table
                  class="content"
                  bgcolor="#e5edf5"
                  align="center"
                  cellpadding="0"
                  cellspacing="0"
                  border="0"
                  style="width: 100%;max-width: 580px;"
                >
                  <tr>
                    <td
                      valign="center"
                      class="bodycopy-small"
                      style="padding: 25px 0px 25px 25px;"
                    >
                      <img
                          src="https://franceconnect.gouv.fr/images/info_icon.png"
                          height="25"
                          width="25"
                          border="0"
                          alt=""
                        />
                      </td>
                      <td class="bodycopy-small innerpadding12">
                        Si vous n&rsquo;&ecirc;tes pas &agrave; l&rsquo;origine de
                        cette connexion,
                        <strong>
                          <a href="https://franceconnect.gouv.fr/faq#SECURITE"
                            >consultez notre rubrique d&rsquo;aide
                            d&eacute;di&eacute;e</a
                          >
                        </strong>
                        <img
                          src="https://franceconnect.gouv.fr/images/arrow_icon.png"
                          width="10"
                          border="0"
                          alt=""
                        />
                      </td>
                    </tr>
                  </table>

                  <!--[if (gte mso 9)|(IE)]>
                      </td>
                    </tr>
                </table>
                
              <![endif]-->
              </td>
            </tr>
            <tr>
              <td class="innerpadding">
                <table width="100%" border="0" cellspacing="0" cellpadding="0">
                  <tr>
                    <td class="bodycopy-small">
                      Vous recevez ce mail automatiquement apr&egrave;s chaque
                      utilisation de FranceConnect+ pour vous aider &agrave;
                      contr&ocirc;ler la s&eacute;curit&eacute; de vos
                      acc&egrave;s. Si vous &ecirc;tes &agrave; l&rsquo;origine
                      de cette connexion, aucune action n&rsquo;est requise.
                    </td>
                  </tr>
                  <tr>
                    <td class="bodycopy" style="padding-top: 15px;">
                      Pour suivre et contr&ocirc;ler votre utilisation de
                      FranceConnect+, vous pouvez &eacute;galement
                      <strong>
                        <a href="https://app.franceconnect.gouv.fr/traces"
                          >consulter votre historique de connexions
                          FranceConnect+.</a
                        >
                      </strong>
                    </td>
                  </tr>
                  <tr>
                    <td class="bodycopy" style="padding-top: 15px;">
                      Pour toute autre question en lien avec votre
                      d&eacute;marche, merci de contacter le support du site
                      <%= locals.spName %>.
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td class="innerpadding" style="padding-top: 15px;">
                <table width="100%" border="0" cellspacing="0" cellpadding="0">
                  <tr>
                    <td
                      class="bodycopy"
                      style="padding-top: 15px; padding-bottom: 24px;"
                    >
                      <i>L&rsquo;&eacute;quipe FranceConnect+</i>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        <!--[if (gte mso 9)|(IE)]>
          </td>
        </tr>
    </table>
    <![endif]-->
        </td>
      </tr>
    </table>
  </body>
</html>
`;

describe('CoreFcpSendEmailHandler', () => {
  let service: CoreFcpSendEmailHandler;

  const fromMock: MailFrom = { email: 'address@fqdn.ext', name: 'Address' };
  const configMailerMock = {
    template,
    from: fromMock,
  };

  const configAppMock = {
    fqdn: 'my-instance-domain',
    udFqdn: 'my-ud-instance-domain',
  };

  const sessionServiceMock = getSessionServiceMock();

  const spIdentityWithEmailMock = {
    sub: '42',
    // eslint-disable-next-line @typescript-eslint/naming-convention
    given_name: 'Edward',
    // eslint-disable-next-line @typescript-eslint/naming-convention
    family_name: 'TEACH',
    email: 'eteach@fqdn.ext',
  };

  const idpIdentityMock = {
    sub: 'some idpSub',
  };

  const configServiceMock = {
    get: jest.fn(),
  };

  const serviceProviderMock = {
    getById: jest.fn(),
  };

  const identityProviderMock = {
    getById: jest.fn(),
  };

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

  const mailerServiceMock = {
    mailToSend: jest.fn(),
    send: jest.fn(),
  };

  const spMock = {
    key: '123456',
    entityId: 'AAAABBBBCCCCDDDDEEEEFFFFGGGGHHHH',
  };

  const idpMock = {
    title: 'my grea idp title',
  };

  const connectNotificationEmailParametersMock = {
    idpTitle: idpMock.title,
    spName: sessionDataMock.spName,
    today: 'le 01 janvier 2021 à 14:14',
    fqdn: 'my-instance-domain',
    udFqdn: 'my-ud-instance-domain',
  };

  beforeEach(async () => {
    jest.resetAllMocks();
    jest.restoreAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ConfigService,
        CoreFcpSendEmailHandler,
        SessionService,
        MailerService,
        IdentityProviderAdapterMongoService,
      ],
    })
      .overrideProvider(ConfigService)
      .useValue(configServiceMock)
      .overrideProvider(SessionService)
      .useValue(sessionServiceMock)
      .overrideProvider(MailerService)
      .useValue(mailerServiceMock)
      .overrideProvider(IdentityProviderAdapterMongoService)
      .useValue(identityProviderMock)
      .compile();

    service = module.get<CoreFcpSendEmailHandler>(CoreFcpSendEmailHandler);
    sessionServiceMock.get.mockReturnValue(sessionDataMock);
  });

  it('should be defined', () => {
    // Then
    expect(service).toBeDefined();
  });

  describe('getTodayFormattedDate()', () => {
    it('should return a formatted date to be shown in email notification', () => {
      // When
      const connectNotificationEmailMockedDate = new Date(
        '01 Jan 2021 17:14 GMT+4',
      );
      const result = service.getTodayFormattedDate(
        connectNotificationEmailMockedDate,
      );
      // Then
      expect(result).toStrictEqual(
        connectNotificationEmailParametersMock.today,
      );
    });
  });

  describe('getConnectNotificationEmailBodyContent()', () => {
    beforeEach(() => {
      service['getTodayFormattedDate'] = jest
        .fn()
        .mockReturnValue(connectNotificationEmailParametersMock.today);
      identityProviderMock.getById.mockResolvedValueOnce(idpMock);
      configServiceMock.get.mockReturnValue(configAppMock);

      jest.mocked(validateDto).mockResolvedValue([]);
    });

    it('should get fqdn back from app config', async () => {
      // When
      await service['getConnectNotificationEmailBodyContent']();
      // Then
      expect(configServiceMock.get).toHaveBeenCalledExactlyOnceWith('App');
    });

    it('should throw if dto validation fails', async () => {
      // Given
      jest
        .mocked(validateDto)
        .mockResolvedValueOnce(['foo'] as unknown as ValidationError[]);
      // When/Then
      await expect(
        service['getConnectNotificationEmailBodyContent'](),
      ).rejects.toThrow(MailerNotificationConnectException);
    });

    it('should call identity provider getById', async () => {
      // When
      await service['getConnectNotificationEmailBodyContent']();
      // Then
      expect(identityProviderMock.getById).toHaveBeenCalledExactlyOnceWith(
        sessionDataMock.idpId,
      );
    });

    it('should call getTodayFormattedDate', async () => {
      // When
      await service['getConnectNotificationEmailBodyContent']();
      // Then
      expect(service.getTodayFormattedDate).toHaveBeenCalledExactlyOnceWith(
        expect.any(Date),
      );
    });

    it('should call mailToSend', async () => {
      // When
      await service['getConnectNotificationEmailBodyContent']();
      // Then
      expect(mailerServiceMock.mailToSend).toHaveBeenCalledExactlyOnceWith(
        EmailsTemplates.NOTIFICATION_EMAIL,
        {
          idpTitle: idpMock.title,
          spName: sessionDataMock.spName,
          today: connectNotificationEmailParametersMock.today,
          fqdn: connectNotificationEmailParametersMock.fqdn,
          udFqdn: connectNotificationEmailParametersMock.udFqdn,
        },
      );
    });

    it('should return the html content of the notification email', async () => {
      // Given
      mailerServiceMock.mailToSend.mockReturnValueOnce('my HTML content');
      // When
      const result = await service['getConnectNotificationEmailBodyContent']();
      // Then
      expect(result).toEqual('my HTML content');
    });
  });

  describe('handle()', () => {
    beforeEach(() => {
      const AppConfigMock = { platform: 'FranceConnect+' };
      serviceProviderMock.getById.mockResolvedValue(spMock);
      configServiceMock.get
        .mockReset()
        .mockReturnValueOnce(configMailerMock)
        .mockReturnValueOnce(AppConfigMock);

      service['getConnectNotificationEmailBodyContent'] = jest
        .fn()
        .mockReturnValue(`connect notification html body content`);

      jest.mocked(validateDto).mockResolvedValue([]);
    });

    it('should not throw if email is sent', async () => {
      // Then
      await expect(service.handle()).resolves.not.toThrow();
    });

    it('should have called getConnectNotificationEmailBodyContent with `session` as parameter', async () => {
      // When
      await service.handle();

      // Then
      expect(
        service['getConnectNotificationEmailBodyContent'],
      ).toHaveBeenCalledExactlyOnceWith();
    });

    it('should send the email to the end-user by calling "mailer.send" (FranceConnect+)', async () => {
      // Given
      const mailTo: MailTo = {
        email: spIdentityWithEmailMock.email,
        name: `${spIdentityWithEmailMock.given_name} ${spIdentityWithEmailMock.family_name}`,
      };
      const expectedEmailParams = {
        body: `connect notification html body content`,
        from: fromMock,
        subject: `Alerte de connexion au service "${sessionDataMock.spName}" avec FranceConnect+`,
        to: [mailTo],
      };

      // When
      await service.handle();

      // Then
      expect(mailerServiceMock.send).toHaveBeenCalledExactlyOnceWith(
        expectedEmailParams,
      );
    });

    it('should send the email to the end-user by calling "mailer.send" (FranceConnect)', async () => {
      // Given
      const mailTo: MailTo = {
        email: spIdentityWithEmailMock.email,
        name: `${spIdentityWithEmailMock.given_name} ${spIdentityWithEmailMock.family_name}`,
      };
      const expectedEmailParams = {
        body: `connect notification html body content`,
        from: fromMock,
        subject: `Alerte de connexion au service "${sessionDataMock.spName}" avec FranceConnect`,
        to: [mailTo],
      };
      const AppConfigMock = { platform: 'FranceConnect' };
      configServiceMock.get
        .mockReset()
        .mockReturnValueOnce(configMailerMock)
        .mockReturnValueOnce(AppConfigMock);

      // When
      await service.handle();

      // Then
      expect(mailerServiceMock.send).toHaveBeenCalledExactlyOnceWith(
        expectedEmailParams,
      );
    });

    it('should throw an Error if the TO email is no valid', async () => {
      // Given
      jest
        .mocked(validateDto)
        .mockResolvedValueOnce(['foo'] as unknown as ValidationError[]);

      // When/Then
      await expect(service.handle()).rejects.toThrow(NoEmailException);
    });
  });
});
