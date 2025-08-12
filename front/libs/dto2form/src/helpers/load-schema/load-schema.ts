import type { LoaderFunction } from 'react-router';

import type { Dto2FormSchemaInterface } from '@fc/dto2form';
import { Dto2FormService } from '@fc/dto2form';

export const loadSchema =
  (endpoint: string): LoaderFunction =>
  async (): Promise<Dto2FormSchemaInterface | null> =>
    Dto2FormService.get(endpoint);
