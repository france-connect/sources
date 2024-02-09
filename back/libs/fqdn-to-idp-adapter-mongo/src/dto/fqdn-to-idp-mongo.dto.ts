import { IsString } from 'class-validator';

export class GetFqdnToIdentityProviderMongoDto {
  @IsString()
  readonly fqdn: string;

  @IsString()
  readonly identityProvider: string;
}
