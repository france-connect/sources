import { render } from '@testing-library/react';

import { AxiosErrorCatcherProvider } from '@fc/axios-error-catcher';
import { AppContextProvider } from '@fc/state-management';

import { AppConfig } from '../config';
import { Application } from './application';
import { ApplicationRoutes } from './application.routes';

jest.mock('react-router-dom');
jest.mock('@fc/dsfr');
jest.mock('@fc/state-management');
jest.mock('@fc/axios-error-catcher');
jest.mock('./application.routes');

describe('Application', () => {
  it('should match snapshot', () => {
    // when
    const { container } = render(<Application />);

    // then
    expect(container).toMatchSnapshot();
  });

  it('should call AppContextProvider with config', () => {
    // when
    render(<Application />);

    // then
    expect(AppContextProvider).toHaveBeenCalledWith(
      expect.objectContaining({
        value: { config: AppConfig },
      }),
      {},
    );
  });

  it('should call AxiosErrorCatcherProvider', () => {
    // When
    render(<Application />);
    // Then
    expect(AxiosErrorCatcherProvider).toHaveBeenCalled();
  });

  it('should call ApplicationRoutes', () => {
    // when
    render(<Application />);

    // then
    expect(ApplicationRoutes).toHaveBeenCalledOnce();
  });
});
