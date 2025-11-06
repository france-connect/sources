import { render } from '@testing-library/react';

import { t } from '@fc/i18n';

import { ServiceSwitchLabelComponent } from './service-switch-label.component';

describe('ServiceSwitchLabelComponent', () => {
  beforeEach(() => {
    // Given
    jest
      .mocked(t)
      .mockReturnValueOnce('any-idp-connexion-allowed-mock')
      .mockReturnValueOnce('any-idp-connexion-blocked-mock');
  });

  it('should call t 2 times with correct params', () => {
    // When
    render(<ServiceSwitchLabelComponent checked serviceTitle="any-service" />);

    // Then
    expect(t).toHaveBeenCalledTimes(2);
    expect(t).toHaveBeenNthCalledWith(1, 'UserPreferences.idpConnexion.allowed');
    expect(t).toHaveBeenNthCalledWith(2, 'UserPreferences.idpConnexion.blocked');
  });

  it('should render the label when switch is disabled', () => {
    // When
    const { getByText } = render(
      <ServiceSwitchLabelComponent disabled checked={false} serviceTitle="any-service" />,
    );
    const titleElement = getByText(/Vous êtes connecté depuis ce compte./);
    const descriptionElement = getByText(
      /Si vous souhaitez le désactiver, vous devez vous connecter depuis un autre compte./,
    );

    // Then
    expect(titleElement).toBeInTheDocument();
    expect(descriptionElement).toBeInTheDocument();
  });

  it('should render the label when switch is inactive', () => {
    // When
    const { getByText } = render(
      <ServiceSwitchLabelComponent checked={false} serviceTitle="any-service" />,
    );
    const prefixElement = getByText(/La connexion pour votre compte/);
    const titleElement = getByText(/any-service/);
    const stateElement = getByText(/est actuellement any-idp-connexion-blocked-mock./);

    // Then
    expect(prefixElement).toBeInTheDocument();
    expect(titleElement).toBeInTheDocument();
    expect(stateElement).toBeInTheDocument();
  });

  it('should render the label when switch is active', () => {
    // When
    const { getByText } = render(
      <ServiceSwitchLabelComponent checked serviceTitle="any-service" />,
    );
    const prefixElement = getByText(/La connexion pour votre compte/);
    const titleElement = getByText(/any-service/);
    const stateElement = getByText(/est actuellement any-idp-connexion-allowed-mock./);

    // Then
    expect(prefixElement).toBeInTheDocument();
    expect(titleElement).toBeInTheDocument();
    expect(stateElement).toBeInTheDocument();
  });
});
