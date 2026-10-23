import { render } from '@testing-library/react';
import { ErrorBoundary } from 'react-error-boundary';

import { ConfigService } from '@fc/config';
import { AppBoundaryComponent } from '@fc/exceptions';

import { AppConfig } from '../config';
import { Application } from './application';
import { ApplicationRoutes } from './application.routes';

jest.mock('./application.routes');

describe('Application', () => {
  it('should match the snapshot', () => {
    // When
    const { container } = render(<Application />);

    // Then
    expect(container).toMatchSnapshot();
  });

  it('should render ApplicationRoutes', () => {
    // When
    render(<Application />);

    // Then
    expect(ApplicationRoutes).toHaveBeenCalledOnce();
  });

  it('should call ConfigService initialize with config', () => {
    // When
    render(<Application />);

    // Then
    expect(ConfigService.initialize).toHaveBeenCalledExactlyOnceWith(AppConfig);
  });

  it('should call ErrorBoundary with AppBoundaryComponent as fallback', () => {
    // When
    render(<Application />);

    // Then
    expect(ErrorBoundary).toHaveBeenCalledExactlyOnceWith(
      expect.objectContaining({
        FallbackComponent: AppBoundaryComponent,
      }),
      undefined,
    );
  });
});
