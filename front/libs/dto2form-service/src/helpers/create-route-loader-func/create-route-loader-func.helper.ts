import type { LoaderFunction, LoaderFunctionArgs } from 'react-router';
import { generatePath } from 'react-router';

import { fetchWithAuthHandling } from '@fc/http-client';

import type { Dto2FormServiceEndpointsInterface } from '../../interfaces';

export const createDTO2FormRouteLoaderFunc =
  (endpoints: Dto2FormServiceEndpointsInterface): LoaderFunction =>
  async ({ params }: LoaderFunctionArgs) => {
    // @TODO #2356
    // The Dto2Form Back API should return
    // the data and schema in a single response.
    // the payload is not FSAInterface compliant (no type, no meta, no payload)
    // https://gitlab.dev-franceconnect.fr/france-connect/fc/-/issues/2356
    const schemaUrl = generatePath(endpoints.schema.path, params);
    const schema = await fetchWithAuthHandling(schemaUrl);

    let data = null;
    if (endpoints.load) {
      const dataUrl = generatePath(endpoints.load.path, params);
      data = await fetchWithAuthHandling(dataUrl);
    }

    return { data, schema };
  };
