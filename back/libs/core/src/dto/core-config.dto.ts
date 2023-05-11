import { IsBoolean, IsUrl } from 'class-validator';

export class CoreConfig {
  @IsUrl()
  readonly defaultRedirectUri: string;

  @IsBoolean()
  readonly enableSso: boolean;
}
