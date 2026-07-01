import { Expose } from 'class-transformer';
import { IsArray, IsString } from 'class-validator';

export class Openid4vpSessionDto {
  @IsArray()
  @IsString({ each: true })
  @Expose()
  readonly interactions: string[];
}
