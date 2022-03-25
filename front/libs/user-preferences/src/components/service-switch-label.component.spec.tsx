import { render } from '@testing-library/react';

import { ServiceSwitchLabelComponent } from './service-switch-label.component';

describe('ServiceSwitchLabelComponent', () => {
  beforeEach(() => {
    jest.clearAllMocks();
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
