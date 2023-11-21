import { IsArray, IsBoolean, IsString, IsUrl } from 'class-validator';

export class CoreConfig {
  @IsUrl()
  readonly defaultRedirectUri: string;

  @IsBoolean()
  readonly enableSso: boolean;

  @IsArray()
  @IsString({ each: true })
  readonly allowedIdpHints: string[];

  @IsString({ each: true })
  @IsArray()
  readonly allowedSsoAcrs: string[];
}
