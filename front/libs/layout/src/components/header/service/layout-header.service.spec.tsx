import { render } from '@testing-library/react';

import { getAccessibleTitle } from '@fc/common';
import { ConfigService } from '@fc/config';

import { LayoutHeaderServiceComponent } from './layout-header.service';

describe('LayoutHeaderServiceComponent', () => {
  beforeEach(() => {
    // given
    jest.mocked(ConfigService.get).mockReturnValue({ service: {} });
  });

  it('should call ConfigService.get with Layout', () => {
    // when
    render(<LayoutHeaderServiceComponent />);

    // then
    expect(ConfigService.get).toHaveBeenCalledOnce();
    expect(ConfigService.get).toHaveBeenCalledWith('Layout');
  });

  it('should call getAccessibleTitle with params', () => {
    // given
    jest.mocked(ConfigService.get).mockReturnValueOnce({
      service: {
        name: 'any service name mock',
      },
    });

    // when
    render(<LayoutHeaderServiceComponent />);

    // then
    expect(getAccessibleTitle).toHaveBeenCalledOnce();
    expect(getAccessibleTitle).toHaveBeenCalledWith(
      'Retour à l’accueil du site',
      undefined,
      'any service name mock',
    );
  });

  it('should render the link, when service.name is defined', () => {
    // given
    jest.mocked(ConfigService.get).mockReturnValueOnce({
      service: {
        homepage: '/any-href-mock',
        name: 'any service name mock',
      },
    });
    jest
      .mocked(getAccessibleTitle)
      .mockReturnValueOnce('Retour à l’accueil du site - any service name mock');

    // when
    const { container, getByTestId } = render(<LayoutHeaderServiceComponent />);
    const elementContainer = getByTestId('layout-header-service-component');
    const elementName = getByTestId('layout-header-service-component-name');

    // then
    expect(container).toMatchSnapshot();
    expect(elementContainer).toBeInTheDocument();
    expect(elementName).toBeInTheDocument();
    expect(elementName).toHaveAttribute('href', '/any-href-mock');
    expect(elementName).toHaveTextContent('any service name mock');
    expect(elementName).toHaveAttribute(
      'title',
      'Retour à l’accueil du site - any service name mock',
    );
  });

  it('should render the baseline, when service.baseline is defined', () => {
    // given
    jest.mocked(ConfigService.get).mockReturnValueOnce({
      service: {
        baseline: 'any service baseline mock',
      },
    });

    // when
    const { container, getByTestId } = render(<LayoutHeaderServiceComponent />);
    const elementContainer = getByTestId('layout-header-service-component');
    const elementBaseline = getByTestId('layout-header-service-component-baseline');

    // then
    expect(container).toMatchSnapshot();
    expect(elementContainer).toBeInTheDocument();
    expect(elementBaseline).toBeInTheDocument();
    expect(elementBaseline).toHaveTextContent('any service baseline mock');
  });

  it('should render the link and the baseline, when service.name and service.baseline are defined', () => {
    // given
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
        'Retour à l’accueil du site - any service baseline mock - any service name mock',
      );

    // when
    const { container, getByTestId } = render(<LayoutHeaderServiceComponent />);
    const elementContainer = getByTestId('layout-header-service-component');
    const elementName = getByTestId('layout-header-service-component-name');
    const elementBaseline = getByTestId('layout-header-service-component-baseline');

    // then
    expect(container).toMatchSnapshot();
    expect(elementContainer).toBeInTheDocument();
    expect(elementName).toBeInTheDocument();
    expect(elementName).toHaveAttribute('href', '/any-href-mock');
    expect(elementName).toHaveTextContent('any service name mock');
    expect(elementName).toHaveAttribute(
      'title',
      'Retour à l’accueil du site - any service baseline mock - any service name mock',
    );
    expect(elementBaseline).toBeInTheDocument();
    expect(elementBaseline).toHaveTextContent('any service baseline mock');
  });
});