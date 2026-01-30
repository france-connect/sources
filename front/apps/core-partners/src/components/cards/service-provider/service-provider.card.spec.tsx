import { render } from '@testing-library/react';

import { type ISODate, isoToDate } from '@fc/common';
import { CardComponent, Sizes } from '@fc/dsfr';
import { t } from '@fc/i18n';

import { ServiceProviderCardComponent } from './service-provider.card';

describe('ServiceProviderCardComponent', () => {
  // Given
  const dateMock = 'any-acme-date' as ISODate;
  const itemMock = {
    createdAt: dateMock as ISODate,
    datapassRequestId: 'any-datapass-request-id-mock',
    datapassScopes: ['Identifiant technique', 'Adresse électronique'],
    id: 'any-id-mock',
    name: 'any-service-provider-name-mock',
    organisation: {
      createdAt: dateMock as ISODate,
      id: 'any-organisation-id-mock',
      name: 'any-organisation-name-mock',
      serviceProviders: [],
      updatedAt: dateMock as ISODate,
    },
    organizationName: 'any-organization-name-mock',
    platform: {
      id: 'any-platform-id-mock',
      name: 'any-platform-name-mock',
    },
    updatedAt: 'any-acme-date' as ISODate,
  };

  beforeEach(() => {
    // Given
    jest.mocked(isoToDate).mockReturnValue('any-transformed-date-mock');
  });

  it('should match the snapshot', () => {
    // When
    const { container } = render(<ServiceProviderCardComponent data={itemMock} />);

    // Then
    expect(container).toMatchSnapshot();
  });

  it('should render formatted created date', () => {
    // When
    render(<ServiceProviderCardComponent data={itemMock} />);

    // Then
    expect(isoToDate).toHaveBeenCalledExactlyOnceWith(dateMock);
    expect(t).toHaveBeenNthCalledWith(1, 'FC.Common.createdAt.male', {
      date: 'any-transformed-date-mock',
    });
  });

  it('should call CardComponent with params', () => {
    // When
    render(<ServiceProviderCardComponent data={itemMock} />);

    // Then
    expect(CardComponent).toHaveBeenCalledExactlyOnceWith(
      expect.objectContaining({
        Heading: 'h4',
        children: expect.anything(),
        className: undefined,
        details: {
          top: {
            content: 'FC.Common.createdAt.male',
          },
        },
        enlargeLink: true,
        link: '/fournisseurs-de-service/any-id-mock',
        size: Sizes.MEDIUM,
        title: 'any-service-provider-name-mock',
      }),
      undefined,
    );
  });

  it('should render Service provider name', () => {
    // When
    const { getByText } = render(<ServiceProviderCardComponent data={itemMock} />);
    const organizationNameElt = getByText('any-organization-name-mock');

    // Then
    expect(organizationNameElt).toBeInTheDocument();
  });

  it('should render datapass authorization id', () => {
    // When
    const { getByText } = render(<ServiceProviderCardComponent data={itemMock} />);
    const datapassRequestIdElt = getByText('any-datapass-request-id-mock');

    // Then
    expect(datapassRequestIdElt).toBeInTheDocument();
  });
});
