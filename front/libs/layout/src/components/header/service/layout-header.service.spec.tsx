import { render } from '@testing-library/react';

import { getAccessibleTitle } from '@fc/common';
import { ConfigService } from '@fc/config';
import { t } from '@fc/i18n';

import { LayoutHeaderServiceComponent } from './layout-header.service';

describe('LayoutHeaderServiceComponent', () => {
  beforeEach(() => {
    // Given
    jest.mocked(ConfigService.get).mockReturnValue({ service: {} });
    jest.mocked(t).mockReturnValue('any-back-to-homepage-mock');
  });

  it('should call t 1 times with params', () => {
    // When
    render(<LayoutHeaderServiceComponent />);

    // Then
    expect(t).toHaveBeenCalledExactlyOnceWith('Layout.documentTitle.backToHomepage');
  });

  it('should call ConfigService.get with Layout', () => {
    // When
    render(<LayoutHeaderServiceComponent />);

    // Then
    expect(ConfigService.get).toHaveBeenCalledOnce();
    expect(ConfigService.get).toHaveBeenCalledWith('Layout');
  });

  it('should call getAccessibleTitle with params', () => {
    // Given
    jest.mocked(ConfigService.get).mockReturnValueOnce({
      service: {
        name: 'any service name mock',
      },
    });

    // When
    render(<LayoutHeaderServiceComponent />);

    // Then
    expect(getAccessibleTitle).toHaveBeenCalledOnce();
    expect(getAccessibleTitle).toHaveBeenCalledWith(
      'any-back-to-homepage-mock',
      undefined,
      'any service name mock',
    );
  });

  it('should render the link, when service.name is defined', () => {
    // Given
    jest.mocked(ConfigService.get).mockReturnValueOnce({
      service: {
        homepage: '/any-href-mock',
        name: 'any service name mock',
      },
    });
    jest
      .mocked(getAccessibleTitle)
      .mockReturnValueOnce('any-back-to-homepage-mock - any service name mock');

    // When
    const { container, getByTestId } = render(<LayoutHeaderServiceComponent />);
    const elementContainer = getByTestId('layout-header-service-component');
    const elementName = getByTestId('layout-header-service-component-name');

    // Then
    expect(container).toMatchSnapshot();
    expect(elementContainer).toBeInTheDocument();
    expect(elementName).toBeInTheDocument();
    expect(elementName).toHaveAttribute('href', '/any-href-mock');
    expect(elementName).toHaveTextContent('any service name mock');
    expect(elementName).toHaveAttribute(
      'title',
      'any-back-to-homepage-mock - any service name mock',
    );
  });

  it('should render the baseline, when service.baseline is defined', () => {
    // Given
    jest.mocked(ConfigService.get).mockReturnValueOnce({
      service: {
        baseline: 'any service baseline mock',
      },
    });

    // When
    const { container, getByTestId } = render(<LayoutHeaderServiceComponent />);
    const elementContainer = getByTestId('layout-header-service-component');
    const elementBaseline = getByTestId('layout-header-service-component-baseline');

    // Then
    expect(container).toMatchSnapshot();
    expect(elementContainer).toBeInTheDocument();
    expect(elementBaseline).toBeInTheDocument();
    expect(elementBaseline).toHaveTextContent('any service baseline mock');
  });

  it('should render the link and the baseline, when service.name and service.baseline are defined', () => {
    // Given
    jest.mocked(ConfigService.get).mockReturnValueOnce({
      service: {
        baseline: 'any service baseline mock',
        homepage: '/any-href-mock',
        name: 'any service name mock',
      },
    });
    jest
      .mocked(getAccessibleTitle)
      .mockReturnValueOnce(
        'any-back-to-homepage-mock - any service baseline mock - any service name mock',
      );

    // When
    const { container, getByTestId } = render(<LayoutHeaderServiceComponent />);
    const elementContainer = getByTestId('layout-header-service-component');
    const elementName = getByTestId('layout-header-service-component-name');
    const elementBaseline = getByTestId('layout-header-service-component-baseline');

    // Then
    expect(container).toMatchSnapshot();
    expect(elementContainer).toBeInTheDocument();
    expect(elementName).toBeInTheDocument();
    expect(elementName).toHaveAttribute('href', '/any-href-mock');
    expect(elementName).toHaveTextContent('any service name mock');
    expect(elementName).toHaveAttribute(
      'title',
      'any-back-to-homepage-mock - any service baseline mock - any service name mock',
    );
    expect(elementBaseline).toBeInTheDocument();
    expect(elementBaseline).toHaveTextContent('any service baseline mock');
  });
});
