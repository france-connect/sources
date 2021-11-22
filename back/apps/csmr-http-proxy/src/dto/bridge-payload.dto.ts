import {
  IsIn,
  IsObject,
  IsOptional,
  IsUrl,
  ValidateNested,
} from 'class-validator';

export class BridgePayloadDto {
  @IsUrl()
  readonly url: string;

  @IsIn(['get', 'post', 'GET', 'POST'])
  readonly method: string;

  /**
   * @todo
   * set the correct type for headers and data
   *
   * Author: Arnaud PSA
   * Date: 02/11/2021
   */
  @IsObject()
  @ValidateNested()
  readonly headers: Record<string, unknown>;

  @IsObject()
  @IsOptional()
  @ValidateNested()
  readonly data?: Record<string, unknown>;
}
