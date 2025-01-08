import { IsBoolean, IsString } from 'class-validator';

export class GetFqdnToIdentityProviderMongoDto {
  @IsString()
  readonly fqdn: string;

  @IsString()
  readonly identityProvider: string;

  @IsBoolean()
  readonly acceptsDefaultIdp: boolean;
}
