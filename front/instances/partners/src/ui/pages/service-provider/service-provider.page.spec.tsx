import { render } from '@testing-library/react';

import { LinkComponent } from '@fc/dsfr';

import { useServiceProvider } from '../../../hooks';
import { ServiceProviderPage } from './service-provider.page';

jest.mock('../../../hooks/service-provider/service-provider.hook');

describe('ServiceProviderPage', () => {
  beforeEach(() => {
    // Given
    jest.mocked(useServiceProvider).mockReturnValue({
      datapassRequestId: 'any-datapassRequestId-mock',
      datapassScopes: ['any-scope-mock1', 'any-scope-mock2', 'any-scope-mock3'],
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

  it('should show the habilitation request link', () => {
    // When
    render(<ServiceProviderPage />);

    // Then
    expect(LinkComponent).toHaveBeenNthCalledWith(
      2,
      {
        children: 'Partners.serviceProviderPage.habilitation.requestLabel',
        external: true,
        href: 'any-habilitationLink-mock',
      },
      undefined,
    );
  });

  it('should show the service provider authorizedScopes', () => {
    // When
    const { getByText } = render(<ServiceProviderPage />);
    const scopeElt1 = getByText('any-scope-mock1');
    const scopeElt2 = getByText('any-scope-mock2');
    const scopeElt3 = getByText('any-scope-mock3');

    // Then
    expect(scopeElt1).toBeInTheDocument();
    expect(scopeElt2).toBeInTheDocument();
    expect(scopeElt3).toBeInTheDocument();
  });
});
