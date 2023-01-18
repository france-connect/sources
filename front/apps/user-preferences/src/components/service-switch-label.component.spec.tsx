import { render } from '@testing-library/react';

import { ServiceSwitchLabelComponent } from './service-switch-label.component';

describe('ServiceSwitchLabelComponent', () => {
  it('should render the label when switch is disabled', () => {
    // when
    const { getByText } = render(
      <ServiceSwitchLabelComponent disabled checked={false} serviceTitle="any-service" />,
    );
    const titleElement = getByText(/Vous êtes connecté depuis ce compte./);
    const descriptionElement = getByText(
      /Si vous souhaitez le désactiver, vous devez vous connecter depuis un autre compte./,
    );

    // then
    expect(titleElement).toBeInTheDocument();
    expect(descriptionElement).toBeInTheDocument();
  });

  it('should render the label when switch is inactive', () => {
    // when
    const { getByText } = render(
      <ServiceSwitchLabelComponent checked={false} serviceTitle="any-service" />,
    );
    const prefixElement = getByText(/La connexion pour votre compte/);
    const titleElement = getByText(/any-service/);
    const stateElement = getByText(/est actuellement bloquée./);

    // then
    expect(prefixElement).toBeInTheDocument();
    expect(titleElement).toBeInTheDocument();
    expect(stateElement).toBeInTheDocument();
  });

  it('should render the label when switch is active', () => {
    // when
    const { getByText } = render(
      <ServiceSwitchLabelComponent checked serviceTitle="any-service" />,
    );
    const prefixElement = getByText(/La connexion pour votre compte/);
    const titleElement = getByText(/any-service/);
    const stateElement = getByText(/est actuellement autorisée./);

    // then
    expect(prefixElement).toBeInTheDocument();
    expect(titleElement).toBeInTheDocument();
    expect(stateElement).toBeInTheDocument();
  });
});
