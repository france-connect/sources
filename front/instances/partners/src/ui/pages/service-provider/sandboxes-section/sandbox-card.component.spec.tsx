import { render } from '@testing-library/react';

import { CardComponent } from '@fc/dsfr';
import { t } from '@fc/i18n';

import { SandboxCardComponent, type SandboxSourceInterface } from './sandbox-card.component';

jest.mock('@fc/dsfr');
jest.mock('@fc/i18n');

describe('SandboxCardComponent', () => {
  const source: SandboxSourceInterface = {
    clientId: 'a1b2c3d4...34567890',
    createdAt: '15/01/2024',
    creator: 'Samantha Groves',
    id: 'sandbox-1',
    label: 'Instance de test 1',
    name: 'Instance de test 1',
  };

  beforeEach(() => {
    jest.mocked(t).mockImplementation((key) => key as string);
  });

  it('should match snapshot', () => {
    // When
    const { container } = render(<SandboxCardComponent source={source} />);

    // Then
    expect(container).toMatchSnapshot();
  });

  it('should render CardComponent with source data', () => {
    // When
    render(<SandboxCardComponent source={source} />);

    // Then
    expect(CardComponent).toHaveBeenCalled();
    expect(jest.mocked(CardComponent).mock.calls[0][0]).toMatchObject({
      className: 'fr-mb-2w',
      title: 'Instance de test 1',
    });
  });

  it('should display createdAt, creator and clientId', () => {
    // When
    const { getByTestId } = render(<SandboxCardComponent source={source} />);

    // Then
    expect(getByTestId('sandbox-card-created-at-sandbox-1')).toHaveTextContent('15/01/2024');
    expect(getByTestId('sandbox-card-created-by-sandbox-1')).toHaveTextContent('Samantha Groves');
    expect(getByTestId('sandbox-card-client-id-sandbox-1')).toHaveTextContent(
      'a1b2c3d4...34567890',
    );
  });
});
