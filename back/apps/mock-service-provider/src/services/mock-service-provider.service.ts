import { lastValueFrom } from 'rxjs';

import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MockServiceProviderService {
  constructor(private readonly httpService: HttpService) {}

  async getData(
    apiUrl: string,
    accessToken: string,
    authSecret: string,
  ): Promise<unknown> {
    const bearer = Buffer.from(
      `${accessToken}:${authSecret}`,
      'utf-8',
    ).toString('base64');

    try {
      const response = await lastValueFrom(
        this.httpService.get(apiUrl, {
          headers: {
            Authorization: `Bearer ${bearer}`,
          },
        }),
      );

      return response.data;
    } catch (exception) {
      throw exception.response.data;
    }
  }
}
