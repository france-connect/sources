import { Injectable } from '@nestjs/common';

import { HttpProxyRequest, HttpProxyResponse } from '../interfaces';

@Injectable()
export class CsmrHttpProxyService {
  /**
   * this function is just a mock until we create the calls.
   */
  /* istanbul ignore next */
  private async fakeCall(
    options: HttpProxyRequest,
  ): Promise<HttpProxyResponse> {
    const response: HttpProxyResponse<any> = {
      status: 200,
      message: 'Success',
      headers: {
        'content-type': 'text/html; charset=UTF-8',
      },
      data: null,
    };

    if (options.data) {
      response.data = {
        hello: 'world',
      };
    }
    return response;
  }

  /**
   * get the data from FI based on Bridge request params
   * @param {HttpProxyRequest} options
   * @returns {Promise<HttpProxyResponse>}
   */
  async forwardRequest(options: HttpProxyRequest): Promise<HttpProxyResponse> {
    const {
      status,
      message,
      headers: responseHeaders,
      data,
    } = await this.fakeCall(options);

    return {
      status,
      data,
      message,
      headers: responseHeaders,
    };
  }
}
