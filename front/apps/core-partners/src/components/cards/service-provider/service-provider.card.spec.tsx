import { render } from '@testing-library/react';

import { type ISODate, isoToDate } from '@fc/common';
import { CardComponent, Sizes } from '@fc/dsfr';
import { t } from '@fc/i18n';

import { ServiceProviderCardComponent } from './service-provider.card';

describe('ServiceProviderCardComponent', () => {
  const itemMock = {
    authorizedScopes: ['openid', 'email'],
    createdAt: '2022-02-22T23:00:00.000Z' as ISODate,
    datapassRequestId: '123456',
    id: 'any-id-mock',
    name: 'Service Provider Name',
    organizationName: 'Organization Name',
    updatedAt: '2024-01-01T00:00:00.000Z' as ISODate,
  };

  beforeEach(() => {
    // Given
    jest.mocked(isoToDate).mockReturnValue('23/02/2022');
    jest
      .mocked(t)
      .mockReturnValueOnce('Créée le 23/02/2022')
      .mockReturnValueOnce('any-habilitation-number-text-mock');
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
    expect(isoToDate).toHaveBeenCalledExactlyOnceWith('2022-02-22T23:00:00.000Z');
    expect(t).toHaveBeenNthCalledWith(1, 'FC.Common.createdAt.male', { date: '23/02/2022' });
  });

  it('should call CardComponent with params', () => {
    // When
    render(<ServiceProviderCardComponent data={itemMock} />);

    // Then
    expect(CardComponent).toHaveBeenCalledExactlyOnceWith(
      {
        Heading: 'h4',
        children: expect.anything(),
        className: undefined,
        details: { top: { content: 'Créée le 23/02/2022' } },
        enlargeLink: true,
        size: Sizes.MEDIUM,
        title: 'Service Provider Name',
      },
      undefined,
    );
  });

  it('should render Service provider name', () => {
    // When
    const { getByText } = render(<ServiceProviderCardComponent data={itemMock} />);
    const organizationNameElt = getByText('Organization Name');

    // Then
    expect(organizationNameElt).toBeInTheDocument();
  });

  it('should render datapass authorization id', () => {
    // When
    const { getByText } = render(<ServiceProviderCardComponent data={itemMock} />);
    const datapassRequestIdElt = getByText('123456');

    // Then
    expect(datapassRequestIdElt).toBeInTheDocument();
  });
});
