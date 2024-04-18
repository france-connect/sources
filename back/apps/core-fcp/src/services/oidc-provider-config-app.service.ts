/* istanbul ignore file */

// No code to test for now
import { Injectable } from '@nestjs/common';

import { CoreOidcProviderConfigAppService } from '@fc/core';

@Injectable()
export class OidcProviderConfigAppService extends CoreOidcProviderConfigAppService {}
