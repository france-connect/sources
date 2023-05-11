import { Injectable } from '@nestjs/common';

import { OidcProviderAppConfigLibService } from '@fc/oidc-provider';

@Injectable()
export class OidcProviderConfigAppService extends OidcProviderAppConfigLibService {}
