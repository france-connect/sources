import { IsNumber, IsString, MinLength } from 'class-validator';

export class EidasLightProtocolConfig {
  @IsString()
  @MinLength(32)
  readonly lightRequestConnectorSecret: string;

  @IsString()
  @MinLength(32)
  readonly lightRequestProxyServiceSecret: string;

  @IsString()
  @MinLength(32)
  readonly lightResponseConnectorSecret: string;

  @IsString()
  @MinLength(32)
  readonly lightResponseProxyServiceSecret: string;

  @IsNumber()
  readonly maxTokenSize: number;
}
