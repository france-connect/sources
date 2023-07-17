import { ValidatorOptions } from 'class-validator';

import { Injectable } from '@nestjs/common';

import { validateDto } from '@fc/common';

import { ChecktokenRequestDto } from '../dto';
import { InvalidChecktokenRequestException } from '../exceptions';

@Injectable()
export class DataProviderService {
  /**
   * This function take the checkTokenRequest to validate it
   * @param checktokenRequest checktoken of the request
   * @returns nothing
   * @throws InvalidChecktokenRequestException if the request body doesn't respect the DTO
   */
  async checkRequestValid(
    checktokenRequest: ChecktokenRequestDto,
  ): Promise<void> {
    const validatorOptions: ValidatorOptions = {
      whitelist: true,
      forbidNonWhitelisted: true,
      forbidUnknownValues: true,
    };

    const errors = await validateDto(
      checktokenRequest,
      ChecktokenRequestDto,
      validatorOptions,
    );
    if (errors.length > 0) {
      throw new InvalidChecktokenRequestException();
    }
  }
}
