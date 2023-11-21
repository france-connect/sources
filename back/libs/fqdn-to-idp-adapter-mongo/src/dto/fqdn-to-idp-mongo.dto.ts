import { IsString } from 'class-validator';

export class GetFqdnToIdentityProviderMongoDto {
  @IsString()
  readonly domain: string;

  @IsString()
  readonly identityProvider: string;
}
