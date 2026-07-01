import { render } from '@testing-library/react';

import { ConfigService } from '@fc/config';
import { LinkComponent, TabsGroupComponent } from '@fc/dsfr';

import serviceProviderFixture from '../../../__fixtures__/service-provider.fixture.json';
import type { ServiceProviderInterface } from '../../../interfaces';
import { ServiceProviderScopesComponent } from './service-provider-scopes.component';

describe('ServiceProviderScopesComponent', () => {
  // Given
  const datapassDocUrlMock = 'https://example.com/datapass-doc-mock';
  const scopeDocUrlMock = 'https://example.com/scope-doc-mock';

  const serviceProviderMock = serviceProviderFixture as ServiceProviderInterface;

  beforeEach(() => {
    // Given
    jest.mocked(ConfigService.get).mockReturnValue({
      datapassDocUrl: datapassDocUrlMock,
      scopeDocUrl: scopeDocUrlMock,
    });
  });

  it('should match the snapshot', () => {
    // When
    const { container } = render(
      <ServiceProviderScopesComponent
        datapassScopes={serviceProviderMock.datapassScopes}
        fcScopes={serviceProviderMock.fcScopes}
      />,
    );

    // Then
    expect(container).toMatchSnapshot();
  });

  it('should render LinkComponent twice with parameters', () => {
    // When
    render(
      <ServiceProviderScopesComponent
        datapassScopes={serviceProviderMock.datapassScopes}
        fcScopes={serviceProviderMock.fcScopes}
      />,
    );

    // Then
    expect(LinkComponent).toHaveBeenCalledTimes(2);
    expect(LinkComponent).toHaveBeenNthCalledWith(
      1,
      {
        children: 'Partners.serviceProviderPage.scopeSection.description.link',
        external: true,
        href: scopeDocUrlMock,
      },
      undefined,
    );
    expect(LinkComponent).toHaveBeenNthCalledWith(
      2,
      {
        children: 'Partners.serviceProviderPage.datapassDocumentation.introduction.link',
        external: true,
        href: datapassDocUrlMock,
      },
      undefined,
    );
  });

  it('should render TabsGroupComponent with parameters', () => {
    // When
    render(
      <ServiceProviderScopesComponent
        datapassScopes={serviceProviderMock.datapassScopes}
        fcScopes={serviceProviderMock.fcScopes}
      />,
    );

    // Then
    expect(TabsGroupComponent).toHaveBeenCalledExactlyOnceWith(
      {
        ariaLabel: 'Partners.serviceProviderPage.scopeSection.title',
        dataTestId: 'service-provider-scopes-tabs',
        items: expect.any(Array),
      },
      undefined,
    );
  });
});
