import { ErrorBoundary } from 'react-error-boundary';

import { ConfigService } from '@fc/config';
import { AppBoundaryComponent } from '@fc/exceptions';

import { AppConfig } from '../config';
import { ApplicationRoutes } from './application.routes';

export function Application() {
  ConfigService.initialize(AppConfig);
  return (
    <ErrorBoundary FallbackComponent={AppBoundaryComponent}>
      <ApplicationRoutes />
    </ErrorBoundary>
  );
}
