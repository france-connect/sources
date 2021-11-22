import { IsArray, IsNumber, IsString } from 'class-validator';

export class MinistriesDTO {
  @IsString()
  readonly id: string;

  @IsNumber()
  readonly sort: number;

  @IsString()
  readonly name: string;

  @IsArray()
  @IsString({ each: true })
  readonly identityProviders: string[];
}
