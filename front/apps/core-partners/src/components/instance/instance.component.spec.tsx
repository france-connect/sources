import { render } from '@testing-library/react';

import type { ISODate } from '@fc/common';
import { CardComponent } from '@fc/dsfr';
import { t } from '@fc/i18n';

import type { Environment } from '../../enums';
import { InstanceComponent } from './instance.component';

describe('InstanceComponent', () => {
  // Given
  const instanceItemMock = {
    createdAt: 'any-date-mock' as unknown as ISODate,
    environment: 'Sanbox' as unknown as Environment,
    id: 'any-id-mock',
    name: 'any-name-mock',
    updatedAt: 'any-date-mock' as unknown as ISODate,
    versions: [expect.any(Object)],
  };

  beforeEach(() => {
    // Given
    jest.mocked(t).mockReturnValue('any-date-value-mock');
  });

  it('should match the snapshot', () => {
    // When
    const { container } = render(<InstanceComponent item={instanceItemMock} />);

    // Then
    expect(t).toHaveBeenCalledOnce();
    expect(t).toHaveBeenCalledWith('CorePartners.instance.createdAt', { date: 'any-date-mock' });
    expect(container).toMatchSnapshot();
    expect(CardComponent).toHaveBeenCalledOnce();
    expect(CardComponent).toHaveBeenCalledWith(
      {
        details: {
          top: {
            className: 'fr-icon-arrow-right-line',
            content: 'any-date-value-mock',
          },
        },
        enlargeLink: true,
        link: 'any-id-mock',
        size: 'lg',
        title: 'any-name-mock',
      },
      {},
    );
  });
});
