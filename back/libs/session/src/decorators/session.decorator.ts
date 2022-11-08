import { createParamDecorator } from '@nestjs/common';

import { extractSessionFromContext } from '../helper/extract-session.helper';

export const Session = createParamDecorator(extractSessionFromContext);
