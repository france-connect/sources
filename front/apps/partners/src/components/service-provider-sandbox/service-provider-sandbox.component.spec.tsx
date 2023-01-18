import { render } from '@testing-library/react';

import { AccordionGroupComponent, SimpleButton } from '@fc/dsfr';
import { t } from '@fc/i18n';

import { useServiceProviderSandbox } from '../../hooks/service-provider-sandbox';
import { transformServiceProviderConfig } from '../../services/transform-service-provider-config/transform-service-provider-config.service';
import { ServiceProviderSandboxComponent } from './service-provider-sandbox.component';

jest.mock('@fc/dsfr');
jest.mock('../../hooks/service-provider-sandbox/service-provider-sandbox.hook');
jest.mock(
  '../../services/transform-service-provider-config/transform-service-provider-config.service',
);

describe('ServiceProviderSandboxComponent', () => {
  const responseConfigsMock = {
    items: [
      {
        id: 'any-config-id-1',
        title: 'Configuration de test N°1',
      },
      {
        id: 'any-config-id-2',
        title: 'Configuration de test N°2',
      },
    ],
    total: 2,
  };
  const responseUseServiceProviderSandboxMock = {
    addConfig: jest.fn(),
    configs: responseConfigsMock,
  };

  beforeEach(() => {
    // given
    jest.mocked(useServiceProviderSandbox).mockReturnValue(responseUseServiceProviderSandboxMock);
  });

  it('should match snapshot', () => {
    // when
    const { container } = render(<ServiceProviderSandboxComponent id="any-id" />);

    // then
    expect(container).toMatchSnapshot();
  });

  it('should display sandbox title with t', () => {
    // when
    render(<ServiceProviderSandboxComponent id="any-id" />);

    // then
    expect(t).toHaveBeenCalledWith('ServiceProviderSandbox.title');
  });

  it('should call transformServiceProviderConfig function, when configs is defined', () => {
    // when
    render(<ServiceProviderSandboxComponent id="any-id" />);

    // then
    expect(transformServiceProviderConfig).toHaveBeenCalledTimes(1);
    expect(transformServiceProviderConfig).toHaveBeenCalledWith(responseConfigsMock.items);
  });

  it('should not call transformServiceProviderConfig function, when configs is undefined', () => {
    // given
    jest.mocked(useServiceProviderSandbox).mockReturnValue({
      addConfig: jest.fn(),
      configs: {
        items: [],
        total: 0,
      },
    });

    // when
    render(<ServiceProviderSandboxComponent id="any-id" />);

    // then
    expect(transformServiceProviderConfig).not.toHaveBeenCalled();
  });

  it('should call AccordionGroupComponent', () => {
    // when
    render(<ServiceProviderSandboxComponent id="any-id" />);

    // then
    expect(AccordionGroupComponent).toHaveBeenCalledTimes(1);
    expect(AccordionGroupComponent).toHaveBeenCalledWith(
      expect.objectContaining({
        items: 'transformServiceProviderConfigMock',
      }),
      {},
    );
  });

  it('should call SimpleButton component', () => {
    // when
    render(<ServiceProviderSandboxComponent id="any-id" />);

    // then
    expect(SimpleButton).toHaveBeenCalledTimes(1);
    expect(SimpleButton).toHaveBeenCalledWith(
      expect.objectContaining({
        icon: 'add-line',
        label: 'ServiceProviderSandbox.addConfig',
      }),
      {},
    );
  });
});
