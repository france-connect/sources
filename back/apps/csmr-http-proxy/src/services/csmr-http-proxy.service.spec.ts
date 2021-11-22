import { Test, TestingModule } from '@nestjs/testing';

import { HttpProxyRequest } from '..';
import { CsmrHttpProxyService } from './csmr-http-proxy.service';

describe('CsmrHttpProxyService', () => {
  let service: CsmrHttpProxyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CsmrHttpProxyService],
    }).compile();

    service = module.get<CsmrHttpProxyService>(CsmrHttpProxyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getIdpData()', () => {
    it('should get data from FI based on params', async () => {
      const resultMock = {
        data: {
          hello: 'world',
        },
        headers: {
          'content-type': 'text/html; charset=UTF-8',
        },
        message: 'Success',
        status: 200,
      };

      const options: HttpProxyRequest = {
        url: 'http://test.com/token?code=33EFGRGRG44556GH6J',
        method: 'GET',
        responseType: 'json',
        headers: {
          hello: 'world',
        },
        data: {
          test: 'testValue',
        },
      };

      const result = await service.forwardRequest(options);
      expect(result).toStrictEqual(resultMock);
    });
  });
});
