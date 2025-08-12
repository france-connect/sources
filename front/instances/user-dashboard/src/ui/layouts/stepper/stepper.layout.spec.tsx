import { render } from '@testing-library/react';

import { ConfigService } from '@fc/config';
import type { StepperConfigInterface } from '@fc/dsfr';
import { StepperContextProvider } from '@fc/dsfr';

import { StepperLayout } from './stepper.layout';

describe('StepperLayout', () => {
  it('should match snapshot', () => {
    // Given
    const configMock = Symbol('any-config-mock') as unknown as StepperConfigInterface;
    jest.mocked(ConfigService.get).mockReturnValueOnce(configMock);

    // When
    const { container } = render(<StepperLayout />);

    // Then
    expect(container).toMatchSnapshot();
    expect(ConfigService.get).toHaveBeenCalledOnce();
    expect(ConfigService.get).toHaveBeenCalledWith('Stepper');
    expect(StepperContextProvider).toHaveBeenCalledOnce();
    expect(StepperContextProvider).toHaveBeenCalledWith(
      { children: expect.any(Object), config: configMock },
      undefined,
    );
  });
});
