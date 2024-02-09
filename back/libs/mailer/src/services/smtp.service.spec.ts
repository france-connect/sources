import { Test, TestingModule } from '@nestjs/testing';
import { MailerService } from '@nestjs-modules/mailer';

import { SmtpService } from './smtp.service';

describe('SmtpService', () => {
  let service: SmtpService;

  const mailerServiceMock = {
    sendMail: jest.fn(),
  };

  const paramsMock = {
    subject: 'This is a notification',
    body: 'This is the body of the notification',
    to: [
      {
        email: 'to@to.fr',
        name: 'to',
      },
    ],
    from: {
      email: 'from@from.fr',
      name: 'from',
    },
  };

  beforeEach(async () => {
    jest.resetAllMocks();
    jest.restoreAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [MailerService, SmtpService],
    })
      .overrideProvider(MailerService)
      .useValue(mailerServiceMock)
      .compile();

    service = module.get<SmtpService>(SmtpService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('send', () => {
    it('should call mailerService.sendMail function with all the required params', async () => {
      // Given
      const expected = {
        subject: 'This is a notification',
        html: 'This is the body of the notification',
        to: [
          {
            address: 'to@to.fr',
            name: 'to',
          },
        ],
        from: {
          address: 'from@from.fr',
          name: 'from',
        },
      };

      // When
      await service.send(paramsMock);

      // Then
      expect(mailerServiceMock.sendMail).toHaveBeenCalledTimes(1);
      expect(mailerServiceMock.sendMail).toHaveBeenCalledWith(expected);
    });
  });
});
