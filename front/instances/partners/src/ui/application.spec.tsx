import { render } from '@testing-library/react';
import { ErrorBoundary } from 'react-error-boundary';
import { HelmetProvider } from 'react-helmet-async';

import { AccountProvider, ConnectValidator } from '@fc/account';
import { AxiosErrorCatcherProvider } from '@fc/axios-error-catcher';
import { ConfigService } from '@fc/config';
import { AppBoundaryComponent } from '@fc/exceptions';
import { I18nService } from '@fc/i18n';

import { AppConfig } from '../config';
import { Application } from './application';
import { ApplicationRoutes } from './application.routes';

jest.mock('./application.routes');

describe('Application', () => {
  it('should match snapshot', () => {
    // when
    const { container } = render(<Application />);

    // then
    expect(container).toMatchSnapshot();
  });

  it('should call I18nService initialize with config', () => {
    // when
    render(<Application />);

    // then
    expect(I18nService.initialize).toHaveBeenCalledWith('fr', {
      // @NOTE This is a sample of the translations that should be in the fr.json file
      // eslint-disable-next-line @typescript-eslint/naming-convention
      'DSFR.stepper.location': 'Étape {current} sur {total}',
      // @NOTE This is a sample of the translations that should be in the fr.json file
      // eslint-disable-next-line @typescript-eslint/naming-convention
      'DSFR.stepper.nextStep': 'Étape suivante',
      // @NOTE This is a sample of the translations that should be in the fr.json file
      // eslint-disable-next-line @typescript-eslint/naming-convention
      'TracksPage.nextPage': 'Page suivante',
      // @NOTE This is a sample of the translations that should be in the fr.json file
      // eslint-disable-next-line @typescript-eslint/naming-convention
      'TracksPage.previousPage': 'Page précédente',
    });
  });

  it('should call ConfigService initialize with config', () => {
    // when
    render(<Application />);

    // then
    expect(ConfigService.initialize).toHaveBeenCalledWith(AppConfig);
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
      {},
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
      {},
    );
  });

  it('should call AxiosErrorCatcherProvider', () => {
    // When
    render(<Application />);

    // Then
    expect(AxiosErrorCatcherProvider).toHaveBeenCalled();
  });

  it('should call HelmetProvider', () => {
    // when
    render(<Application />);

    // then
    expect(HelmetProvider).toHaveBeenCalledOnce();
  });

  it('should call ApplicationRoutes', () => {
    // when
    render(<Application />);

    // then
    expect(ApplicationRoutes).toHaveBeenCalledOnce();
  });
});
