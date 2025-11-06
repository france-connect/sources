import { HelmetProvider } from '@dr.pogodin/react-helmet';
import { render } from '@testing-library/react';
import { ErrorBoundary } from 'react-error-boundary';

import { AccountProvider, ConnectValidator } from '@fc/account';
import { AxiosErrorCatcherProvider } from '@fc/axios-error-catcher';
import { ConfigService } from '@fc/config';
import { Dto2FormServiceProvider } from '@fc/dto2form-service';
import { AppBoundaryComponent } from '@fc/exceptions';
import { I18nService } from '@fc/i18n';
import { useMatomo } from '@fc/matomo';

import i18n from '../__fixtures__/i18n.fr.json';
import { AppConfig } from '../config';
import { Application } from './application';
import { ApplicationRoutes } from './application.routes';

jest.mock('./application.routes');

describe('Application', () => {
  const matomoConfigMock = Symbol('any-matomo-config-mock');

  beforeEach(() => {
    jest.mocked(ConfigService.get).mockReturnValue(matomoConfigMock);
  });

  it('should match snapshot', () => {
    // When
    const { container } = render(<Application />);

    // Then
    expect(container).toMatchSnapshot();
  });

  it('should call I18nService initialize with config', () => {
    // When
    render(<Application />);

    // Then
    expect(I18nService.initialize).toHaveBeenCalledWith('fr', i18n);
  });

  it('should call ConfigService initialize with config', () => {
    // When
    render(<Application />);

    // Then
    expect(ConfigService.initialize).toHaveBeenCalledWith(AppConfig);
  });

  it('should call useMatomo hook with matomo config', () => {
    // When
    render(<Application />);

    // Then
    expect(useMatomo).toHaveBeenCalledWith(matomoConfigMock);
  });

  it('should call ErrorBoundary with props', () => {
    // When
    render(<Application />);

    // Then
    expect(ErrorBoundary).toHaveBeenCalledOnce();
    expect(ErrorBoundary).toHaveBeenCalledWith(
      expect.objectContaining({
        FallbackComponent: AppBoundaryComponent,
      }),
      undefined,
    );
  });

  it('should call AccountProvider with props', () => {
    // When
    render(<Application />);

    // Then
    expect(AccountProvider).toHaveBeenCalledOnce();
    expect(AccountProvider).toHaveBeenCalledWith(
      {
        children: expect.any(Object),
        validator: ConnectValidator,
      },
      undefined,
    );
  });

  it('should call AxiosErrorCatcherProvider', () => {
    // When
    render(<Application />);

    // Then
    expect(AxiosErrorCatcherProvider).toHaveBeenCalled();
  });

  it('should call HelmetProvider', () => {
    // When
    render(<Application />);

    // Then
    expect(HelmetProvider).toHaveBeenCalledOnce();
  });

  it('should call Dto2FormServiceProvider', () => {
    // When
    render(<Application />);

    // Then
    expect(Dto2FormServiceProvider).toHaveBeenCalledOnce();
  });

  it('should call ApplicationRoutes', () => {
    // When
    render(<Application />);

    // Then
    expect(ApplicationRoutes).toHaveBeenCalledOnce();
  });
});
