import { render } from '@testing-library/react';

import { ConfigService } from '@fc/config';
import { LinkComponent, TabsGroupComponent } from '@fc/dsfr';

import { useServiceProvider } from '../../../hooks';
import { ServiceProviderPage } from './service-provider.page';

jest.mock('../../../hooks/service-provider/service-provider.hook');

describe('ServiceProviderPage', () => {
  beforeEach(() => {
    // Given
    jest.mocked(ConfigService.get).mockReturnValue({
      datapassDocUrl: 'any-datapassDocUrl-mock',
      scopeDocUrl: 'any-scopeDocUrl-mock',
    });
    jest.mocked(useServiceProvider).mockReturnValue({
      datapassRequestId: 'any-datapassRequestId-mock',
      datapassScopes: ['any-scope-mock1', 'any-scope-mock2', 'any-scope-mock3'],
      fcScopes: ['any-scope-mock1', 'any-scope-mock2', 'any-scope-mock3'],
      habilitationLink: 'any-habilitationLink-mock',
      id: 'any-id-mock',
      name: 'any-name-mock',
      organizationName: 'any-organizationName-mock',
    });
  });

  it('should match snapshot', () => {
    // When
    const { container } = render(<ServiceProviderPage />);

    // Then
    expect(container).toMatchSnapshot();
  });

  it('should show the service provider name', () => {
    // When
    const { getByText } = render(<ServiceProviderPage />);
    const textElt = getByText('any-name-mock');

    // Then
    expect(textElt).toBeInTheDocument();
  });

  it('should show the service provider organizationName', () => {
    // When
    const { getByText } = render(<ServiceProviderPage />);
    const textElt = getByText('any-organizationName-mock');

    // Then
    expect(textElt).toBeInTheDocument();
  });

  it('should show the service provider datapassRequestId', () => {
    // When
    render(<ServiceProviderPage />);

    // Then
    expect(LinkComponent).toHaveBeenNthCalledWith(
      1,
      {
        children: 'any-datapassRequestId-mock',
        dataTestId: 'service-provider-details-page-datapass-request-id',
        external: true,
        href: 'any-habilitationLink-mock',
      },
      undefined,
    );
  });

  it('should show the scope documentation link', () => {
    // When
    render(<ServiceProviderPage />);

    // Then
    expect(LinkComponent).toHaveBeenNthCalledWith(
      2,
      {
        children: 'Partners.serviceProviderPage.scopeSection.description.link',
        external: true,
        href: 'any-scopeDocUrl-mock',
      },
      undefined,
    );
  });

  it('should show the datapass project documentation link', () => {
    // When
    render(<ServiceProviderPage />);

    // Then
    expect(LinkComponent).toHaveBeenNthCalledWith(
      3,
      {
        children: 'Partners.serviceProviderPage.datapassDocumentation.introduction.link',
        external: true,
        href: 'any-datapassDocUrl-mock',
      },
      undefined,
    );
  });

  it('should render TabsGroupComponent with correct props', () => {
    // When
    render(<ServiceProviderPage />);

    // Then
    expect(TabsGroupComponent).toHaveBeenNthCalledWith(
      1,
      {
        ariaLabel: 'Partners.serviceProviderPage.scopeSection.title',
        dataTestId: 'service-provider-scopes-tabs',
        items: [
          {
            element: expect.anything(),
            id: 'datapass-scopes-tab-button',
            label: 'Partners.serviceProviderPage.datapassScopes.title',
          },
          {
            element: expect.anything(),
            id: 'fc-scopes-tab-button',
            label: 'Partners.serviceProviderPage.fcScopes.title',
          },
        ],
      },
      undefined,
    );
  });
});
