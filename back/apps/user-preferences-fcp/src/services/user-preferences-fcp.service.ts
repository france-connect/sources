import { Injectable } from '@nestjs/common';

import {
  UserPreferencesFcpRequest,
  UserPreferencesFcpResponse,
} from '../interfaces';

@Injectable()
export class UserPreferencesFcpService {
  /**
   * @todo #FC-779
   * This function is just a mock until we create the calls.
   *
   * Author: Annouar LAIFA
   * Date: 18/11/2021
   */
  /* istanbul ignore next */
  private async mockCall(
    options: UserPreferencesFcpRequest,
  ): Promise<UserPreferencesFcpResponse> {
    const response: UserPreferencesFcpResponse<unknown> = {
      status: 200,
      message: 'Success',
      headers: {
        'Content-Type': 'application/json',
      },
      data: null,
    };

    if (options?.data) {
      response.data = {
        foo: 'bar',
      };
    }
    return response;
  }
}
