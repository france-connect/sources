import { render } from '@testing-library/react';

import type { Environment, ISODate } from '@fc/common';
import { isoToDate } from '@fc/common';
import { CardComponent, Sizes } from '@fc/dsfr';
import { t } from '@fc/i18n';
import type { VersionInterface } from '@fc/partners-service-providers';

import { InstanceCardComponent } from './instance.card';

describe('InstanceComponent', () => {
  // Given
  const instanceMock = {
    createdAt: 'any-createdAt-mock-1' as unknown as ISODate,
    environment: 'SANDBOX' as unknown as Environment,
    id: 'any-instance-id-mock-1',
    updatedAt: 'any-updatedAt-mock-1' as unknown as ISODate,
    versions: [
      {
        data: {
          // @NOTE API interface
          // eslint-disable-next-line @typescript-eslint/naming-convention
          client_id: 'any-client_id-mock-1',
          // @NOTE API interface
          // eslint-disable-next-line @typescript-eslint/naming-convention
          client_secret: 'any-client_secret-mock-1',
          name: 'any-name-mock-1',
        },
      } as unknown as VersionInterface,
    ],
  };

  beforeEach(() => {
    // Given
    jest.mocked(t).mockReturnValue('any-translated-date-mock');
    jest.mocked(isoToDate).mockReturnValue('any-iso-date-mock');
  });

  it('should match the snapshot', () => {
    // When
    const { container } = render(<InstanceCardComponent data={instanceMock} />);

    // Then
    expect(container).toMatchSnapshot();
  });

  it('should call isoToDate with params', () => {
    // When
    render(<InstanceCardComponent data={instanceMock} />);

    // Then
    expect(isoToDate).toHaveBeenCalledExactlyOnceWith('any-createdAt-mock-1');
  });

  it('should call t with params', () => {
    // When
    render(<InstanceCardComponent data={instanceMock} />);

    // Then
    expect(t).toHaveBeenCalledExactlyOnceWith('FC.Common.createdAt.female', {
      date: 'any-iso-date-mock',
    });
  });

  it('should call CardComponent with params', () => {
    // When
    render(<InstanceCardComponent className="any-classname-mock" data={instanceMock} />);

    // Then
    expect(CardComponent).toHaveBeenCalledWith(
      {
        children: expect.anything(),
        className: 'any-classname-mock',
        details: {
          top: {
            className: 'fr-icon-arrow-right-line',
            content: 'any-translated-date-mock',
          },
        },
        enlargeLink: true,
        link: 'any-instance-id-mock-1',
        size: Sizes.LARGE,
        title: 'any-name-mock-1',
      },
      undefined,
    );
  });
});
