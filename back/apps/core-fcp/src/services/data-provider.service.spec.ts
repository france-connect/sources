import { ValidationError } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { validateDto } from '@fc/common';

import { ChecktokenRequestDto } from '../dto';
import { InvalidChecktokenRequestException } from '../exceptions';
import { DataProviderService } from './data-provider.service';

jest.mock('@fc/common', () => ({
  ...(jest.requireActual('@fc/common') as any),
  validateDto: jest.fn(),
}));

describe('DataProviderService', () => {
  let service: DataProviderService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DataProviderService],
    }).compile();

    service = module.get<DataProviderService>(DataProviderService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('checkRequestValid', () => {
    let validateDtoMock: any;
    beforeEach(() => {
      validateDtoMock = jest.mocked(validateDto);
    });

    it('should return true when the request token is valid', async () => {
      // Given
      const requestTokenMock: ChecktokenRequestDto = {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        client_id:
          '423dcbdc5a15ece61ed00ff5989d72379c26d9ed4c8e4e05a87cffae019586e0',
        // eslint-disable-next-line @typescript-eslint/naming-convention
        client_secret:
          'jClItOnQiSZdE4kxm7EWzJbz4ckfD89k1e3NJw/pbGRHD/Jp6ooupqmHTyc3b62L9wqyF2TlR/5hJejE',
        // eslint-disable-next-line @typescript-eslint/naming-convention
        access_token: 'acces_token',
      };
      validateDtoMock.mockResolvedValueOnce([
        /* No error */
      ]);
      // When
      const call = async () =>
        await service.checkRequestValid(requestTokenMock);
      // Then
      expect(call).not.toThrow();
    });

    it('should throw an error when the request token is invalid', async () => {
      // Given
      const requestTokenMock: ChecktokenRequestDto = {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        client_id: '',
        // eslint-disable-next-line @typescript-eslint/naming-convention
        client_secret: '',
        // eslint-disable-next-line @typescript-eslint/naming-convention
        access_token: '',
      };
      validateDtoMock.mockResolvedValueOnce([
        new Error('Unknown Error') as unknown as ValidationError,
      ]);
      // When
      await expect(
        service.checkRequestValid(requestTokenMock),
        // Then
      ).rejects.toThrow(InvalidChecktokenRequestException);
    });
  });
});
