import { render } from '@testing-library/react';

import { LinkComponent } from '@fc/dsfr';

import { useServiceProviderDatapass } from '../../../hooks';
import { ServiceProviderDatapassComponent } from './service-provider-datapass.component';

jest.mock('../../../hooks/service-provider-datapass/service-provider-datapass.hook');

describe('ServiceProviderDatapassComponent', () => {
  // Given
  const datapassRequestIdMock = 'datapass-request-id-mock';
  const habilitationLinkMock = 'https://example.com/habilitation-mock';

  beforeEach(() => {
    // Given
    jest.mocked(useServiceProviderDatapass).mockReturnValue({
      habilitationLink: habilitationLinkMock,
    });
  });

  it('should match the snapshot', () => {
    // When
    const { container } = render(
      <ServiceProviderDatapassComponent datapassRequestId={datapassRequestIdMock} />,
    );

    // Then
    expect(container).toMatchSnapshot();
  });

  it('should call useServiceProviderHabilitation with datapassRequestId', () => {
    // When
    render(<ServiceProviderDatapassComponent datapassRequestId={datapassRequestIdMock} />);

    // Then
    expect(useServiceProviderDatapass).toHaveBeenCalledExactlyOnceWith(datapassRequestIdMock);
  });

  it('should render LinkComponent with parameters', () => {
    // When
    render(<ServiceProviderDatapassComponent datapassRequestId={datapassRequestIdMock} />);

    // Then
    expect(LinkComponent).toHaveBeenCalledExactlyOnceWith(
      {
        children: datapassRequestIdMock,
        dataTestId: 'service-provider-details-page-datapass-request-id',
        external: true,
        href: habilitationLinkMock,
      },
      undefined,
    );
  });
});
