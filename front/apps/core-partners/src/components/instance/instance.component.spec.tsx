import { render } from '@testing-library/react';

import { CardComponent } from '@fc/dsfr';
import { t } from '@fc/i18n';

import { InstanceComponent } from './instance.component';

describe('InstanceComponent', () => {
  it('should match the snapshot', () => {
    // Given
    const idMock = 'any-id-mock';
    const dataMock = {
      // @NOTE API interface
      // eslint-disable-next-line @typescript-eslint/naming-convention
      client_id: 'any-client_id-mock',
      // @NOTE API interface
      // eslint-disable-next-line @typescript-eslint/naming-convention
      client_secret: 'any-client_secret-mock',
      name: 'any-name-mock',
    };
    const createdAtMock = '2025-03-03T09:39:17.382Z';

    jest.mocked(t).mockReturnValueOnce('any-date-value-mock');

    // When
    const { container, getByText } = render(
      <InstanceComponent createdAt={createdAtMock} data={dataMock} id={idMock} />,
    );
    const clientIdElt = getByText('any-client_id-mock');
    const clientSecretElt = getByText('any-client_secret-mock');

    // Then
    expect(t).toHaveBeenCalledOnce();
    expect(t).toHaveBeenCalledWith('CorePartners.instance.createdAt', { date: '03/03/2025' });
    expect(container).toMatchSnapshot();
    expect(clientIdElt).toBeInTheDocument();
    expect(clientSecretElt).toBeInTheDocument();
    expect(CardComponent).toHaveBeenCalledOnce();
    expect(CardComponent).toHaveBeenCalledWith(
      {
        children: expect.any(Object),
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
      undefined,
    );
  });
});
