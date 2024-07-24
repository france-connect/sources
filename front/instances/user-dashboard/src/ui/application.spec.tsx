import { render } from '@testing-library/react';
import { HelmetProvider } from 'react-helmet-async';

import { AccountProvider } from '@fc/account';
import { AxiosErrorCatcherProvider } from '@fc/axios-error-catcher';
import { ConfigService } from '@fc/config';
import { I18nService } from '@fc/i18n';
import { StylesProvider } from '@fc/styles';

import { AppConfig } from '../config';
import translations from '../i18n/fr.json';
import { Application } from './application';
import { ApplicationRoutes } from './application.routes';

jest.mock('react-router-dom');
jest.mock('react-helmet-async');
jest.mock('@fc/dsfr');
jest.mock('@fc/styles');
jest.mock('@fc/account');
jest.mock('@fc/config');
jest.mock('@fc/axios-error-catcher');
jest.mock('./application.routes');

describe('Application', () => {
  it('should match snapshot', () => {
    // when
    const { container } = render(<Application />);

    // then
    expect(container).toMatchSnapshot();
  });

  it('should call AccountProvider with config', () => {
    // when
    render(<Application />);

    // then
    expect(AccountProvider).toHaveBeenCalledWith(
      expect.objectContaining({
        config: AppConfig.Account,
      }),
      {},
    );
  });

  it('should call I18nService initialize with config', () => {
    // when
    render(<Application />);

    // then
    expect(I18nService.initialize).toHaveBeenCalledWith('fr', translations);
  });

  it('should call ConfigService initialize with config', () => {
    // when
    render(<Application />);

    // then
    expect(ConfigService.initialize).toHaveBeenCalledWith(AppConfig);
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

  it('should call StylesProvider', () => {
    // when
    render(<Application />);

    // then
    expect(StylesProvider).toHaveBeenCalledOnce();
  });

  it('should call ApplicationRoutes', () => {
    // when
    render(<Application />);

    // then
    expect(ApplicationRoutes).toHaveBeenCalledOnce();
  });
});
