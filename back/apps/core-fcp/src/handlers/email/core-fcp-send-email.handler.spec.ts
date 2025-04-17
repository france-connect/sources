import { ValidationError } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { validateDto } from '@fc/common';
import { ConfigService } from '@fc/config';
import { IdentityProviderAdapterMongoService } from '@fc/identity-provider-adapter-mongo';
import {
  MailerHelper,
  MailerNotificationConnectException,
  MailerService,
  MailFrom,
  MailTo,
  NoEmailException,
} from '@fc/mailer';
import { OidcSession } from '@fc/oidc';
import { RnippPivotIdentity } from '@fc/rnipp';
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
    <title>Notification de connexion à FranceConnect</title>
    <style type="text/css">
      body {
        margin: 0;
        padding: 0;
        min-width: 100%;
        font-family: Arial, sans-serif;
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

      .footer {
        padding: 24px 16px;
        background-color: #f6f6f6;
      }

      .innerpadding {
        padding: 0px 16px 16px 16px;
      }

      a {
        color: #000091;
        text-decoration: none;
      }

      .underline {
        text-decoration: underline;
      }

      strong {
        font-weight: bold;
      }

      .bodycopy {
        font-size: 16px;
        line-height: 24px;
        color: #3a3a3a;
      }

      .bodycopy-small {
        color: #666666;
      }

      .bodycopy-small,
      .bodycopy-small a {
        font-size: 14px;
        line-height: 24px;
      }

      .bold {
        font-weight: bold;
      }

      .button {
        text-decoration: none;
        font-weight: 500;
        background-color: #000091;
        line-height: 1.5rem;
        padding: 8px 16px 8px 16px;
        color: #f5f5fe;
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
            class="content"
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
                        src="https://franceconnect.gouv.fr/images/Marianne-FranceConnect-logo.png"
                        height="98"
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
                    <td
                      class="bodycopy"
                      style="text-align: right; padding-bottom: 16px"
                    >
                      Code d’identification&nbsp;:</br>
                      <strong
                        data-testid="connection-notification-browsing-session-id"
                      >
                        <%= locals.browsingSessionId %>
                      </strong>
                    </td>
                  </tr>
                  <tr>
                    <td class="bodycopy" style="padding-bottom: 32px">Bonjour,</td>
                  </tr>
                  <tr>
                    <td
                      class="bodycopy"
                      data-testid="connection-notification-message"
                    >
                      Une connexion avec FranceConnect a eu lieu
                      <strong><%= locals.today %></strong> (heure de Paris) sur
                      le site <strong><%= locals.spName %></strong> avec votre
                      compte
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
              <td class="innerpadding">
                <!--[if (gte mso 9)|(IE)]>
                <table width="580" align="center" cellpadding="0" cellspacing="0" border="0">
                  <tr>
                    <td>
              <![endif]-->
                <table
                  cellpadding="0"
                  cellspacing="0"
                  border="0"
                  style="width: 100%"
                >
                  <tr>
                    <td class="bodycopy">
                      Vous recevez cette alerte car une connexion inhabituelle
                      avec FranceConnect a &eacute;t&eacute;
                      d&eacute;tect&eacute;e. Si vous &ecirc;tes à
                      l&rsquo;origine de cette connexion, aucune action
                      n&rsquo;est requise. Dans le cas contraire, contactez
                      notre &eacute;quipe support pour s&eacute;curiser
                      votre acc&egrave;s.
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
                <!--[if (gte mso 9)|(IE)]>
                <table width="580" align="center" cellpadding="0" cellspacing="0" border="0">
                  <tr>
                    <td>
              <![endif]-->
                <table
                  cellpadding="0"
                  cellspacing="0"
                  border="0"
                  style="width: 100%"
                >
                  <tr>
                    <td class="bodycopy" style="padding-bottom: 8px; padding-top: 8px">
                      <a
                        class="button"
                        style="color: #f5f5fe;"
                        href="https://aide.franceconnect.gouv.fr/erreurs/signalement/etape-1/"
                        >Je signale une usurpation</a
                      >
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
                    <td class="bodycopy">
                      Pour suivre et contr&ocirc;ler votre utilisation
                      de FranceConnect, vous pouvez &eacute;galement
                      consulter votre historique de connexion via votre
                      <a
                        class="underline"
                        style="color: #000091;"
                        href="https://tableaudebord.franceconnect.gouv.fr"
                        >tableau de bord</a
                      >.
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td class="innerpadding">
                <table width="100%" border="0" cellspacing="0" cellpadding="0">
                  <tr>
                    <td class="bodycopy" style="padding-bottom: 16px; padding-top: 16px">
                      <i>L&rsquo;&eacute;quipe FranceConnect</i>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td class="footer">
                <table width="100%" border="0" cellspacing="0" cellpadding="0">
                  <tr>
                    <td class="bodycopy-small">
                      Si vous ne souhaitez plus recevoir ces notifications, vous
                      pouvez les d&eacute;sactiver
                      <a
                        class="underline"
                        style="color: #000091;"
                        href="[#DL:UNSUBSCRIBE-0#]"
                        >en&nbsp;cliquant&nbsp;ici</a
                      >. Attention&nbsp;: vous ne serez plus pr&eacute;venu lors
                      de l&rsquo;utilisation de FranceConnect avec cette adresse
                      mail, y compris dans le cas o&ugrave; une tierce personne
                      utiliserait vos identifiants &agrave; votre insu.
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
    // @NOTE :  To be fixed, family_name and given_name should be used from the RNIPP identity, different usage for CoreFcpSendEmailHandler.handle() and CoreFcpSendEmailHandler.getConnectNotificationEmailBodyContent()
    family_name: 'TEACH',
    // @NOTE :  To be fixed, family_name and given_name should be used from the RNIPP identity, different usage for CoreFcpSendEmailHandler.handle() and CoreFcpSendEmailHandler.getConnectNotificationEmailBodyContent()
    given_name: 'Edward',
    preferred_username: 'Barbe Noire',
    email: 'eteach@fqdn.ext',
  };

  const rnippIdentityMock = {
    given_name_array: ['Edward (RNIPP)', 'Edouard (RNIPP)', 'Edouardo (RNIPP)'],
    family_name: 'TEACH (RNIPP)',
  } as unknown as RnippPivotIdentity;

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
    rnippIdentity: rnippIdentityMock,
    browsingSessionId: '4c43a136-871b-409b-ba12-b0087bd556cc',
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
    browsingSessionId: '4c43a136-871b-409b-ba12-b0087bd556cc',
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
          person: expect.any(String),
          idpTitle: idpMock.title,
          spName: sessionDataMock.spName,
          today: connectNotificationEmailParametersMock.today,
          fqdn: connectNotificationEmailParametersMock.fqdn,
          udFqdn: connectNotificationEmailParametersMock.udFqdn,
          browsingSessionId:
            connectNotificationEmailParametersMock.browsingSessionId,
        },
      );
    });

    it('should call MailerHelper.getPerson with givenNameArray', async () => {
      // Given
      const givenNameArrayMock = Symbol(
        'any-given-name-array-mock',
      ) as unknown as Array<string>;

      sessionServiceMock.get.mockReturnValueOnce({
        ...sessionDataMock,
        rnippIdentity: {
          ...rnippIdentityMock,
          given_name_array: givenNameArrayMock,
        } as unknown as RnippPivotIdentity,
      });

      const personMock = Symbol('any-person-mock') as unknown as string;
      const getPersonSpy = jest
        .spyOn(MailerHelper, 'getPerson')
        .mockReturnValueOnce(personMock);

      // When
      await service['getConnectNotificationEmailBodyContent']();

      // Then
      expect(getPersonSpy).toHaveBeenCalledOnce();
      expect(getPersonSpy).toHaveBeenCalledWith({
        givenNameArray: givenNameArrayMock,
        familyName: rnippIdentityMock.family_name,
        preferredUsername: spIdentityWithEmailMock.preferred_username,
      });
      expect(mailerServiceMock.mailToSend).toHaveBeenCalledWith(
        EmailsTemplates.NOTIFICATION_EMAIL,
        expect.objectContaining({
          person: personMock,
        }),
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
    const personMock = `${rnippIdentityMock.given_name} ${spIdentityWithEmailMock.preferred_username}`;

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

      jest.spyOn(MailerHelper, 'getPerson').mockReturnValueOnce(personMock);
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

    it('should call MailerHelper.getPerson', async () => {
      // When
      await service.handle();

      // Then
      expect(MailerHelper.getPerson).toHaveBeenCalledExactlyOnceWith({
        givenNameArray: rnippIdentityMock.given_name_array,
        familyName: rnippIdentityMock.family_name,
        preferredUsername: spIdentityWithEmailMock.preferred_username,
      });
    });

    it('should send the email to the end-user by calling "mailer.send" (FranceConnect+)', async () => {
      // Given
      const mailTo: MailTo = {
        email: spIdentityWithEmailMock.email,
        name: personMock,
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
        name: personMock,
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
