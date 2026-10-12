import { render } from '@testing-library/react';

import { Align, ButtonGroupComponent, ButtonTypes, Priorities, SimpleButton } from '@fc/dsfr';

import { ServiceProviderLinkInstancesActionsComponent } from './service-provider-link-instances-actions.component';

describe('ServiceProviderLinkInstancesActionsComponent', () => {
  // Given
  const handleCancelMock = jest.fn();
  const handleSubmitMock = jest.fn();

  it('should match the snapshot', () => {
    // When
    const { container } = render(
      <ServiceProviderLinkInstancesActionsComponent
        canSubmit
        onCancel={handleCancelMock}
        onSubmit={handleSubmitMock}
      />,
    );

    // Then
    expect(container).toMatchSnapshot();
  });

  it('should render ButtonGroupComponent aligned to the right', () => {
    // When
    render(
      <ServiceProviderLinkInstancesActionsComponent
        canSubmit
        onCancel={handleCancelMock}
        onSubmit={handleSubmitMock}
      />,
    );

    // Then
    expect(ButtonGroupComponent).toHaveBeenCalledExactlyOnceWith(
      expect.objectContaining({
        align: Align.RIGHT,
      }),
      undefined,
    );
  });

  it('should render submit button enabled when canSubmit is true', () => {
    // When
    render(
      <ServiceProviderLinkInstancesActionsComponent
        canSubmit
        onCancel={handleCancelMock}
        onSubmit={handleSubmitMock}
      />,
    );

    // Then
    expect(SimpleButton).toHaveBeenCalledWith(
      {
        children: 'Partners.linkInstances.submit',
        disabled: false,
        onClick: handleSubmitMock,
        type: ButtonTypes.BUTTON,
      },
      undefined,
    );
  });

  it('should render submit button disabled when canSubmit is false', () => {
    // When
    render(
      <ServiceProviderLinkInstancesActionsComponent
        canSubmit={false}
        onCancel={handleCancelMock}
        onSubmit={handleSubmitMock}
      />,
    );

    // Then
    expect(SimpleButton).toHaveBeenCalledWith(
      expect.objectContaining({
        disabled: true,
        onClick: handleSubmitMock,
      }),
      undefined,
    );
  });

  it('should render cancel button', () => {
    // When
    render(
      <ServiceProviderLinkInstancesActionsComponent
        canSubmit
        onCancel={handleCancelMock}
        onSubmit={handleSubmitMock}
      />,
    );

    // Then
    expect(SimpleButton).toHaveBeenCalledWith(
      {
        children: 'Partners.linkInstances.cancel',
        onClick: handleCancelMock,
        priority: Priorities.SECONDARY,
        type: ButtonTypes.BUTTON,
      },
      undefined,
    );
  });
});
